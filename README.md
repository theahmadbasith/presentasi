# Poskamling Tentrem

Presentasi digital 12 slide untuk Lomba PIN Siskamling dengan fokus pada program Poskamling Tentrem, dibangun menggunakan Vite, React, dan TypeScript.

## Fitur utama

- Deck presentasi 12 slide dengan navigasi scroll dan tombol presentasi fullscreen
- Mode desktop dan mobile yang responsif
- Export PDF dari UI aplikasi
- API export di folder API untuk runtime Vercel
- Styling custom untuk tampilan slide asli dengan proporsi 16:9
- Mockup HP dan laptop untuk slide inovasi dengan scroll guard agar tidak mengganggu deck

## Stack yang dipakai

- React 18
- TypeScript
- Vite
- Playwright / Chromium
- pdf-lib
- Vercel serverless API

## Menjalankan proyek lokal

```bash
npm install
npm run dev
```

Buka URL yang muncul di terminal, biasanya:

```bash
http://localhost:5173
```

## Mode presentasi

- Klik tombol Present untuk masuk fullscreen
- Navigasi keyboard:
  - Panah kanan / Spasi: slide berikutnya
  - Panah kiri: slide sebelumnya
  - Esc: keluar presentasi
- Di perangkat mobile, layout akan otomatis menyesuaikan dan meminta orientasi landscape untuk performa terbaik

## Export file

Aplikasi menyediakan tombol export langsung dari toolbar:

- Export PDF

Untuk runtime Vercel, endpoint export aktif ada di:

```bash
/api/export/pdf
```

Dengan konfigurasi yang sudah diatur di `vercel.json` agar route API tidak tertangkap oleh rewrite SPA.

## Build produksi

```bash
npm run build
```

Untuk preview build produksi:

```bash
npm run preview
```

## Struktur folder utama

```bash
src/
├── App.tsx
├── components/
├── data/
├── hooks/
├── lib/
├── slides/
├── styles.css
└── main.tsx

api/
├── export/
└── lib/

public/
├── assets/
├── favicon/
├── site.webmanifest
└── ...

scripts/
├── export-pdf.mjs
└── lib/
```

## Asset gambar

Gambar slides dan logo berada di folder `public/assets/`. Daftar path aktif diatur di:

- `src/data/assets.ts`

Gunakan nama file yang konsisten dan sesuai konteks slide agar struktur asset tetap rapi, ringan, dan tidak ada file tak terpakai.

## Deploy ke Vercel

1. Push repo ke GitHub
2. Import project di Vercel
3. Pastikan framework diatur ke Vite
4. Deploy otomatis mengikuti branch utama

Pastikan API export tetap dipublikasikan karena file PDF dibuat dari route serverless.

## Catatan proyek

- Presentasi dirancang untuk tampilan asli, bukan template generik
- Export dibuat untuk menjaga kualitas visual agar tetap sesuai desain slide
- Fallback tetap ada untuk keamanan runtime, tetapi render asli digunakan jika lingkungan mendukungnya
