import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const regulations = [
  {
    num: "01",
    title: "Peraturan Bupati Ponorogo",
    nomor: null as string | null,
    tentang: "Tentang Sistem Keamanan Lingkungan Masyarakat",
  },
  {
    num: "02",
    title: "Surat Edaran Bupati Ponorogo",
    nomor: "No. 300.1.4/KH/3/405.14/2026",
    tentang: "Tentang Sistem Keamanan Lingkungan Masyarakat",
  },
  {
    num: "03",
    title: "Surat Himbauan Kepala Desa Tugurejo",
    nomor: "No. 140/02/35/.02.01.2001/2026",
    tentang: "Tentang Pelaksanaan Sistem Keamanan Lingkungan (Siskamling)",
  },
];

export default function Slide03Regulation() {
  return (
    <SlideChrome index={3} total={12} sectionLabel="Landasan Hukum & Legalitas" ornament="wayang">
      <div className="slide-body-pad slide03-pad">
        <div className="slide03-header anim-up">
          <img
            className="slide03-garuda"
            src={assets.logoGaruda}
            alt="Garuda Pancasila"
          />
          <h2 className="slide-title">Landasan Hukum &amp; Legalitas</h2>
          <p className="slide-lead">
            Payung hukum penyelenggaraan Poskamling Tentrem:
          </p>
        </div>

        <div className="point-list slide03-list anim-up d2">
          {regulations.map((r) => (
            <div key={r.num} className="item-row slide03-row">
              <div className="item-num slide03-num">{r.num}</div>
              <div>
                <div className="item-title">{r.title}</div>
                {r.nomor && <div className="slide03-nomor">{r.nomor}</div>}
                <div className="item-desc slide03-tentang">{r.tentang}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideChrome>
  );
}
