import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const strategicLocations = [
  {
    title: "20 Meter dari Kantor Desa & Posko Satlinmas",
    desc: "Koordinasi cepat dengan pemdes dan posko saat darurat.",
  },
  {
    title: "Disamping sempadan Sungai Kalimati",
    desc: <>Titik monitoring untuk <i>Early Warning System</i> debit air sungai.</>,
  },
  {
    title: "Akses Utama Desa (Jl. Sekar Pethak)",
    desc: "Pengawasan akses keluar masuk desa dan mobilisasi.",
  },
];

export default function Slide02Profile() {
  return (
    <SlideChrome index={2} total={12} sectionLabel="Profil Siskamling">
      <div className="slide02-layout">
        <div className="slide02-copy">
          <div className="slide-header slide02-header">
            <h2 className="slide-title anim-up">Desa Tugurejo</h2>
            <p className="slide-lead anim-up d1">
              Desa Tugurejo berpredikat{" "}
              <span className="slide02-destana-badge">DESTANA UTAMA</span>{" "}
              Jawa Timur — desa mandiri dan berkapasitas dalam mengelola serta memitigasi risiko bencana.
            </p>
          </div>

          <div className="surface-accent slide02-destana anim-up d1">          
            <div className="item-title">POSKAMLING TENTREM</div>
            <p className="item-desc slide02-destana-copy">
              Poskamling pelopor yang menjadi garda terdepan dalam mewujudkan Trantibumlinmas di lingkungan RT 01 RW 01 Desa Tugurejo.
            </p>
          </div>

          <div className="item-meta slide02-loc-label anim-up d1">Letak Strategis Poskamling</div>

          <div className="point-list slide02-points anim-up d2">
            {strategicLocations.map((loc, i) => (
              <div key={loc.title} className="item-row">
                <div className="item-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <h3 className="item-title">{loc.title}</h3>
                  <p className="item-desc">{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slide02-visual anim-fade">
          <div className="slide02-photo-stack">
            <div className="slide02-photo-card slide02-photo-top">
              <img src={assets.destana} alt="Predikat Destana Utama Jawa Timur" />
            </div>
            <div className="slide02-photo-card slide02-photo-bottom">
              <img src={assets.poskamlingLingkungan} alt="Lokasi Strategis Poskamling" />
            </div>
          </div>
          <div className="slide02-gradient" aria-hidden />
        </div>
      </div>
    </SlideChrome>
  );
}
