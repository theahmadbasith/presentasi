import { DocPair, DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const rows = [
  {
    num: "03",
    title: "Penyuluhan P4GN",
    desc: "Edukasi bahaya narkoba, pencegahan kenakalan remaja, dan Gerakan Desa Bersinar bersama BNN dan Polsek Slahung.",
    meta: "Mei–Agustus 2026",
    flip: false,
    accent: true,
    shots: [
      { src: assets.penyuluhanP4gn01, shape: "arch" as const },
      { src: assets.penyuluhanP4gn02, shape: "arch" as const },
    ],
  },
  {
    num: "04",
    title: "Penyuluhan Kebencanaan",
    desc: "Edukasi kebencanaan, pemetaan jalur evakuasi, dan simulasi kesiapsiagaan Destana bersama BPBD.",
    meta: "Juni–Agustus 2026",
    flip: true,
    shots: [
      { src: assets.penyuluhanBencana01, shape: "arch" as const },
      { src: assets.penyuluhanBencana03, shape: "arch" as const },
      { src: assets.penyuluhanBencana04, shape: "arch" as const },
    ],
  },
];

export default function Slide08PenyuluhanP4gnBencana() {
  return (
    <SlideChrome index={8} total={12} sectionLabel="Penyuluhan · P4GN & Kebencanaan">
      <div className="slide-body-pad">
        <div className="slide-header" style={{ marginBottom: 12 }}>
          <h2 className="slide-title anim-up">Penyuluhan P4GN &amp; Kebencanaan</h2>
          <p className="slide-lead anim-up d1">
            Dua pilar selanjutnya yaitu, ketahanan desa dari narkoba dan kesiapsiagaan menghadapi bencana.
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
