/** Vector/text PDF via Chromium print — not raster screenshots. */

export async function waitForPrintAssets(root: ParentNode = document) {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => {
            window.clearTimeout(timer);
            resolve();
          };
          const timer = window.setTimeout(done, 8_000);
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
    ),
  );

  // Two frames so layout + paint settle before print
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}

/**
 * Opens the system print dialog. In Chrome/Edge choose:
 * Destination → Save as PDF · Margins → None · Background graphics → On
 * Result keeps selectable text, SVG vectors, and full-res images.
 */
export function printToPdf(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("afterprint", finish);
      window.clearTimeout(fallback);
      resolve();
    };

    window.addEventListener("afterprint", finish, { once: true });
    // Some browsers never fire afterprint reliably, and mobile blockers
    // reject calls made after async work. We keep the trigger close to the
    // user gesture and provide a conservative fallback timeout.
    const fallback = window.setTimeout(finish, 60_000);

    const trigger = () => {
      try {
        window.print();
      } catch (error) {
        console.warn("Print dialog unavailable:", error);
        finish();
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(trigger);
    });
  });
}
