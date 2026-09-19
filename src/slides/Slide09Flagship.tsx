import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const programs = [
  {
    num: "01",
    title: "Inovasi TENTREM",
    desc: "Inovasi digital berbasis masyarakat untuk pelaporan aduan dan kanal informasi.",
    meta: "Portal Informasi dan Aduan",
    img: assets.inovasiPortal,
  },
  {
    num: "02",
    title: "SAJADAH",
    desc: "Program pemilahan sampah plastik untuk mengajak warga bersedekah melalui sampah demi mewujudkan lingkungan yang bersih.",
    meta: "Sampah Jadi Sedekah",
    img: assets.pemberdayaanSajadah,
    accent: true,
  },
  {
    num: "03",
    title: "Kebun TOGA",
    desc: "Pemanfaatan lingkungan Poskamling sebagai kebun TOGA untuk mendukung kesehatan dan kebutuhan masyarakat.",
    meta: "Tanaman obat keluarga",
    img: assets.pemberdayaanToga,
  },
];

export default function Slide09Flagship() {
  return (
    <SlideChrome
      index={9}
      total={12}
      sectionLabel="Program Unggulan Poskamling"
      ornament="wayang"
      className="slide09"
    >
      <div className="slide-body-pad">
        <div className="slide-header" style={{ marginBottom: 28 }}>
          <h2 className="slide-title anim-up">Program Unggulan Poskamling Tentrem</h2>
          <p className="slide-lead anim-up d1">
            Tiga program unggulan sebagai penguatan sistem keamanan lingkungan melalui inovasi digital, pemberdayaan masyarakat, dan pemanfaatan kearifan lokal.
          </p>
        </div>

        <div className="flagship-trio anim-up d2">
          {programs.map((p) => (
            <article key={p.num} className={`flagship-card${p.accent ? " flagship-card--accent" : ""}`}>
              <div className="flagship-photo">
                <div className="flagship-ring">
                  <img src={p.img} alt={p.title} />
                </div>
                <span className="flagship-num">{p.num}</span>
              </div>
              <div className="flagship-copy">
                <div className="item-meta">{p.meta}</div>
                <h3 className="item-title">{p.title}</h3>
                <p className="item-desc">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SlideChrome>
  );
}
