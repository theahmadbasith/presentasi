import type { CSSProperties, ReactNode } from "react";

export type DocShape = "rect" | "para" | "curve" | "arch" | "soft" | "slant";

interface DocShotProps {
  src: string;
  alt: string;
  shape?: DocShape;
  className?: string;
  style?: CSSProperties;
}

export function DocShot({ src, alt, shape = "rect", className, style }: DocShotProps) {
  return (
    <div className={`doc-shot doc-shot--${shape} ${className ?? ""}`} style={style}>
      <div className="doc-shot-inner">
        <img src={src} alt={alt} loading="lazy" decoding="async" fetchPriority="low" />
      </div>
    </div>
  );
}

interface DocPairProps {
  num: string;
  title: string;
  /** Penjelasan singkat — hanya jika judul belum cukup jelas */
  desc?: string;
  meta?: string;
  mediaLeft?: boolean;
  flip?: boolean;
  accent?: boolean;
  children: ReactNode;
  className?: string;
}

export function DocPair({
  num,
  title,
  desc,
  meta,
  mediaLeft = false,
  flip = false,
  accent = false,
  children,
  className,
}: DocPairProps) {
  const sideClass = mediaLeft ? "doc-pair--media-left" : flip ? "doc-pair--flip" : "";

  return (
    <div className={`doc-pair ${sideClass} ${className ?? ""}`}>
      <div className="doc-pair-copy">
        <div className={`item-num ${accent ? "item-num--accent" : ""}`}>{num}</div>
        <div>
          {meta && <div className="item-meta">{meta}</div>}
          <h3 className="item-title">{title}</h3>
          {desc && <p className="item-desc">{desc}</p>}
        </div>
      </div>
      <div className="doc-pair-media">{children}</div>
    </div>
  );
}
