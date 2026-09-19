/**
 * HD vector PDF export via Chromium (same engine as Chrome "Save as PDF").
 *
 * Usage:
 *   npm run export:pdf
 *   npm run export:pdf -- ./out/Poskamling.pdf
 */

import path from "node:path";
import { renderVectorPdf, root } from "./lib/exportShared.mjs";

const outPath = path.resolve(
  process.argv[2] ?? path.join(root, "Poskamling-Tentrem-Presentasi.pdf"),
);

renderVectorPdf(outPath).catch((err) => {
  console.error(err);
  process.exit(1);
});
