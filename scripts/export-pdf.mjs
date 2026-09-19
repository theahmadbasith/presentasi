/**
 * PDF export using pdf-lib for a consistent, mobile-safe, and large-readable deck.
 *
 * Usage:
 *   npm run export:pdf
 *   npm run export:pdf -- ./out/Poskamling.pdf
 */

import path from "node:path";
import { writeFile } from "node:fs/promises";
import { buildActualPdfBuffer } from "../api/lib/exportDeck.mjs";
import { root } from "./lib/exportShared.mjs";

const outPath = path.resolve(
  process.argv[2] ?? path.join(root, "Poskamling-Tentrem-Presentasi.pdf"),
);

try {
  const buffer = await buildActualPdfBuffer();
  await writeFile(outPath, buffer);
  console.log(`Wrote pdf-lib PDF → ${outPath}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
