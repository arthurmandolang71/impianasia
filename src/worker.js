// Dispatcher terpusat untuk notifikasi webhook Midtrans.
// Satu akun Midtrans cuma bisa punya satu Payment Notification URL, jadi semua
// produk SaaS di bawah impian.asia lapor ke sini, lalu di-forward berdasarkan
// prefix order_id ke aplikasi tujuan masing-masing.
//
// Murni router/relay — tidak verifikasi signature_key (tanggung jawab aplikasi
// tujuan) dan tidak menyentuh database apa pun di sini.

const MIDTRANS_ROUTES = [
	{ prefix: "JASAKU-SUB-", url: "https://jasaku.impian.asia/api/billing/midtrans/notification" },
];

// Dispatcher terpusat untuk webhook Mayar. Satu akun Mayar cuma bisa punya
// satu Webhook URL (Integration -> Webhook di dashboard Mayar), jadi semua
// produk SaaS di bawah impian.asia yang pakai Mayar lapor ke sini, lalu body
// mentahnya di-fan-out APA ADANYA ke semua aplikasi di MAYAR_DOWNSTREAMS.
// Tidak ada routing per aplikasi (productId tidak reliable, dan sebagian app
// bikin invoice baru tiap transaksi) — tiap aplikasi sendiri yang mengabaikan
// event yang bukan miliknya dengan mencocokkan ke DB masing-masing.
//
// Mayar tidak punya signature/secret untuk verifikasi payload webhook (beda
// dari Midtrans yang punya signature_key) — aplikasi tujuan tetap harus
// validasi ulang status transaksi ke Mayar API sebelum mengaktifkan apa pun.
//
// `secretEnv` (opsional) = nama secret Worker (`wrangler secret put <NAMA>`)
// yang dikirim sebagai header X-Dispatcher-Secret, supaya aplikasi tujuan bisa
// menolak request yang tidak lewat dispatcher ini. Satu secret per aplikasi,
// jadi bocor di satu aplikasi tidak membuka yang lain.
const MAYAR_DOWNSTREAMS = [
	{
		name: "datangneh",
		url: "https://app.datangneh.my.id/api/mayar/webhook",
		secretEnv: "DATANGNEH_WEBHOOK_SECRET",
	},
	{
		name: "jasaku", // AkutansiJasa
		url: "https://jasaku.impian.asia/api/billing/mayar/webhook",
	},
];

const FORWARD_TIMEOUT_MS = 10_000;

// Body balasan aplikasi tujuan tidak diteruskan ke pemanggil (endpoint ini publik,
// jadi pesan error/detail internal tujuan jangan sampai terbaca orang lain) —
// cukup status HTTP-nya supaya Midtrans/Mayar tahu perlu kirim ulang atau tidak.
async function forwardRaw(url, rawBody, contentType, secret, tag) {
	const headers = { "content-type": contentType || "application/json" };
	if (secret) headers["x-dispatcher-secret"] = secret;

	const upstream = await fetch(url, {
		method: "POST",
		headers,
		body: rawBody,
		signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
	});

	if (!upstream.ok) {
		const upstreamBody = await upstream.text();
		console.warn(`[${tag}] ${url} membalas HTTP ${upstream.status}: ${upstreamBody.slice(0, 500)}`);
	}

	return Response.json({ ok: upstream.ok }, { status: upstream.status });
}

async function handleMidtransNotification(request) {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const rawBody = await request.text();

	let orderId;
	try {
		orderId = JSON.parse(rawBody)?.order_id;
	} catch {
		console.warn("[midtrans-dispatcher] body bukan JSON valid, ditolak");
		return new Response("Invalid JSON body", { status: 400 });
	}

	if (typeof orderId !== "string") {
		console.warn("[midtrans-dispatcher] notifikasi tanpa order_id, ditolak");
		return new Response("Missing order_id", { status: 400 });
	}

	const route = MIDTRANS_ROUTES.find((r) => orderId.startsWith(r.prefix));

	if (!route) {
		console.warn(`[midtrans-dispatcher] tidak ada rute untuk order_id="${orderId}"`);
		return new Response("No route for order_id prefix", { status: 404 });
	}

	console.log(`[midtrans-dispatcher] order_id="${orderId}" -> prefix="${route.prefix}" -> ${route.url}`);

	try {
		return await forwardRaw(route.url, rawBody, request.headers.get("content-type"), null, "midtrans-dispatcher");
	} catch (err) {
		console.error(`[midtrans-dispatcher] gagal forward ke ${route.url}: ${err}`);
		return new Response("Upstream forward failed", { status: 502 });
	}
}

async function forwardMayar(downstream, rawBody, contentType, env) {
	const headers = { "content-type": contentType || "application/json" };
	const secret = downstream.secretEnv ? env[downstream.secretEnv] : null;
	if (downstream.secretEnv && !secret) {
		console.warn(`[mayar-dispatcher] secret ${downstream.secretEnv} belum diset, "${downstream.name}" diteruskan tanpa X-Dispatcher-Secret`);
	}
	if (secret) headers["x-dispatcher-secret"] = secret;

	const upstream = await fetch(downstream.url, {
		method: "POST",
		headers,
		body: rawBody,
		// Redirect (mis. ke /login karena route belum dikecualikan dari auth) dianggap
		// gagal, bukan diikuti — supaya kelihatan di log
		redirect: "manual",
		signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
	});

	if (!upstream.ok) {
		const upstreamBody = await upstream.text();
		throw new Error(`HTTP ${upstream.status}: ${upstreamBody.slice(0, 500)}`);
	}

	return upstream.status;
}

async function handleMayarWebhook(request, env) {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const rawBody = await request.text();

	let payload;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		console.warn("[mayar-dispatcher] body bukan JSON valid, ditolak");
		return new Response("Invalid JSON body", { status: 400 });
	}

	const event = payload?.event;
	const dataId = payload?.data?.id;
	if (!event || !dataId) {
		console.warn("[mayar-dispatcher] payload tanpa event / data.id, ditolak");
		return new Response("Missing event or data.id", { status: 400 });
	}

	const contentType = request.headers.get("content-type");
	const results = await Promise.allSettled(
		MAYAR_DOWNSTREAMS.map((d) => forwardMayar(d, rawBody, contentType, env)),
	);

	// Selalu 200 ke Mayar selama semua downstream sudah dicoba: kalau satu gagal
	// lalu Mayar retry, app lain yang sudah sukses akan memproses dobel. Kegagalan
	// dicatat per downstream untuk dicek/di-replay manual.
	const summary = results.map((r, i) => {
		const { name } = MAYAR_DOWNSTREAMS[i];
		if (r.status === "fulfilled") return `${name}=${r.value}`;
		console.error(`[mayar-dispatcher] gagal forward event="${event}" data.id="${dataId}" ke "${name}": ${r.reason}`);
		return `${name}=GAGAL`;
	});
	console.log(`[mayar-dispatcher] event="${event}" data.id="${dataId}" -> ${summary.join(" ")}`);

	return Response.json({ ok: true });
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === "/api/midtrans/notification") {
			return handleMidtransNotification(request);
		}

		if (url.pathname === "/api/mayar/webhook") {
			return handleMayarWebhook(request, env);
		}

		return new Response("Not Found", { status: 404 });
	},
};
