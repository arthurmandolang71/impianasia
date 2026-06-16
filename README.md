# PT Impian Asia Utama — Corporate Website

Landing page satu halaman untuk **PT Impian Asia Utama**, mitra teknologi premium dengan misi
_"Teknologi untuk Pertumbuhan"_. Desain mengikuti sistem desain **Lumina Tech** (Stitch):
tema navy gelap dengan aksen emerald & gold dan gaya glassmorphic.

Dibangun sebagai situs statis (HTML + Tailwind CDN + JS murni, tanpa build step) dan
di-deploy ke **Cloudflare Workers** (static assets) — otomatis setiap kali push ke GitHub.

## Struktur

```
.
├── public/             # Semua file yang disajikan publik (root situs)
│   ├── index.html      # Halaman utama (Tailwind config + markup + JSON-LD)
│   ├── script.js       # Interaksi (menu mobile, form, glass-card, reveal-on-scroll)
│   ├── images/         # Logo, favicon & foto (logo.png, favicon.png, team.jpg, about.jpg)
│   ├── robots.txt      # Aturan crawler + lokasi sitemap
│   └── sitemap.xml     # Peta situs untuk mesin pencari
├── wrangler.jsonc      # Konfigurasi Cloudflare Worker (static assets)
├── package.json        # Pin versi wrangler + skrip dev/deploy
└── README.md
```

## SEO

Dioptimalkan berdasarkan riset keyword Semrush (pasar Indonesia). Mencakup:
title & meta description bertarget keyword, canonical, Open Graph + Twitter Card,
structured data JSON-LD (Organization/ProfessionalService, WebSite, FAQPage),
section FAQ, alt text deskriptif, `robots.txt`, dan `sitemap.xml`.

Domain produksi: **https://impian.asia** (dikonfigurasi sebagai custom domain Worker
di `wrangler.jsonc` dan dipakai pada canonical, Open Graph, JSON-LD, `robots.txt`, & `sitemap.xml`).

## Menjalankan secara lokal

```bash
npm install        # sekali saja
npm run dev        # wrangler dev — meniru lingkungan produksi
# atau server statis sederhana:
python3 -m http.server 8000 --directory public
```

## Deploy

### Otomatis (CI/CD) — direkomendasikan
Repo ini terhubung ke **Cloudflare Workers Builds**. Setiap `git push` ke branch
utama akan otomatis menjalankan `wrangler deploy` dan menayangkan situs.

```bash
git add -A
git commit -m "update konten"
git push        # → Cloudflare otomatis deploy
```

### Manual
```bash
npm run deploy   # = wrangler deploy
```

> Pastikan nama Worker pada `wrangler.jsonc` (`"name": "impianasia"`) sama dengan
> Worker yang Anda hubungkan di dashboard Cloudflare.

## Bagian halaman

- **Hero** — tagline, ajakan konsultasi, badge growth
- **Services** — 3 layanan inti (Website, SaaS, Konsultasi IT)
- **About** — profil & nilai perusahaan
- **Testimonial** — kutipan klien
- **Contact / CTA** — form konsultasi (demo front-end)

---

© PT Impian Asia Utama
