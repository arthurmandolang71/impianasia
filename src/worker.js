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
// produk SaaS di bawah impian.asia yang pakai Mayar juga lapor ke sini, lalu
// di-forward ke aplikasi tujuan berdasarkan `match(data)`. Tiap aplikasi bisa
// punya cara identifikasi beda: yang produknya tetap dicocokkan lewat
// `data.productId`, yang bikin invoice baru tiap transaksi (productId
// berubah-ubah) dicocokkan lewat field custom yang mereka set sendiri saat
// create invoice (mis. `data.extraData.idProd`).
//
// Mayar tidak punya signature/secret untuk verifikasi payload webhook (beda
// dari Midtrans yang punya signature_key) — aplikasi tujuan tetap harus
// validasi ulang status transaksi ke Mayar API sebelum mengaktifkan apa pun.
const MAYAR_ROUTES = [
	{
		label: "datangneh (extraData.idProd)",
		match: (data) => data?.extraData?.idProd === "datangneh-license",
		url: "https://app.datangneh.my.id/api/mayar/webhook",
	},
	// { label: "jasaku (productId tetap)", match: (data) => data?.productId === "isi-product-id-dari-dashboard-mayar", url: "https://jasaku.impian.asia/api/billing/mayar/webhook" },
];

const FORWARD_TIMEOUT_MS = 10_000;

async function forwardRaw(url, rawBody, contentType) {
	const upstream = await fetch(url, {
		method: "POST",
		headers: { "content-type": contentType || "application/json" },
		body: rawBody,
		signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
	});

	const upstreamBody = await upstream.text();

	return new Response(upstreamBody, {
		status: upstream.status,
		headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
	});
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
		return await forwardRaw(route.url, rawBody, request.headers.get("content-type"));
	} catch (err) {
		console.error(`[midtrans-dispatcher] gagal forward ke ${route.url}: ${err}`);
		return new Response("Upstream forward failed", { status: 502 });
	}
}

async function handleMayarWebhook(request) {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	const rawBody = await request.text();

	let data;
	try {
		data = JSON.parse(rawBody)?.data;
	} catch {
		console.warn("[mayar-dispatcher] body bukan JSON valid, ditolak");
		return new Response("Invalid JSON body", { status: 400 });
	}

	const route = MAYAR_ROUTES.find((r) => r.match(data));

	if (!route) {
		console.warn(`[mayar-dispatcher] tidak ada rute cocok untuk payload: productId="${data?.productId}" extraData=${JSON.stringify(data?.extraData)}`);
		return new Response("No route matched", { status: 404 });
	}

	console.log(`[mayar-dispatcher] cocok dengan rute "${route.label}" -> ${route.url}`);

	try {
		return await forwardRaw(route.url, rawBody, request.headers.get("content-type"));
	} catch (err) {
		console.error(`[mayar-dispatcher] gagal forward ke ${route.url}: ${err}`);
		return new Response("Upstream forward failed", { status: 502 });
	}
}

export default {
	async fetch(request) {
		const url = new URL(request.url);

		if (url.pathname === "/api/midtrans/notification") {
			return handleMidtransNotification(request);
		}

		if (url.pathname === "/api/mayar/webhook") {
			return handleMayarWebhook(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
