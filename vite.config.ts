import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

function vectorExportApi() {
  let busy = false;

  return {
    name: "vector-export-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/__export/pptx" && url !== "/__export/pdf") {
          next();
          return;
        }

        if (req.method !== "GET" && req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        if (busy) {
          res.statusCode = 409;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Export sedang berjalan, tunggu sebentar…" }));
          return;
        }

        busy = true;
        const kind = url.endsWith("pptx") ? "pptx" : "pdf";
        const script = path.join(root, "scripts", kind === "pptx" ? "export-pptx.mjs" : "export-pdf.mjs");
        const workDir = await mkdtemp(path.join(os.tmpdir(), `tentrem-ui-${kind}-`));
        const outFile = path.join(
          workDir,
          kind === "pptx" ? "Poskamling-Tentrem-Presentasi.pptx" : "Poskamling-Tentrem-Presentasi.pdf",
        );

        try {
          await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [script, outFile], {
              cwd: root,
              env: { ...process.env },
              stdio: ["ignore", "pipe", "pipe"],
            });
            let err = "";
            child.stderr.on("data", (d) => {
              err += d.toString();
              server.config.logger.warn(d.toString());
            });
            child.stdout.on("data", (d) => server.config.logger.info(d.toString().trimEnd()));
            child.on("exit", (code) =>
              code === 0 ? resolve() : reject(new Error(err || `export ${kind} failed (${code})`)),
            );
          });

          if (!existsSync(outFile)) {
            throw new Error(`Output ${kind} tidak ditemukan`);
          }

          const filename =
            kind === "pptx"
              ? "Poskamling-Tentrem-Presentasi.pptx"
              : "Poskamling-Tentrem-Presentasi.pdf";
          res.statusCode = 200;
          res.setHeader(
            "Content-Type",
            kind === "pptx"
              ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              : "application/pdf",
          );
          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
          createReadStream(outFile)
            .on("close", () => {
              void rm(workDir, { recursive: true, force: true });
            })
            .pipe(res);
        } catch (e) {
          await rm(workDir, { recursive: true, force: true }).catch(() => {});
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
        } finally {
          busy = false;
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), vectorExportApi()],
  base: "/",
  appType: "spa",
});
