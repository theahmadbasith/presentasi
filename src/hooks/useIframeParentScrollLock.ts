import { useEffect, type RefObject } from "react";

export const DECK_HOLD_EVENT = "poskamling:hold-deck";

type GuardState = {
  until: number;
  x: number;
  y: number;
};

const shells = new Set<HTMLElement>();
let guard: GuardState | null = null;
let patched = false;
let scrollHandler: ((this: Window, ev: Event) => void) | null = null;

const origScrollIntoView = Element.prototype.scrollIntoView;

function notifyDeckHold(ms: number) {
  window.dispatchEvent(new CustomEvent(DECK_HOLD_EVENT, { detail: { ms } }));
}

function isInsideAnyShell(el: Element | null) {
  if (!el) return false;
  for (const shell of shells) {
    if (shell.contains(el)) return true;
  }
  return false;
}

function ensurePatch() {
  if (patched) return;
  patched = true;

  Element.prototype.scrollIntoView = function scrollIntoViewGuarded(
    this: Element,
    arg?: boolean | ScrollIntoViewOptions,
  ) {
    if (guard && performance.now() < guard.until && !isInsideAnyShell(this)) {
      return;
    }
    return origScrollIntoView.call(this, arg as boolean & ScrollIntoViewOptions);
  };

  scrollHandler = () => {
    if (!guard || performance.now() >= guard.until) return;
    const dy = Math.abs(window.scrollY - guard.y);
    const dx = Math.abs(window.scrollX - guard.x);
    // Hanya koreksi lompatan besar (efek Darurat), biarkan scroll deck biasa
    if (dy > 120 || dx > 120) {
      window.scrollTo({ left: guard.x, top: guard.y, behavior: "auto" });
    }
  };

  window.addEventListener("scroll", scrollHandler, { capture: true, passive: true });
}

function armGuard(ms = 900) {
  ensurePatch();
  const now = performance.now();
  guard = {
    until: Math.max(now + ms, guard?.until ?? now),
    x: window.scrollX,
    y: window.scrollY,
  };
  notifyDeckHold(Math.min(ms, 500));
}

function clearGuard() {
  guard = null;
}

function blurIframes(shell: HTMLElement) {
  shell.querySelectorAll("iframe").forEach((frame) => {
    try {
      frame.blur();
    } catch {
      /* ignore */
    }
  });
}

/**
 * Guard ringan singleton untuk mockup TENTREM.
 * Tidak membekukan scroll halaman (tanpa patch scrollTo / tanpa loop rAF).
 */
export function useIframeParentScrollLock(
  shellRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const shell = shellRef.current;
    if (!shell) return;

    ensurePatch();
    shells.add(shell);

    const onPointerDown = () => {
      armGuard(1000);
    };

    const onMouseLeave = () => {
      blurIframes(shell);
      clearGuard();
    };

    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!isInsideAnyShell(t)) clearGuard();
    };

    shell.addEventListener("pointerdown", onPointerDown, true);
    shell.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("pointerdown", onDocPointerDown, true);

    return () => {
      shells.delete(shell);
      shell.removeEventListener("pointerdown", onPointerDown, true);
      shell.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("pointerdown", onDocPointerDown, true);
      if (shells.size === 0) clearGuard();
    };
  }, [shellRef, enabled]);
}
