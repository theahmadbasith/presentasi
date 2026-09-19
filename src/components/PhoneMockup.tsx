import { useRef, useState, type CSSProperties } from "react";
import { assets } from "../data/assets";
import { useIframeParentScrollLock } from "../hooks/useIframeParentScrollLock";
import { useIsPdfPrint } from "../hooks/useIsPdfPrint";

const TENTREM_URL = "https://tentrem.vercel.app/";

/** Viewport mobile asli di dalam layar HP */
const VIEW_W = 390;
const VIEW_H = 800;
const BASE_SCALE = 0.52;
/** Gutter tipis untuk menyembunyikan scrollbar native */
const SCROLL_GUTTER = 10;

interface Props {
  scale?: number;
}

export function PhoneMockup({ scale = BASE_SCALE }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [src] = useState<string>(TENTREM_URL);
  const isPdf = useIsPdfPrint();

  useIframeParentScrollLock(shellRef, !isPdf);

  const screenW = Math.round(VIEW_W * scale);
  const screenH = Math.round(VIEW_H * scale);
  const chrome = scale / BASE_SCALE;

  const statusH = Math.max(18, Math.round(22 * chrome));
  const islandW = Math.max(32, Math.round(42 * chrome));
  const islandH = Math.max(9, Math.round(12 * chrome));
  const cam = Math.max(3.5, Math.round(5 * chrome));
  const timeSize = Math.max(7.5, Math.round(9.5 * chrome * 10) / 10);
  const icoW = Math.max(9, Math.round(11.5 * chrome));
  const batW = Math.max(12, Math.round(16 * chrome));
  const batH = Math.max(5.5, Math.round(7 * chrome));
  const homeW = Math.max(44, Math.round(56 * chrome));
  const padX = Math.max(7, Math.round(10 * chrome));

  /* PDF: screenshot sudah termasuk frame HP — jangan double-bezel */
  if (isPdf) {
    return (
      <div className="phone-static-shot" title="Portal warga TENTREM">
        <img
          src={assets.tentremPhone}
          alt="Portal warga TENTREM di ponsel"
          width={342}
          height={607}
          decoding="sync"
        />
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className="phone-shell"
      title="Portal warga TENTREM"
      style={{ "--phone-chrome": chrome } as CSSProperties}
    >
      <span className="phone-btn phone-btn--silent" aria-hidden />
      <span className="phone-btn phone-btn--vol-up" aria-hidden />
      <span className="phone-btn phone-btn--vol-down" aria-hidden />
      <span className="phone-btn phone-btn--power" aria-hidden />

      <div className="phone-bezel">
        <div className="phone-status" style={{ height: statusH }} aria-hidden>
          <div
            className="phone-island"
            style={{
              width: islandW,
              height: islandH,
              top: Math.max(3, Math.round(4 * chrome)),
              paddingRight: Math.max(3, Math.round(4 * chrome)),
            }}
          >
            <span className="phone-island-cam" style={{ width: cam, height: cam }} />
          </div>

          <div className="phone-status-row" style={{ padding: `0 ${padX}px` }}>
            <span className="phone-status-time" style={{ fontSize: timeSize }}>
              09.41
            </span>

            <div className="phone-status-right" style={{ gap: Math.max(3, Math.round(4 * chrome)) }}>
              <svg
                className="phone-status-ico"
                viewBox="0 0 18 12"
                style={{ width: icoW, height: Math.round(icoW * 0.72) }}
                aria-hidden
              >
                <rect x="0" y="8" width="3" height="4" rx="0.6" fill="currentColor" opacity="0.35" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" fill="currentColor" opacity="0.55" />
                <rect x="9" y="3" width="3" height="9" rx="0.6" fill="currentColor" opacity="0.8" />
                <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.6" fill="currentColor" />
              </svg>

              <svg
                className="phone-status-ico phone-status-ico--wifi"
                viewBox="0 0 16 12"
                style={{ width: Math.round(icoW * 0.85), height: Math.round(icoW * 0.65) }}
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M8 9.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm0-3.3c1.5 0 2.9.6 3.9 1.6l-1.2 1.2A3.7 3.7 0 0 0 8 7.8c-1 0-1.9.4-2.7 1.1L4.1 7.7A5.4 5.4 0 0 1 8 6.3Zm0-3.4c2.5 0 4.8 1 6.5 2.7L13.3 7A7.4 7.4 0 0 0 8 4.4 7.4 7.4 0 0 0 2.7 7L1.5 5.6A9.7 9.7 0 0 1 8 2.9Z"
                />
              </svg>

              <span className="phone-battery">
                <span className="phone-battery-body" style={{ width: batW, height: batH }}>
                  <span className="phone-battery-level" />
                </span>
                <span
                  className="phone-battery-cap"
                  style={{
                    width: Math.max(1, Math.round(1.5 * chrome)),
                    height: Math.max(3, Math.round(3.5 * chrome)),
                  }}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="phone-screen" style={{ width: screenW, height: screenH }}>
          <div className="phone-scroll-clip">
            <div
              className="phone-scaler"
              style={{
                width: VIEW_W,
                height: VIEW_H,
                zoom: scale,
              }}
            >
              <iframe
                className="phone-iframe"
                src={src}
                title="Portal TENTREM"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allow="geolocation; clipboard-write"
                style={{ width: VIEW_W + SCROLL_GUTTER, height: VIEW_H }}
              />
            </div>
          </div>
        </div>

        <div className="phone-home-bar" style={{ width: homeW }} aria-hidden />
      </div>
    </div>
  );
}
