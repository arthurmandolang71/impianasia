# Impian Asia — Landing Page

Landing page satu halaman untuk **Impian Asia**, perusahaan layanan IT dengan misi
_"Membuat Perusahaan Naik Kelas dengan Layanan IT"_.

Dibangun sebagai situs statis (HTML/CSS/JS murni, tanpa build step) dan
di-deploy ke **Cloudflare Pages**.

## Struktur

```
.
├── index.html      # Halaman utama
├── styles.css      # Gaya & tata letak responsif
├── script.js       # Interaksi (menu mobile, form, reveal-on-scroll)
├── favicon.svg     # Ikon situs
└── README.md
```

## Menjalankan secara lokal

Cukup buka `index.html` di browser, atau jalankan server statis:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

## Deploy ke Cloudflare Pages

```bash
npx wrangler pages deploy . --project-name=impianasia
```

## Bagian halaman

- **Hero** — tagline & ajakan konsultasi
- **Layanan** — 6 layanan IT inti
- **Keunggulan** — alasan memilih Impian Asia
- **Proses** — 4 langkah kerja
- **Tentang** — profil singkat
- **Kontak** — form konsultasi (demo front-end)

---

© Impian Asia
