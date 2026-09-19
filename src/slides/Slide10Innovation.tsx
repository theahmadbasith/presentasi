import type { ReactNode, SVGProps, SyntheticEvent } from "react";
import { LaptopMockup } from "../components/LaptopMockup";
import { PhoneMockup } from "../components/PhoneMockup";
import { SlideChrome } from "../components/SlideChrome";

const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://tentrem.vercel.app/&margin=12";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function StrokeIcon({
  size = 20,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

function ReportIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 7h8M8 11h5" />
      <path d="M7 3.5h7.5L19 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14.5 3.5V8H19" />
    </StrokeIcon>
  );
}

function TicketIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4.5 9.5a2 2 0 0 0 0 4v3.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V13.5a2 2 0 0 0 0-4V6a1 1 0 0 0-1-1h-13a1 1 0 0 0-1 1v3.5z" />
      <path d="M12 6.5v11" strokeDasharray="2 2.5" />
    </StrokeIcon>
  );
}

function VerifyIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 3.5 19 7v5.2c0 4.2-2.9 7.1-7 8.3-4.1-1.2-7-4.1-7-8.3V7l7-3.5z" />
      <path d="m9.2 12.1 1.9 1.9 3.7-3.8" />
    </StrokeIcon>
  );
}

function HandleIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M14.5 6.5 17 9l-7.8 7.8H6.7v-2.5L14.5 6.5z" />
      <path d="m13.2 7.8 2.5 2.5" />
      <path d="M5.5 19.5h13" />
    </StrokeIcon>
  );
}

function UpdateIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4.8 12a7.2 7.2 0 0 1 12.3-5.1L19 5.2V10h-4.8" />
      <path d="M19.2 12a7.2 7.2 0 0 1-12.3 5.1L5 18.8V14h4.8" />
    </StrokeIcon>
  );
}

function TransparencyIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M3.5 12h17" />
      <path d="M12 4a14 14 0 0 1 0 16 14 14 0 0 1 0-16z" />
    </StrokeIcon>
  );
}

function ComplaintIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3v-3H7.5A2.5 2.5 0 0 1 5 13.5v-7z" />
      <path d="M8.5 9h7M8.5 12.5h4.5" />
    </StrokeIcon>
  );
}

function NewsIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 4.5h11v15H5a1 1 0 0 1-1-1V4.5z" />
      <path d="M15 8.5h3.5a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H15" />
      <path d="M7 8h5M7 11.5h5M7 15h3" />
    </StrokeIcon>
  );
}

function EmergencyIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8.2 4.8c.4-.4 1.1-.5 1.6-.2l2 1.2c.5.3.7.9.5 1.4l-.7 1.8c-.1.4 0 .8.3 1.1l2.4 2.4c.3.3.7.4 1.1.3l1.8-.7c.5-.2 1.1 0 1.4.5l1.2 2c.3.5.2 1.2-.2 1.6l-1.1 1.1c-.5.5-1.2.7-1.9.5-1.8-.5-4.4-2-6.7-4.3S5.8 10.2 5.3 8.4c-.2-.7 0-1.4.5-1.9l1.1-1.1z" />
    </StrokeIcon>
  );
}

function GalleryIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M3 15l5-5 4 4 3-3 5 5" />
    </StrokeIcon>
  );
}

function MembersIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M21 20c0-2.8-1.8-5-4-5.5" />
    </StrokeIcon>
  );
}

function KentongIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M6 18V9a6 6 0 0 1 12 0v9" />
      <path d="M4 18h16" />
      <path d="M9 18v1.5a3 3 0 0 0 6 0V18" />
      <path d="M12 6v3" />
    </StrokeIcon>
  );
}

function InventoryIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
      <path d="M3 10h18" />
      <path d="M8 6v4M12 6v4M16 6v4" />
    </StrokeIcon>
  );
}

function MapIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 6.5l6-3 6 3 6-3v13l-6 3-6-3-6 3V6.5z" />
      <path d="M9 3.5v13M15 6.5v13" />
    </StrokeIcon>
  );
}

const features = [
  { title: "Aduan Masyarakat", Icon: ComplaintIcon },
  { title: "Berita", Icon: NewsIcon },
  { title: "Kontak Darurat", Icon: EmergencyIcon },
  { title: "Galeri Kegiatan", Icon: GalleryIcon },
  { title: "Struktur Keanggotaan", Icon: MembersIcon },
  { title: "Tanda Kentongan", Icon: KentongIcon },
  { title: "Inventaris Aset", Icon: InventoryIcon },
  { title: "Peta Kerawanan", Icon: MapIcon },
] as const;

function AlertIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 4.2 20.2 18.5H3.8L12 4.2z" />
      <path d="M12 10v3.8" />
      <circle cx="12" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
    </StrokeIcon>
  );
}

const flow = [
  { title: "Lapor E-Aduan", Icon: ReportIcon },
  { title: "Tiket unik", Icon: TicketIcon },
  { title: "Verifikasi admin", Icon: VerifyIcon },
  { title: "Tindak lanjut", Icon: HandleIcon },
  { title: "Update status aduan", Icon: UpdateIcon },
] as const;

function trap(e: SyntheticEvent | WheelEvent | TouchEvent) {
  e.stopPropagation();
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }
}

export default function Slide10Innovation() {
  return (
    <SlideChrome index={10} total={12} sectionLabel="Inovasi Digital TENTREM">
      <div className="slide-body-pad portal-pad">
        <div className="portal-layout">
          <div className="portal-copy">
            <h2 className="slide-title anim-up d1">
              Sistem Informasi, Aduan Darurat &amp; Layanan Terpadu
            </h2>
            <p className="slide-lead anim-up d1">
              Portal digital untuk warga — informasi desa, aduan masyarakat, dan akses darurat dalam satu platform.
            </p>

            <div className="portal-stack anim-up d2">
              <div className="portal-features">
                <div className="portal-section-label">Fitur Utama</div>
                <div className="portal-features-grid">
                  {features.map(({ title, Icon }) => (
                    <div key={title} className="portal-feature-chip">
                      <span className="portal-feature-chip-icon">
                        <Icon size={15} />
                      </span>
                      <span className="portal-feature-chip-label">{title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="portal-flow">
                <div className="portal-section-label">Alur E-Aduan &amp; Darurat</div>
                <ol className="portal-flow-track" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {flow.map(({ title, Icon }, i) => (
                    <li key={title} className="portal-flow-step" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", zIndex: 2 }}>
                      <div className="portal-flow-node">
                        <span className="portal-flow-icon">
                          <Icon size={16} />
                        </span>
                        <span className="portal-flow-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <strong>{title}</strong>

                      {i === 0 && (
                        <div className="portal-flow-branch">
                          <div className="portal-flow-branch-line" aria-hidden />
                          <div className="portal-flow-node portal-flow-node--emergency">
                            <span className="portal-flow-icon portal-flow-icon--emergency">
                              <AlertIcon size={16} />
                            </span>
                          </div>
                          <strong className="portal-flow-branch-label">Kontak Darurat</strong>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="portal-devices">
            <div
              className="portal-laptop"
              onClick={trap}
              onMouseDown={trap}
              onPointerDown={trap}
              onTouchStart={trap}
              onTouchMove={trap}
              onWheel={trap}
            >
              <LaptopMockup />
              <span className="device-label">Dashboard Admin</span>
            </div>
            <div
              className="portal-phone"
              onClick={trap}
              onMouseDown={trap}
              onPointerDown={trap}
              onTouchStart={trap}
              onTouchMove={trap}
              onWheel={trap}
            >
              <PhoneMockup scale={0.55} />
              <span className="device-label">Portal Tentrem</span>
            </div>
          </div>

          <div className="portal-qr anim-up d3" onClick={trap}>
            <img
              src={QR_URL}
              alt="QR Code Portal TENTREM"
              width={132}
              height={132}
            />
            <strong>Scan untuk membuka</strong>
          </div>
        </div>
      </div>
    </SlideChrome>
  );
}
