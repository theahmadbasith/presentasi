import { useEffect, useState } from "react";

/** True while body has `.is-pdf-print` (browser print / Playwright PDF). */
export function useIsPdfPrint() {
  const [active, setActive] = useState(() =>
    typeof document !== "undefined" ? document.body.classList.contains("is-pdf-print") : false,
  );

  useEffect(() => {
    const sync = () => setActive(document.body.classList.contains("is-pdf-print"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return active;
}
