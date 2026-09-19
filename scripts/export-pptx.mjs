/**
 * Vector PPTX export (Canva-class): Chromium PDF → LibreOffice Impress → PPTX.
 * Keeps editable text + vector shapes — not html2canvas screenshots.
 *
 * Usage:
 *   npm run export:pptx
 *   npm run export:pptx -- ./out/Poskamling.pptx
 */

import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import { convertPdfToPptx, renderVectorPdf, root } from "./lib/exportShared.mjs";

const outPath = path.resolve(
  process.argv[2] ?? path.join(root, "Poskamling-Tentrem-Presentasi.pptx"),
);

async function main() {
  const skipBuild = process.env.SKIP_BUILD === "1";
  const workDir = await mkdtemp(path.join(os.tmpdir(), "tentrem-pdf-"));
  const pdfPath = path.join(workDir, "deck.pdf");

  try {
    await renderVectorPdf(pdfPath, { skipBuild });
    await convertPdfToPptx(pdfPath, outPath);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
