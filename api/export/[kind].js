import {
  buildActualPdfBuffer,
  buildActualPptxBuffer,
} from "../lib/exportDeck.mjs";

export const config = {
  maxDuration: 60,
};

function getMimeType(kind) {
  return kind === "pdf"
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.presentationml.presentation";
}

function getFilename(kind) {
  return kind === "pdf"
    ? "Poskamling-Tentrem-Presentasi.pdf"
    : "Poskamling-Tentrem-Presentasi.pptx";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawKind = String(req.query?.type ?? req.query?.kind ?? "").toLowerCase();
  const kind = rawKind === "pptx" ? "pptx" : rawKind === "pdf" ? "pdf" : "";

  if (!kind) {
    res.status(400).json({ error: "Kind export harus pdf atau pptx" });
    return;
  }

  try {
    const buffer = kind === "pdf" ? await buildActualPdfBuffer() : await buildActualPptxBuffer();

    res.setHeader("Content-Type", getMimeType(kind));
    res.setHeader("Content-Disposition", `attachment; filename="${getFilename(kind)}"`);
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
