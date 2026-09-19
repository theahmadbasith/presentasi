import chromiumPackage from "@sparticuz/chromium";
import { execFileSync } from "node:child_process";
import { chromium as chromiumCore } from "playwright-core";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import PptxGenJS from "pptxgenjs";
import { jsPDF } from "jspdf";

import { convertPdfToPptx } from "../../scripts/lib/exportShared.mjs";

const PAGE_COUNT = 12;

async function launchBrowser() {
  try {
    return await chromiumCore.launch({
      args: chromiumPackage.args,
      executablePath: await chromiumPackage.executablePath(),
      headless: chromiumPackage.headless,
    });
  } catch {
    const { chromium } = await import("playwright");
    return chromium.launch({ headless: true });
  }
}

async function renderActualDeckPdf() {
  const target = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/?pdf=1`
    : "http://127.0.0.1:4173/?pdf=1";

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    });

    await page.goto(target, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForFunction(
      () => document.documentElement.dataset.pdfReady === "1",
      { timeout: 120_000 },
    );
    await page.waitForTimeout(500);

    return await page.pdf({
      width: "13.333in",
      height: "7.5in",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

export async function buildFallbackPdfBuffer() {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  for (let i = 1; i <= PAGE_COUNT; i += 1) {
    if (i > 1) pdf.addPage();

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, width, height, "F");

    pdf.setDrawColor(148, 163, 184);
    pdf.line(48, 104, width - 48, 104);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(26);
    pdf.text("Poskamling Tentrem", 48, 52);

    pdf.setFontSize(16);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Slide ${i} / ${PAGE_COUNT}`, 48, 82);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(20);
    pdf.text("Presentasi Lomba PIN Siskamling", 48, 150);

    pdf.setFontSize(14);
    pdf.setTextColor(51, 65, 85);
    pdf.text("Export fallback Vercel | file siap didownload", 48, 182);
  }

  return Buffer.from(pdf.output("arraybuffer"));
}

export async function buildActualPdfBuffer() {
  try {
    const pdfBuffer = await renderActualDeckPdf();
    if (pdfBuffer && pdfBuffer.length > 0) return Buffer.from(pdfBuffer);
  } catch (error) {
    console.warn("Render actual deck failed, using fallback export:", error instanceof Error ? error.message : error);
  }
  return buildFallbackPdfBuffer();
}

export async function buildFallbackPptxBuffer() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Poskamling Tentrem";
  pptx.company = "Desa Tugurejo";
  pptx.subject = "Presentasi";
  pptx.title = "Poskamling Tentrem";

  for (let i = 1; i <= PAGE_COUNT; i += 1) {
    const slide = pptx.addSlide();
    slide.background = { color: "F8FAFC" };

    slide.addText(`Slide ${i} / ${PAGE_COUNT}`, {
      x: 0.6,
      y: 0.6,
      w: 3.4,
      h: 0.6,
      fontFace: "Arial",
      fontSize: 24,
      bold: true,
      color: "0F172A",
    });

    slide.addText("Poskamling Tentrem", {
      x: 0.6,
      y: 1.7,
      w: 6,
      h: 0.6,
      fontFace: "Arial",
      fontSize: 18,
      color: "475569",
    });

    slide.addText("Presentasi Lomba PIN Siskamling", {
      x: 0.8,
      y: 3.4,
      w: 10,
      h: 0.8,
      fontFace: "Arial",
      fontSize: 22,
      color: "0F172A",
    });

    slide.addText("Export fallback Vercel", {
      x: 0.8,
      y: 5.2,
      w: 8,
      h: 0.5,
      fontFace: "Arial",
      fontSize: 14,
      color: "334155",
    });
  }

  return Buffer.from(await pptx.write({ outputType: "nodebuffer" }));
}

export async function buildActualPptxBuffer() {
  try {
    const pdfBuffer = await buildActualPdfBuffer();
    if (!pdfBuffer || pdfBuffer.length === 0) throw new Error("rendered PDF is empty");

    const hasLibreOffice = (() => {
      try {
        execFileSync("soffice", ["--version"], { stdio: "ignore" });
        return true;
      } catch {
        try {
          execFileSync("libreoffice", ["--version"], { stdio: "ignore" });
          return true;
        } catch {
          return false;
        }
      }
    })();

    if (!hasLibreOffice) {
      throw new Error("LibreOffice unavailable");
    }

    const workDir = await mkdtemp(path.join(os.tmpdir(), "tentrem-pptx-"));
    const pdfPath = path.join(workDir, "deck.pdf");
    const pptxPath = path.join(workDir, "deck.pptx");

    try {
      await writeFile(pdfPath, pdfBuffer);
      await convertPdfToPptx(pdfPath, pptxPath);
      return await readFile(pptxPath);
    } finally {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  } catch (error) {
    console.warn("Render actual PPTX failed, using fallback:", error instanceof Error ? error.message : error);
  }
  return buildFallbackPptxBuffer();
}
