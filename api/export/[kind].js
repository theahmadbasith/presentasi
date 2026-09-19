import { buildActualPdfBuffer } from "../lib/exportDeck.mjs";

export const config = {
  maxDuration: 60,
};

function getMimeType() {
  return "application/pdf";
}

function getFilename() {
  return "Poskamling-Tentrem-Presentasi.pdf";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawKind = String(req.query?.type ?? req.query?.kind ?? "").toLowerCase();
  const kind = rawKind === "pdf" ? "pdf" : "";

  if (!kind) {
    res.status(400).json({ error: "Export hanya tersedia untuk PDF." });
    return;
  }

  try {
    const buffer = await buildActualPdfBuffer();

    res.setHeader("Content-Type", getMimeType());
    res.setHeader("Content-Disposition", `attachment; filename="${getFilename()}"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Content-Length", String(buffer.length));

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Export API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Export gagal dibuat di Vercel",
    });
  }
}
