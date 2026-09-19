/**
 * PPTX export using pptxgenjs for stable, clear, editable slides.
 *
 * Usage:
 *   npm run export:pptx
 *   npm run export:pptx -- ./out/Poskamling.pptx
 */

import path from "node:path";
import { writeFile } from "node:fs/promises";
import { buildActualPptxBuffer } from "../api/lib/exportDeck.mjs";
import { root } from "./lib/exportShared.mjs";

const outPath = path.resolve(
  process.argv[2] ?? path.join(root, "Poskamling-Tentrem-Presentasi.pptx"),
);

async function main() {
  const buffer = await buildActualPptxBuffer();
  await writeFile(outPath, buffer);
  console.log(`Wrote PPTX → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
