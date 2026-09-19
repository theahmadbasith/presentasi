import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { buildDist, serveDist } from "../../scripts/lib/exportShared.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const PAGE_COUNT = 12;
const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

function wrapText(font, text, maxWidth, size) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [" "];
}

function drawWrappedText(page, font, x, y, text, size, color, maxWidth, lineHeight = 1.2, maxLines = 2) {
  const lines = wrapText(font, text, maxWidth, size).slice(0, maxLines);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * size * lineHeight,
      size,
      font,
      color,
    });
  });
}

function drawBulletBlock(page, font, titleFont, x, y, num, title, desc) {
  const numBoxX = x;
  const numBoxY = y;

  page.drawRectangle({
    x: numBoxX,
    y: numBoxY - 18,
    width: 36,
    height: 36,
    color: rgb(0.11, 0.44, 0.25),
    borderColor: rgb(0.11, 0.44, 0.25),
    borderWidth: 1,
    radius: 18,
  });

  page.drawText(String(num).padStart(2, "0"), {
    x: numBoxX + 7,
    y: numBoxY - 9,
    size: 14,
    font: titleFont,
    color: rgb(1, 1, 1),
  });

  const itemTitleSize = 17;
  const itemDescSize = 15.5;
  const textX = x + 54;
  const textY = y;

  page.drawText(title, {
    x: textX,
    y: textY,
    size: itemTitleSize,
    font: titleFont,
    color: rgb(0.07, 0.12, 0.18),
  });

  const descLines = wrapText(font, desc, 520, itemDescSize).slice(0, 2);
  descLines.forEach((line, descIndex) => {
    page.drawText(line, {
      x: textX,
      y: textY - 21 - descIndex * 18,
      size: itemDescSize,
      font,
      color: rgb(0.39, 0.45, 0.53),
    });
  });

  return y - 76;
}

async function buildDeckPdfBuffer() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Poskamling Tentrem Presentasi");
  pdfDoc.setSubject("PDF export compatible");
  pdfDoc.setAuthor("Poskamling Tentrem");
  pdfDoc.setProducer("pdf-lib");

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const deckMeta = [
    {
      title: "Desa Tugurejo",
      lead: "Desa Tugurejo berpredikat DESTANA UTAMA Jawa Timur — desa mandiri dan berkapasitas dalam mengelola serta memitigasi risiko bencana.",
      items: [
        { num: 1, title: "20 Meter dari Kantor Desa & Posko Satlinmas", desc: "Koordinasi cepat dengan pemdes dan posko saat darurat." },
        { num: 2, title: "Disamping sempadan Sungai Kalimati", desc: "Titik monitoring untuk Early Warning System debit air sungai." },
        { num: 3, title: "Akses Utama Desa (Jl. Sekar Pethak)", desc: "Pengawasan akses keluar masuk desa dan mobilisasi." },
      ],
    },
    {
      title: "Landasan Hukum & Legalitas",
      lead: "Payung hukum penyelenggaraan Poskamling Tentrem.",
      items: [
        { num: 1, title: "Peraturan Bupati Ponorogo", desc: "Tentang Sistem Keamanan Lingkungan Masyarakat" },
        { num: 2, title: "Surat Edaran Bupati Ponorogo", desc: "No. 300.1.4/KH/3/405.14/2026" },
        { num: 3, title: "Surat Himbauan Kepala Desa Tugurejo", desc: "No. 140/02/35/.02.01.2001/2026" },
      ],
    },
    {
      title: "Pembinaan & Pelatihan",
      lead: "Pembinaan kolaboratif lintas sektor untuk kesiapsiagaan masyarakat.",
      items: [
        { num: 1, title: "Babinsa", desc: "Pelatihan keamanan lingkungan dan penguatan koordinasi." },
        { num: 2, title: "Bhabinkamtibmas", desc: "Orientasi teknis pencegahan gangguan keamanan." },
        { num: 3, title: "Satgas & Damkar", desc: "Simulasi respons cepat dan penanganan risiko." },
      ],
    },
    {
      title: "Penyuluhan & Edukasi",
      lead: "Meningkatkan literasi masyarakat terhadap keselamatan dan kewaspadaan.",
      items: [
        { num: 1, title: "Trantibum", desc: "Penyuluhan tertib lingkungan dan keamanan lingkungan." },
        { num: 2, title: "Posyandu", desc: "Pemantauan dan koordinasi di wilayah RW / RT." },
        { num: 3, title: "P4GN & Bencana", desc: "Mitigasi dan kesiapsiagaan bencana berbasis komunitas." },
      ],
    },
    {
      title: "Program Unggulan",
      lead: "Inisiatif yang menjadi ikon konektivitas dan pelayanan masyarakat.",
      items: [
        { num: 1, title: "Portal Digital", desc: "Integrasi data dan informasi layanan publik desa." },
        { num: 2, title: "Pemberdayaan Jimpitan", desc: "Kebersamaan dalam menjaga keamanan lingkungan." },
        { num: 3, title: "Kota Tangguh", desc: "Sinergi warga dan aparat untuk desa aman dan damai." },
      ],
    },
    {
      title: "Inovasi & Teknologi",
      lead: "Pemanfaatan teknologi untuk memperkuat koordinasi dan respons cepat.",
      items: [
        { num: 1, title: "Digital Monitoring", desc: "Pelacakan kegiatan dan situasi lingkungan secara real-time." },
        { num: 2, title: "Data Terpusat", desc: "Integrasi data kegiatan untuk pengambilan keputusan cepat." },
        { num: 3, title: "Komunikasi Cepat", desc: "Penyampaian informasi kepada warga tepat waktu." },
      ],
    },
    {
      title: "Sinergitas Stakeholder",
      lead: "Kolaborasi multi-pihak membangun sistem keamanan lingkungan yang kuat.",
      items: [
        { num: 1, title: "Desa & RT/RW", desc: "Koordinasi fungsi pengawasan dan deteksi dini." },
        { num: 2, title: "Polres & TNI", desc: "Penguatan keamanan dan respons cepat di wilayah." },
        { num: 3, title: "Masyarakat", desc: "Peran aktif warga dalam menjaga ketertiban lingkungan." },
      ],
    },
    {
      title: "Kebersamaan Masyarakat",
      lead: "Semangat gotong royong menjadi fondasi utama Siskamling Tentrem.",
      items: [
        { num: 1, title: "Keamanan Lingkungan", desc: "Jaga wilayah tetap aman, tertib, dan kondusif." },
        { num: 2, title: "Pelayanan Warga", desc: "Responsif terhadap kebutuhan warga di setiap kejadian." },
        { num: 3, title: "Kemandirian Desa", desc: "Masyarakat aktif menjaga lingkungan secara bersama-sama." },
      ],
    },
    {
      title: "Peta & Lokasi",
      lead: "Lokasi strategis memperkuat efektivitas pengamatan dan deteksi dini.",
      items: [
        { num: 1, title: "Jalur Utama", desc: "Akses utama desa menjadi titik pengawasan penting." },
        { num: 2, title: "Sungai & Batas Desa", desc: "Monitoring terhadap risiko debit air dan pergerakan." },
        { num: 3, title: "Koordinasi Posko", desc: "Fast response saat dimulai situasi genting." },
      ],
    },
    {
      title: "Komitmen & Akselerasi",
      lead: "Keberlanjutan program menjadi prioritas utama dalam pembangunan desa.",
      items: [
        { num: 1, title: "Agenda Berkala", desc: "Evaluasi rutin program untuk menjaga efektivitas." },
        { num: 2, title: "Peningkatan Kapasitas", desc: "Pelatihan terus berkembang sesuai kebutuhan." },
        { num: 3, title: "Sistem Terintegrasi", desc: "Semua komponen bergerak terkoordinasi dengan baik." },
      ],
    },
    {
      title: "Penutup",
      lead: "Poskamling Tentrem hadir sebagai garda terdepan dalam menciptakan keamanan dan kedamaian.",
      items: [
        { num: 1, title: "Aman", desc: "Lingkungan tetap kondusif dan tertib." },
        { num: 2, title: "Tangguh", desc: "Siap menghadapi risiko dan tantangan." },
        { num: 3, title: "Tentram", desc: "Mewujudkan kehidupan yang harmonis dan damai." },
      ],
    },
  ];

  for (let i = 1; i <= PAGE_COUNT; i += 1) {
    const page = pdfDoc.addPage([SLIDE_WIDTH, SLIDE_HEIGHT]);
    const { width, height } = page.getSize();

    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.97, 0.98, 0.99) });
    page.drawRectangle({ x: 0, y: 0, width, height: 18, color: rgb(0.23, 0.32, 0.47) });

    const meta = deckMeta[i - 1] ?? deckMeta[0];

    page.drawText(`Slide ${i}`, {
      x: 54,
      y: height - 58,
      size: 14,
      font: regularFont,
      color: rgb(0.45, 0.52, 0.62),
    });

    if (i === 1) {
      page.drawText("Poskamling Tentrem", {
        x: 72,
        y: 504,
        size: 36,
        font: boldFont,
        color: rgb(0.06, 0.09, 0.16),
      });

      page.drawText("Presentasi Lomba PIN Siskamling", {
        x: 72,
        y: 452,
        size: 22,
        font: regularFont,
        color: rgb(0.29, 0.35, 0.42),
      });

      page.drawText("Desa Tugurejo", {
        x: 72,
        y: 334,
        size: 18,
        font: regularFont,
        color: rgb(0.39, 0.45, 0.53),
      });
      continue;
    }

    page.drawText(meta.title, {
      x: 72,
      y: height - 102,
      size: 28,
      font: boldFont,
      color: rgb(0.06, 0.09, 0.16),
    });

    drawWrappedText(page, regularFont, 72, height - 144, meta.lead, 18, rgb(0.38, 0.44, 0.52), 520, 1.4, 2);

    let currentY = 470;
    const listX = 72;

    meta.items.forEach((item) => {
      currentY = drawBulletBlock(page, regularFont, boldFont, listX, currentY, item.num, item.title, item.desc);
    });
  }

  return Buffer.from(await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false }));
}

export async function buildFallbackPdfBuffer() {
  return buildDeckPdfBuffer();
}

async function buildSlideImagePdfBuffer() {
  await buildDist();
  const distDir = path.join(projectRoot, "dist");
  const { server, base } = await serveDist(distDir);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2,
      isMobile: false,
    });

    await page.goto(`${base}/?pdf=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.dataset.pdfReady === "1", null, {
      timeout: 60_000,
    });
    await page.waitForTimeout(300);

    const pdfDoc = await PDFDocument.create();
    const slides = page.locator(".pdf-export-root .slide-wrap");
    const count = await slides.count();

    for (let i = 0; i < count; i += 1) {
      const slide = slides.nth(i);
      const buffer = await slide.screenshot({ animations: "disabled" });
      const image = await pdfDoc.embedPng(buffer);
      const pageObj = pdfDoc.addPage([SLIDE_WIDTH, SLIDE_HEIGHT]);
      pageObj.drawImage(image, {
        x: 0,
        y: 0,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
      });
    }

    if (count === 0) {
      throw new Error("Tidak ada slide yang bisa di-render untuk PDF.");
    }

    return Buffer.from(await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false }));
  } finally {
    await browser.close();
    server.close();
  }
}

export async function buildActualPdfBuffer() {
  try {
    return await buildSlideImagePdfBuffer();
  } catch (error) {
    console.warn("Render slide snapshot PDF gagal, pakai fallback custom PDF:", error);
    return buildDeckPdfBuffer();
  }
}


