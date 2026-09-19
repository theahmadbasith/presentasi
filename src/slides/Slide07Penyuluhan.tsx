import { DocPair, DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const rows = [
  {
    num: "01",
    title: "Penyuluhan Trantibumlinmas",
    desc: "Tupoksi Satlinmas, penanganan gangguan ketertiban, dan tata penjagaan wilayah bersama Satgas Linmas.",
    meta: "Mei–Juli 2026",
    flip: false,
    shots: [
      { src: assets.penyuluhanTrantibum01, shape: "soft" as const },
      { src: assets.penyuluhanTrantibum02, shape: "soft" as const },
      { src: assets.penyuluhanTrantibum03, shape: "soft" as const },
    ],
  },
  {
    num: "02",
    title: "Penyuluhan Posyandu",
    desc: "Penyuluhan Gizi anak & pencegahan stunting, imunisasi, ibu hamil, serta kesehatan lansia bersama Bidan Desa dan Kader Posyandu.",
    meta: "Mei–Agustus 2026",
    flip: true,
    accent: true,
    shots: [
      { src: assets.penyuluhanPosyandu01, shape: "soft" as const },
      { src: assets.penyuluhanPosyandu02, shape: "soft" as const },
    ],
  },
];

export default function Slide07Penyuluhan() {
  return (
    <SlideChrome index={7} total={12} sectionLabel="Penyuluhan · Trantibumlinmas & Posyandu">
      <div className="slide-body-pad">
        <div className="slide-header" style={{ marginBottom: 12 }}>
          <h2 className="slide-title anim-up">Penyuluhan Trantibumlinmas, Posyandu, P4GN &amp; Kebencanaan</h2>
          <p className="slide-lead anim-up d1">
            Pelaksanaan penyuluhan rutin kepada Satlinmas dan masyarakat Desa Tugurejo tentang 4 Pilar Ketangguhan Masyarakat Desa, meliputi:
          </p>
        </div>

        <div className="doc-stack anim-up d2" style={{ gap: 20 }}>
          {rows.map((r) => (
            <DocPair
              key={r.num}
              num={r.num}
              title={r.title}
              desc={r.desc}
              meta={r.meta}
              flip={r.flip}
              accent={r.accent}
              className="doc-pair--wide"
            >
              {r.shots.map((s) => (
                <DocShot key={s.src} src={s.src} alt={r.title} shape={s.shape} />
              ))}
            </DocPair>
          ))}
        </div>
      </div>
    </SlideChrome>
  );
}
