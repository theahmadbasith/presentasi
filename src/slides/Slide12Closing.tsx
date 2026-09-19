import type { ReactNode, SVGProps } from "react";
import { assets } from "../data/assets";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 22, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {children}
    </svg>
  );
}

function FacebookIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 8.2h2.2V5H14c-2.4 0-4 1.5-4 4v2.2H7.5V14H10v7h3.2v-7h2.5l.5-2.8h-3V9.2c0-.6.3-1 1-1z" />
    </Icon>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2z" />
      <path d="M17.5 6.2a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z" />
      <path d="M12 3.5c-2.4 0-2.7 0-3.7.05-1 .05-1.7.2-2.3.45a4.6 4.6 0 0 0-1.7 1.1 4.6 4.6 0 0 0-1.1 1.7c-.25.6-.4 1.3-.45 2.3C3.5 9.3 3.5 9.6 3.5 12s0 2.7.05 3.7c.05 1 .2 1.7.45 2.3a4.6 4.6 0 0 0 1.1 1.7 4.6 4.6 0 0 0 1.7 1.1c.6.25 1.3.4 2.3.45 1 .05 1.3.05 3.7.05s2.7 0 3.7-.05c1-.05 1.7-.2 2.3-.45a4.6 4.6 0 0 0 1.7-1.1 4.6 4.6 0 0 0 1.1-1.7c.25-.6.4-1.3.45-2.3.05-1 .05-1.3.05-3.7s0-2.7-.05-3.7c-.05-1-.2-1.7-.45-2.3a4.6 4.6 0 0 0-1.1-1.7 4.6 4.6 0 0 0-1.7-1.1c-.6-.25-1.3-.4-2.3-.45C14.7 3.5 14.4 3.5 12 3.5zm0 1.7c2.3 0 2.6 0 3.5.05.9.04 1.35.19 1.67.31.42.16.72.36 1.04.68.32.32.52.62.68 1.04.12.32.27.78.31 1.67.05.9.05 1.2.05 3.5s0 2.6-.05 3.5c-.04.9-.19 1.35-.31 1.67-.16.42-.36.72-.68 1.04-.32.32-.62.52-1.04.68-.32.12-.78.27-1.67.31-.9.05-1.2.05-3.5.05s-2.6 0-3.5-.05c-.9-.04-1.35-.19-1.67-.31a2.8 2.8 0 0 1-1.04-.68 2.8 2.8 0 0 1-.68-1.04c-.12-.32-.27-.78-.31-1.67C5.2 14.6 5.2 14.3 5.2 12s0-2.6.05-3.5c.04-.9.19-1.35.31-1.67.16-.42.36-.72.68-1.04.32-.32.62-.52 1.04-.68.32-.12.78-.27 1.67-.31.9-.05 1.2-.05 3.5-.05z" />
    </Icon>
  );
}

function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12.04 3.5A8.45 8.45 0 0 0 3.6 11.96c0 1.49.39 2.94 1.13 4.22L3.5 20.5l4.45-1.17a8.45 8.45 0 0 0 4.09 1.04h.01a8.46 8.46 0 0 0 8.45-8.46 8.45 8.45 0 0 0-8.46-8.41zm4.95 11.98c-.21.59-1.23 1.13-1.7 1.2-.44.07-.99.1-1.6-.1-.37-.12-.84-.27-1.45-.53-2.55-1.1-4.21-3.68-4.34-3.85-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91.91-2.17.24-.26.52-.32.7-.32h.5c.16 0 .37-.06.58.44.21.51.72 1.76.78 1.89.06.13.1.28.02.45-.08.17-.12.28-.24.43-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.59-.69.75-.93.16-.24.32-.2.54-.12.22.08 1.39.66 1.63.78.24.12.4.18.46.28.06.1.06.58-.15 1.17z" />
    </Icon>
  );
}

function TikTokIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.6 5.82A4.87 4.87 0 0 1 14.2 3.5h-2.64v11.3a2.4 2.4 0 1 1-1.7-2.3V9.78a5.06 5.06 0 0 0-.96-.09 5.08 5.08 0 1 0 5.08 5.08V9.4a7.4 7.4 0 0 0 4.26 1.34V8.1a4.87 4.87 0 0 1-1.64-.2 4.9 4.9 0 0 1-2-.98z" />
    </Icon>
  );
}

const pillars = [
  "Aman Lingkungannya",
  "Guyub Warganya",
  "Tanggap Sistemnya",
] as const;

const social = [
  { id: "pemdes.tugurejo", Icon: FacebookIcon },
  { id: "@pemdestugurejoslahung", Icon: InstagramIcon },
  { id: "0823-1382-3791", Icon: WhatsAppIcon },
  { id: "@pemdes.tugurejo", Icon: TikTokIcon },
] as const;

export default function Slide12Closing() {
  return (
    <section className="slide on-dark closing-slide">
      <div className="closing-bg" aria-hidden>
        <img src={assets.closing} alt="" className="anim-fade" />
        <div className="closing-bg-shade" />
      </div>

      <div className="closing-body">
        <header className="closing-top anim-up">
          <p className="closing-kicker">Lomba PIN Siskamling · 2026</p>
          <strong className="closing-brand">
            Poskamling <em>Tentrem</em>
          </strong>
        </header>

        <div className="closing-main">
          <h1 className="closing-thanks anim-up d1">
            Terima
            <br />
            Kasih
          </h1>

          <div className="closing-rule anim-up d1" aria-hidden />

          <p className="closing-place anim-up d2">
            RT 01 RW 01 Dukuh Krajan · Desa Tugurejo · Kecamatan Slahung
          </p>

          <div className="closing-pillars anim-up d2">
            {pillars.map((title) => (
              <div key={title} className="closing-pillar">
                <strong className="closing-pillar-title">{title}</strong>
              </div>
            ))}
          </div>
        </div>

        <footer className="closing-foot anim-up d3">
          <div className="closing-social">
            {social.map(({ id, Icon: SocIcon }) => (
              <div key={id} className="closing-social-item">
                <span className="closing-social-icon">
                  <SocIcon size={22} />
                </span>
                <span className="closing-social-id">{id}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
