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

const FORWARD_TIMEOUT_MS = 10_000;

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
		const upstream = await fetch(route.url, {
			method: "POST",
			headers: { "content-type": request.headers.get("content-type") || "application/json" },
			body: rawBody,
			signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
		});

		const upstreamBody = await upstream.text();
		console.log(`[midtrans-dispatcher] forward selesai, status upstream=${upstream.status}`);

		return new Response(upstreamBody, {
			status: upstream.status,
			headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
		});
	} catch (err) {
		console.error(`[midtrans-dispatcher] gagal forward ke ${route.url}: ${err}`);
		return new Response("Upstream forward failed", { status: 502 });
	}
}

export default {
	async fetch(request) {
		const url = new URL(request.url);

		if (url.pathname === "/api/midtrans/notification") {
			return handleMidtransNotification(request);
		}

		return new Response("Not Found", { status: 404 });
	},
};
