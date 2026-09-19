import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
} from "react";

import { Shield } from "./components/Shield";
import { assets } from "./data/assets";
import { PresentModeContext } from "./hooks/usePresentMode";
import {
  ensureSlideUrl,
  parseSlideRoute,
  pushSlideUrl,
  replaceSlideUrl,
  SLIDE_COUNT,
  type SlideMode,
} from "./lib/slideRoute";
import { DECK_HOLD_EVENT } from "./hooks/useIframeParentScrollLock";
import { printToPdf, waitForPrintAssets } from "./lib/exportPdf";

import Slide01Cover from "./slides/Slide01Cover";
import Slide02Profile from "./slides/Slide02Profile";
import Slide03Regulation from "./slides/Slide03Regulation";
import Slide04Budget from "./slides/Slide04Budget";
import Slide05Pembinaan from "./slides/Slide05Pembinaan";
import Slide06PembinaanLanjut from "./slides/Slide06PembinaanLanjut";
import Slide07Penyuluhan from "./slides/Slide07Penyuluhan";
import Slide08PenyuluhanP4gnBencana from "./slides/Slide08PenyuluhanP4gnBencana";
import Slide09Flagship from "./slides/Slide09Flagship";
import Slide10Innovation from "./slides/Slide10Innovation";
import Slide11Sinergitas from "./slides/Slide11Sinergitas";
import Slide12Closing from "./slides/Slide12Closing";

const SLIDES = [
  Slide01Cover,
  Slide02Profile,
  Slide03Regulation,
  Slide04Budget,
  Slide05Pembinaan,
  Slide06PembinaanLanjut,
  Slide07Penyuluhan,
  Slide08PenyuluhanP4gnBencana,
  Slide09Flagship,
  Slide10Innovation,
  Slide11Sinergitas,
  Slide12Closing,
];

const SLIDE_W = 1280;
const SWIPE_MIN = 48;

function isCoarsePointer() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function isPortraitNow() {
  try {
    const portraitQuery = window.matchMedia?.("(orientation: portrait)");
    if (portraitQuery && typeof portraitQuery.matches === "boolean") {
      return portraitQuery.matches;
    }
  } catch {
    /* ignore unsupported matchMedia */
  }

  if (window.screen?.orientation?.type) {
    return window.screen.orientation.type.startsWith("portrait");
  }

  const { h, w } = getViewportSize();
  return h >= w;
}

function getViewportSize() {
  const vv = window.visualViewport;
  return {
    w: vv?.width ?? window.innerWidth,
    h: vv?.height ?? window.innerHeight,
  };
}

async function enterBrowserFullscreen(el: HTMLElement) {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
    webkitRequestFullScreen?: () => Promise<void> | void;
  };
  try {
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (anyEl.webkitRequestFullscreen) await anyEl.webkitRequestFullscreen();
    else if (anyEl.webkitRequestFullScreen) await anyEl.webkitRequestFullScreen();
  } catch {
    /* user gesture / policy may block — scale still fills the viewport */
  }
}

async function exitBrowserFullscreen() {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void;
    webkitCancelFullScreen?: () => Promise<void> | void;
  };
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
    else if (doc.webkitCancelFullScreen) await doc.webkitCancelFullScreen();
  } catch {
    /* ignore */
  }
}

async function lockLandscape() {
  try {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>;
    };
    if (orient?.lock) await orient.lock("landscape");
  } catch {
    /* only works after fullscreen on many browsers */
  }
}

function unlockOrientation() {
  try {
    screen.orientation?.unlock?.();
  } catch {
    /* ignore */
  }
}

function readInitialRoute() {
  return ensureSlideUrl();
}

const CRITICAL_PRELOAD_URLS = [
  "https://tentrem.vercel.app/",
  "https://tentremadmin.vercel.app/",
  ...Object.values(assets),
];

function preloadCriticalAssets() {
  if (typeof window === "undefined") return;

  const seen = new Set<string>();

  const warmImage = (url: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);

    const img = new Image();
    img.decoding = "sync";
    img.loading = "eager";
    img.src = url;
  };

  const warmDocument = (url: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);

    try {
      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = new URL(url).origin;
      document.head.appendChild(preconnect);
    } catch {
      /* ignore invalid URL */
    }

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    fetch(url, { cache: "force-cache", credentials: "omit" }).catch(() => undefined);
  };

  CRITICAL_PRELOAD_URLS.forEach((url) => {
    if (/\.(png|jpe?g|svg|webp|gif)$/i.test(url)) {
      warmImage(url);
      return;
    }
    warmDocument(url);
  });
}

export default function App() {
  const initial = useMemo(() => readInitialRoute(), []);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const presentRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const warm = () => preloadCriticalAssets();
    warm();
    const timer = window.setTimeout(warm, 300);
    return () => window.clearTimeout(timer);
  }, []);
  const touchStartX = useRef<number | null>(null);
  const chromeTimer = useRef<number | null>(null);
  /** Block IntersectionObserver URL writes until after programmatic scroll settles */
  const suppressIoUntil = useRef(0);
  const currentRef = useRef(initial.index);

  const [presenting, setPresenting] = useState(initial.mode === "present");
  const [current, setCurrent] = useState(initial.index);
  const [exporting, setExporting] = useState<"pdf" | null>(null);
  const [pdfPrint, setPdfPrint] = useState(false);
  const pdfRootRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [deckScale, setDeckScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);

  currentRef.current = current;

  const syncUrl = useCallback((mode: SlideMode, index: number, push = false) => {
    if (push) pushSlideUrl(mode, index);
    else replaceSlideUrl(mode, index);
  }, []);

  const holdIo = useCallback((ms = 400) => {
    suppressIoUntil.current = performance.now() + ms;
  }, []);

  // Mockup TENTREM: tahan IO sebentar saja (jangan sampai membekukan navigasi)
  useEffect(() => {
    const onHold = (e: Event) => {
      const ms = (e as CustomEvent<{ ms?: number }>).detail?.ms ?? 500;
      holdIo(Math.min(ms, 700));
    };
    window.addEventListener(DECK_HOLD_EVENT, onHold);
    return () => window.removeEventListener(DECK_HOLD_EVENT, onHold);
  }, [holdIo]);

  const scrollDeckTo = useCallback(
    (index: number) => {
      const el = slideRefs.current[index];
      if (!el) return false;
      holdIo(450);
      el.scrollIntoView({ block: "start", behavior: "auto" });
      return true;
    },
    [holdIo],
  );

  const bumpChrome = useCallback(() => {
    setChromeVisible(true);
    if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    chromeTimer.current = window.setTimeout(() => setChromeVisible(false), 2600);
  }, []);

  const updateLayoutFlags = useCallback(() => {
    const mobile = isCoarsePointer() || window.innerWidth < 920;
    const portrait = isPortraitNow();
    setIsMobile(mobile);

    const { w, h } = getViewportSize();
    if (presenting && mobile && !portrait) {
      // Landscape present: scale ke penuh layar
      setScale(Math.min(w / SLIDE_W, h / 720));
    } else if (presenting && !mobile) {
      // Desktop present
      setScale(Math.min(w / SLIDE_W, h / 720));
    } else if (mobile && portrait) {
      // Portrait mobile viewer: fit lebar layar, sisakan ruang nav bawah
      const navH = 88;
      const availH = h - navH;
      setScale(Math.min(w / SLIDE_W, availH / 720));
    } else if (mobile && !portrait) {
      // Landscape mobile → akan masuk present, scale landscape
      setScale(Math.min(w / SLIDE_W, h / 720));
    }

    // Deck scale: fit slide width into available viewport width
    const availW = Math.min(window.innerWidth * 0.92, window.innerWidth - 32);
    setDeckScale(Math.min(availW / SLIDE_W, 1));
  }, [presenting]);

  useEffect(() => {
    updateLayoutFlags();
    const onResize = () => updateLayoutFlags();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    screen.orientation?.addEventListener?.("change", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
      screen.orientation?.removeEventListener?.("change", onResize);
    };
  }, [updateLayoutFlags]);

  // Mobile landscape → langsung present
  useEffect(() => {
    if (!isMobile || presenting) return;
    const portrait = isPortraitNow();
    if (!portrait) {
      setPresenting(true);
      syncUrl("present", currentRef.current, false);
    }
  }, [isMobile, presenting, syncUrl]);

  useEffect(() => {
    if (!presenting) {
      unlockOrientation();
      void exitBrowserFullscreen();
      document.body.classList.remove("is-presenting");
      return;
    }

    document.body.classList.add("is-presenting");
    bumpChrome();
    updateLayoutFlags();

    const root = presentRootRef.current;
    if (root) {
      void (async () => {
        await enterBrowserFullscreen(root);
        await lockLandscape();
        updateLayoutFlags();
        // Pastikan benar-benar fullscreen; ulang jika gagal/terinterupsi
        if (!document.fullscreenElement) {
          await enterBrowserFullscreen(root);
        }
      })();
    }

    return () => {
      document.body.classList.remove("is-presenting");
      if (chromeTimer.current) window.clearTimeout(chromeTimer.current);
    };
  }, [presenting, bumpChrome, updateLayoutFlags]);

  // Keep URL in sync with present index
  useEffect(() => {
    if (!presenting) return;
    syncUrl("present", current, false);
  }, [presenting, current, syncUrl]);

  // Browser back/forward
  useEffect(() => {
    const onPop = () => {
      const route = parseSlideRoute();
      holdIo(500);
      setCurrent(route.index);
      setPresenting(route.mode === "present");
      if (route.mode === "deck") {
        requestAnimationFrame(() => scrollDeckTo(route.index));
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [holdIo, scrollDeckTo]);

  // Deck: scroll ke slide dari URL saat mount / keluar present
  useLayoutEffect(() => {
    if (presenting || isMobile) return;
    holdIo(500);
    // rAF ganda: tunggu ref slide terpasang setelah deck mount
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        scrollDeckTo(currentRef.current);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [presenting, isMobile, holdIo, scrollDeckTo]);

  // Deck: update /slide/N saat user scroll (jangan override scroll programatik)
  useEffect(() => {
    if (presenting || isMobile) return;

    let io: IntersectionObserver | null = null;
    let cancelled = false;

    const attach = () => {
      if (cancelled) return;
      const nodes = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      if (nodes.length < SLIDES.length) {
        window.setTimeout(attach, 32);
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          if (performance.now() < suppressIoUntil.current) return;

          const visible = entries
            .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.45)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible?.target) return;

          const idx = nodes.indexOf(visible.target as HTMLDivElement);
          if (idx < 0 || idx === currentRef.current) return;

          currentRef.current = idx;
          setCurrent(idx);
          replaceSlideUrl("deck", idx);
        },
        { threshold: [0.45, 0.6, 0.75], rootMargin: "-18% 0px -18% 0px" },
      );

      nodes.forEach((n) => io!.observe(n));
    };

    attach();
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, [presenting, isMobile]);

  const goNext = useCallback(() => {
    setCurrent((c) => {
      const next = Math.min(c + 1, SLIDES.length - 1);
      currentRef.current = next;
      if (presenting) syncUrl("present", next, true);
      return next;
    });
    bumpChrome();
  }, [bumpChrome, presenting, syncUrl]);

  const goPrev = useCallback(() => {
    setCurrent((c) => {
      const prev = Math.max(c - 1, 0);
      currentRef.current = prev;
      if (presenting) syncUrl("present", prev, true);
      return prev;
    });
    bumpChrome();
  }, [bumpChrome, presenting, syncUrl]);

  const exitPresent = useCallback(() => {
    const idx = currentRef.current;
    setPresenting(false);
    syncUrl("deck", idx, false);
    holdIo(500);
    void exitBrowserFullscreen();
    unlockOrientation();
  }, [syncUrl, holdIo]);

  useEffect(() => {
    if (!presenting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (!isMobile) exitPresent();
        else bumpChrome();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        const root = presentRootRef.current;
        if (root) void enterBrowserFullscreen(root).then(lockLandscape);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [presenting, goNext, goPrev, isMobile, bumpChrome, exitPresent]);

  // ESC browser sering keluar fullscreen dulu — anggap itu keluar presentasi (1x ESC)
  useEffect(() => {
    if (!presenting) return;
    const onFs = () => {
      if (!document.fullscreenElement && !isMobile) {
        exitPresent();
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs as EventListener);
    };
  }, [presenting, isMobile, exitPresent]);

  const startPresent = useCallback(
    async (fromIndex = 0) => {
      currentRef.current = fromIndex;
      setCurrent(fromIndex);
      setPresenting(true);
      syncUrl("present", fromIndex, true);
    },
    [syncUrl],
  );

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
    bumpChrome();
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportViaDevApi = async (kind: "pdf") => {
    const res = await fetch(`/api/export/${kind}`, { method: "POST" });
    if (!res.ok) {
      let message = `Export ${kind.toUpperCase()} gagal (${res.status})`;
      try {
        const data = (await res.json()) as { error?: string };
        if (data.error) message = data.error;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }
    const blob = await res.blob();
    downloadBlob(blob, "Poskamling-Tentrem-Presentasi.pdf");
  };

  // Playwright / ?pdf=1 → layout siap cetak (teks + SVG vector, bukan screenshot)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pdf") !== "1") return;

    let cancelled = false;
    document.body.classList.add("is-pdf-print");
    setPdfPrint(true);
    setPresenting(false);
    document.documentElement.dataset.pdfReady = "0";

    void (async () => {
      // Wait for React to mount .pdf-export-root
      for (let i = 0; i < 40 && !cancelled; i++) {
        if (pdfRootRef.current) break;
        await new Promise((r) => window.setTimeout(r, 50));
      }
      if (cancelled) return;
      await waitForPrintAssets(pdfRootRef.current ?? document);
      if (!cancelled) document.documentElement.dataset.pdfReady = "1";
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const exportPDF = async () => {
    setExporting("pdf");
    setPresenting(false);
    try {
      await exportViaDevApi("pdf");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      window.alert(`${msg}\n\nPDF gagal dibuat. Coba ulang atau cek koneksi server.`);
    } finally {
      setExporting(null);
    }
  };

  const CurrentSlide = useMemo(() => SLIDES[current] ?? SLIDES[0], [current]);
  const showDeck = !presenting && !isMobile;
  const showMobileViewer = !presenting && isMobile;

  // Kalkulasi scale langsung saat render agar tidak bergantung state async
  const mobileViewerScale = useMemo(() => {
    if (!isMobile) return scale;
    const vv = window.visualViewport;
    const vw = vv?.width ?? window.innerWidth;
    const vh = vv?.height ?? window.innerHeight;
    const navH = 88;
    const stageH = Math.max(1, vh - navH);
    return Math.min(vw / SLIDE_W, stageH / 720);
  }, [isMobile, scale]);

  return (
    <PresentModeContext.Provider value={presenting}>
      <div className="deck-shell">
        {pdfPrint && (
          <div className="pdf-export-root" ref={pdfRootRef} aria-hidden={!pdfPrint}>
            {SLIDES.map((SlideComp, i) => (
              <div key={`pdf-${i}`} className="slide-wrap" data-slide={i + 1}>
                <SlideComp />
              </div>
            ))}
          </div>
        )}

        {showDeck && (
          <>
            <div className="deck-toolbar">
              <div className="deck-toolbar-inner">
                <div className="deck-brand">
                  <Shield size={26} color="#e0ac5c" />
                  <div className="deck-brand-text">
                    <strong>Poskamling Tentrem</strong>
                    <span>
                      Presentasi Lomba PIN Siskamling · {SLIDE_COUNT} slide · /slide/
                      {current + 1}
                    </span>
                  </div>
                </div>
                <div className="deck-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => void exportPDF()}
                    disabled={exporting !== null}
                    title="PDF vector"
                  >
                    {exporting === "pdf" ? "Siapkan PDF…" : "Export PDF"}
                  </button>
                  <button className="btn btn-primary" onClick={() => void startPresent(current)}>
                    Present Fullscreen
                  </button>
                </div>
              </div>
            </div>

            {SLIDES.map((SlideComp, i) => (
              <div
                key={i}
                className="slide-wrap"
                data-slide={i + 1}
                ref={(el) => { slideRefs.current[i] = el; }}
                style={{
                  width: SLIDE_W,
                  height: Math.round(720 * deckScale),
                  transformOrigin: "top center",
                  transform: `scale(${deckScale})`,
                  marginBottom: deckScale < 1 ? `${Math.round(720 * deckScale - 720)}px` : undefined,
                }}
              >
                <SlideComp />
              </div>
            ))}
          </>
        )}

        {/* ── Mobile portrait: slideshow viewer ── */}
        {showMobileViewer && (
          <div className="mobile-viewer" ref={presentRootRef}>
            {/* Slide — sama persis dengan present-stage */}
            <div className="mobile-viewer-stage">
              <div
                className="present-slide-holder"
                style={{ transform: `scale(${mobileViewerScale})` }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <CurrentSlide />
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="present-progress"
              style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
            />

            {/* Bottom nav */}
            <nav className="mobile-nav" aria-label="Navigasi slide">
              <button
                className="mobile-nav-btn"
                onClick={() => void exportPDF()}
                disabled={exporting !== null}
                aria-label="Export PDF"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
                </svg>
                <span>{exporting === "pdf" ? "…" : "PDF"}</span>
              </button>

              <button
                className="mobile-nav-btn mobile-nav-btn--prev"
                onClick={goPrev}
                disabled={current === 0}
                aria-label="Slide sebelumnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <span className="mobile-nav-count">{current + 1} / {SLIDES.length}</span>

              <button
                className="mobile-nav-btn mobile-nav-btn--next"
                onClick={goNext}
                disabled={current === SLIDES.length - 1}
                aria-label="Slide berikutnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              <button
                className="mobile-nav-btn mobile-nav-btn--present"
                onClick={() => void startPresent(current)}
                aria-label="Presentasi fullscreen"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
                </svg>
                <span>Present</span>
              </button>
            </nav>
          </div>
        )}

        {/* ── Present mode (desktop + mobile landscape) ── */}
        {presenting && (
          <div
            className="present-overlay"
            ref={presentRootRef}
            onTouchStart={(e) => {
              onTouchStart(e);
              const root = presentRootRef.current;
              if (isMobile && root && !document.fullscreenElement) {
                void enterBrowserFullscreen(root).then(lockLandscape);
              }
            }}
            onTouchEnd={onTouchEnd}
            onMouseMove={bumpChrome}
            onClick={() => {
              bumpChrome();
              const root = presentRootRef.current;
              if (isMobile && root && !document.fullscreenElement) {
                void enterBrowserFullscreen(root).then(lockLandscape);
              }
            }}
          >
            <div
              className="present-progress"
              style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
            />
            <div className={`present-count ${chromeVisible ? "is-visible" : ""}`}>
              {current + 1} / {SLIDES.length}
            </div>
            <div className="present-stage">
              <div className="present-slide-holder" style={{ transform: `scale(${scale})` }}>
                <CurrentSlide />
              </div>
            </div>
            <button
              className="present-hit present-hit--prev"
              aria-label="Sebelumnya"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            />
            <button
              className="present-hit present-hit--next"
              aria-label="Berikutnya"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            />
          </div>
        )}
      </div>
    </PresentModeContext.Provider>
  );
}
