import { useEffect, useRef, useState } from "react";
import { assets } from "../data/assets";
import { useIframeParentScrollLock } from "../hooks/useIframeParentScrollLock";
import { useIsPdfPrint } from "../hooks/useIsPdfPrint";

const ADMIN_URL = "https://tentremadmin.vercel.app/";

/** Desktop viewport, then visually scaled into the laptop screen */
const VIEW_W = 1440;
const VIEW_H = 900;
const SCALE = 0.345;

export function LaptopMockup() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [src] = useState<string>(ADMIN_URL);
  const isPdf = useIsPdfPrint();

  useIframeParentScrollLock(shellRef, !isPdf);

  const screenW = Math.round(VIEW_W * SCALE);
  const screenH = Math.round(VIEW_H * SCALE);

  return (
    <div
      ref={shellRef}
      className="laptop-shell"
      title="Dashboard admin TENTREM"
    >
      <div className="laptop-lid">
        <div className="laptop-bezel">
          <span className="laptop-camera" aria-hidden />
          <div className="laptop-screen" style={{ width: screenW, height: screenH }}>
            {isPdf ? (
              <img
                className="laptop-static-shot"
                src={assets.tentremAdmin}
                alt="Dashboard admin TENTREM"
                width={1365}
                height={683}
                decoding="sync"
              />
            ) : (
              <div
                className="laptop-scaler"
                style={{
                  width: VIEW_W,
                  height: VIEW_H,
                  zoom: SCALE,
                }}
              >
                <iframe
                  className="laptop-iframe"
                  src={src}
                  title="Dashboard Admin TENTREM"
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="clipboard-write"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="laptop-base" aria-hidden>
        <div className="laptop-hinge" />
        <div className="laptop-deck">
          <span className="laptop-indent" />
        </div>
      </div>
    </div>
  );
}
