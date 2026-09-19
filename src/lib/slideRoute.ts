/** 1-based slide paths: /slide/1 … /slide/12, /present/1 … /present/12 */

export const SLIDE_COUNT = 12;

export type SlideMode = "deck" | "present";

export type SlideRoute = {
  mode: SlideMode;
  /** 0-based index */
  index: number;
};

function clampIndex(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(SLIDE_COUNT - 1, Math.max(0, Math.floor(n)));
}

function matchRoute(raw: string): SlideRoute | null {
  const present = raw.match(/\/present\/(\d+)/);
  if (present) {
    return { mode: "present", index: clampIndex(Number(present[1]) - 1) };
  }
  const slide = raw.match(/\/slide\/(\d+)/);
  if (slide) {
    return { mode: "deck", index: clampIndex(Number(slide[1]) - 1) };
  }
  return null;
}

/** Parse pathname or hash (`#/slide/3`) into route state. */
export function parseSlideRoute(
  pathname = typeof window !== "undefined" ? window.location.pathname : "/",
  hash = typeof window !== "undefined" ? window.location.hash : "",
): SlideRoute {
  // Prefer explicit hash routes when present
  if (hash.startsWith("#/") || hash.startsWith("#slide") || hash.startsWith("#present")) {
    const fromHash = matchRoute(hash.replace(/^#/, ""));
    if (fromHash) return fromHash;
  }

  const fromPath = matchRoute(pathname);
  if (fromPath) return fromPath;

  return { mode: "deck", index: 0 };
}

export function slidePath(mode: SlideMode, index: number) {
  const n = clampIndex(index) + 1;
  return mode === "present" ? `/present/${n}` : `/slide/${n}`;
}

function currentPathname() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function withSearchAndHash(path: string) {
  return `${path}${window.location.search}${window.location.hash}`;
}

export function replaceSlideUrl(mode: SlideMode, index: number) {
  const path = slidePath(mode, index);
  const next = withSearchAndHash(path);
  const current = `${window.location.pathname.replace(/\/+$/, "") || "/"}${window.location.search}${window.location.hash}`;
  const nextNorm = `${path.replace(/\/+$/, "") || "/"}${window.location.search}${window.location.hash}`;
  if (current === nextNorm) return;
  window.history.replaceState({ mode, index }, "", next);
}

export function pushSlideUrl(mode: SlideMode, index: number) {
  const path = slidePath(mode, index);
  const next = withSearchAndHash(path);
  if (currentPathname() === path.replace(/\/+$/, "")) {
    window.history.replaceState({ mode, index }, "", next);
    return;
  }
  window.history.pushState({ mode, index }, "", next);
}

/** Normalize bare `/` or `/index.html` to `/slide/1` (or keep hash route). */
export function ensureSlideUrl() {
  const route = parseSlideRoute();
  const path = window.location.pathname;
  if (path === "/" || path === "" || path.endsWith("/index.html")) {
    replaceSlideUrl(route.mode, route.index);
  }
  return route;
}
