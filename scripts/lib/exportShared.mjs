/**
 * Shared helpers for vector PDF export.
 */

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, mkdtemp, copyFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, "../..");

export function run(cmd, args, cwd = root, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: opts.silent ? "pipe" : "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, ...opts.env },
    });
    let stderr = "";
    if (opts.silent) {
      child.stderr?.on("data", (d) => {
        stderr += d.toString();
      });
    }
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}${stderr ? `\n${stderr}` : ""}`)),
    );
  });
}

export async function buildDist() {
  await run("npm", ["run", "build"], root);
}

export async function serveDist(distDir) {
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/") rel = "/index.html";

    let file = path.join(distDir, rel);
    const ext = path.extname(file).toLowerCase();

    if (!ext || !existsSync(file) || (existsSync(file) && statSync(file).isDirectory())) {
      file = path.join(distDir, "index.html");
    }

    if (!file.startsWith(distDir) || !existsSync(file)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const type = mime[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    createReadStream(file).pipe(res);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return { server, base: `http://127.0.0.1:${port}` };
}

/** Vector PDF via Chromium print engine (selectable text, SVG, full-res images). */
export async function renderVectorPdf(outPath, { skipBuild = false } = {}) {
  if (!skipBuild) {
    console.log("Building production bundle…");
    await buildDist();
  }

  const distDir = path.join(root, "dist");
  if (!existsSync(distDir)) {
    throw new Error("dist/ missing — run build first");
  }

  const { server, base } = await serveDist(distDir);
  console.log(`Serving ${distDir} at ${base}`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    });

    await page.goto(`${base}/?pdf=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.dataset.pdfReady === "1", null, {
      timeout: 60_000,
    });
    await page.waitForTimeout(400);

    await mkdir(path.dirname(outPath), { recursive: true });
    await page.pdf({
      path: outPath,
      width: "13.333in",
      height: "7.5in",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    console.log(`Wrote vector PDF → ${outPath}`);
  } finally {
    await browser.close();
    server.close();
  }
}

