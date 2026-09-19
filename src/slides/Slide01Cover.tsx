import { assets } from "../data/assets";

export default function Slide01Cover() {
  const tags = ["Tugurejo", "Nyaman", "Tanggap", "Responsif", "Modern"];

  return (
    <section className="slide on-dark" style={{ position: "relative", overflow: "hidden" }}>
      {/* Background Image & Overlays */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={assets.cover}
          alt="Poskamling Tentrem RT 01 RW 01 Desa Tugurejo"
          className="anim-fade"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "72% 42%",
          }}
        />
        {/* Dark Linear Gradient for Contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(6,12,20,0.92) 0%, rgba(6,12,20,0.75) 35%, rgba(6,12,20,0.3) 65%, rgba(6,12,20,0.1) 100%)",
          }}
        />
        {/* Top & Bottom Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(6,12,20,0.6) 0%, transparent 25%, transparent 60%, rgba(6,12,20,0.85) 100%)",
          }}
        />
        {/* Accent Glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(196,137,58,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Institutional Logos (Left Header) */}
      <div
        className="anim-up"
        style={{
          position: "absolute",
          top: 40,
          left: 72,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(6, 12, 20, 0.4)",
          backdropFilter: "blur(8px)",
          padding: "8px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <img
          src={assets.logoDesa}
          alt="Lambang Kabupaten Ponorogo / Desa Tugurejo"
          style={{
            height: 44,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        />
        <span style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />
        <img
          src={assets.logoSatpol}
          alt="Satpol PP"
          style={{
            height: 38,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        />
        <img
          src={assets.logoLinmas}
          alt="Satlinmas"
          style={{
            height: 38,
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        />
      </div>

      {/* Top Right: Lomba PIN Siskamling 2026 */}
      <p
        className="anim-up"
        style={{
          position: "absolute",
          top: 48,
          right: 72,
          zIndex: 6,
          margin: 0,
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.85)",
          textShadow: "0 1px 6px rgba(0,0,0,0.45)",
        }}
      >
        Lomba PIN Siskamling · 2026
      </p>

      {/* Main Content Area */}
      <div
        style={{
          position: "absolute",
          left: 72,
          bottom: 72,
          zIndex: 5,
          maxWidth: 680,
        }}
      >
        {/* Subtitle / Sub-location */}
        <div
          className="anim-up"
          style={{
            display: "inline-block",
            padding: "4px 12px",
            marginBottom: 12,
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.08)",
            borderLeft: "3px solid #c4893a",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            RT 01 RW 01 Desa Tugurejo
          </p>
        </div>

        {/* Main Title */}
        <h1
          className="anim-up d1"
          style={{
            margin: 0,
            fontFamily: "var(--font-cover)",
            fontWeight: 700,
            fontSize: 82,
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: "#ffffff",
            textTransform: "uppercase",
            textShadow: "0 6px 30px rgba(0,0,0,0.5)",
          }}
        >
          Poskamling <br />
          <span style={{ color: "#e3b06c" }}>Tentrem</span>
        </h1>

        {/* Gradient Divider */}
        <div
          className="anim-up d2"
          style={{
            marginTop: 20,
            marginBottom: 20,
            width: 200,
            height: 3,
            borderRadius: "2px",
            background: "linear-gradient(90deg, #c4893a 0%, #3d5a73 70%, transparent 100%)",
          }}
        />

        {/* Tagline Slogan */}
        <p
          className="anim-up d2"
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1.35,
            color: "#ffffff",
            maxWidth: 580,
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          Siskamling Aktif, Masyarakat Aman, Desa Tenteram
        </p>

        {/* Feature Tags / Pill Badges (Tugurejo · Nyaman · etc.) */}
        <div
          className="anim-up d3"
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 12px",
            alignItems: "center",
          }}
        >
          {tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: idx === 0 ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                background: idx === 0 ? "rgba(196, 137, 58, 0.4)" : "rgba(255, 255, 255, 0.06)",
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(4px)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Location Footer */}
        <p
          className="anim-up d3"
          style={{
            margin: "28px 0 0",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 15,
            color: "rgba(255, 255, 255, 0.55)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#c4893a" }} />
          Desa Tugurejo, Kecamatan Slahung, Kabupaten Ponorogo
        </p>
      </div>
    </section>
  );
}
