import { ReactNode } from "react";
import { Shield } from "./Shield";

interface Props {
  index: number;
  total?: number;
  dark?: boolean;
  sectionLabel?: string;
  showFooter?: boolean;
  className?: string;
  ornament?: "batik" | "wayang";
  children: ReactNode;
}

export function SlideChrome({
  index,
  total = 12,
  dark = false,
  sectionLabel,
  showFooter = true,
  className,
  ornament = "batik",
  children,
}: Props) {
  const ornamentClass = ornament === "wayang" ? "wayang-ornament" : "batik-ornament";
  const washClass = ornament === "wayang" ? "wayang-wash" : "batik-wash";

  return (
    <section className={`slide ${dark ? "on-dark" : "on-light"} ${className ?? ""}`}>
      {!dark && (
        <>
          <div className={`${ornamentClass} ${ornamentClass}--tl`} aria-hidden />
          <div className={`${ornamentClass} ${ornamentClass}--br`} aria-hidden />
          <div className={washClass} aria-hidden />
        </>
      )}

      <div className="slide-index">
        <strong>{String(index).padStart(2, "0")}</strong> / {String(total).padStart(2, "0")}
      </div>

      {sectionLabel && (
        <div className="slide-section-label">
          <span className="section-label">{sectionLabel}</span>
        </div>
      )}

      {children}

      {showFooter && (
        <div className="slide-footer">
          <span className="slide-footer-brand">
            <Shield size={13} color="#ffffff" />
            POSKAMLING TENTREM
          </span>
          <span>RT 01 RW 01 DESA TUGUREJO · KEC. SLAHUNG · KAB. PONOROGO</span>
        </div>
      )}
    </section>
  );
}
