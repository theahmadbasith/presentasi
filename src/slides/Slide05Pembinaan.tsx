import { DocPair, DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const rows = [
  {
    num: "01",
    title: "Babinsa — Baris Berbaris",
    desc: "Pembinaan PBB untuk membentuk kedisiplinan, kekompakan dan kesiapsiagaan personil Satlinmas .",
    meta: "Babinsa, Koramil Slahung",
    flip: false,
    shots: [
      { src: assets.pembinaanBabinsa01, shape: "para" as const },
      { src: assets.pembinaanBabinsa02, shape: "para" as const },
    ],
  },
  {
    num: "02",
    title: "Bhabinkamtibmas — Pengamanan",
    desc: "Pembinaan kewaspadaan dini dan penanganan awal gangguan kamtibmas.",
    meta: "Bhabinkamtibmas, Polsek Slahung",
    flip: true,
    accent: true,
    shots: [
      { src: assets.pembinaanBhabin01, shape: "para" as const },
      { src: assets.pembinaanSatgas01, shape: "para" as const },
    ],
  },
  {
    num: "03",
    title: "Satgas Linmas — Deteksi Dini",
    desc: "Isyarat tanggap darurat, komunikasi HT/kentongan, dan deteksi dini kebencanaan.",
    meta: "Satgas Linmas Kab. Ponorogo",
    flip: false,
    shots: [
      { src: assets.pembinaanSatgas02, shape: "para" as const },
      { src: assets.pembinaanSatgas03, shape: "para" as const },
    ],
  },
];

export default function Slide05Pembinaan() {
  return (
    <SlideChrome index={5} total={12} sectionLabel="Pembinaan Satlinmas">
      <div className="slide-body-pad">
        <div className="slide-header" style={{ marginBottom: 12 }}>
          <h2 className="slide-title anim-up">Pembinaan Satlinmas</h2>
          <p className="slide-lead anim-up d1">
            Pembinaan rutin bersama Babinsa, Bhabinkamtibmas, Satgas Linmas, BPBD dan Damkar untuk meningkatkan kapasitas personil Satlinmas.
          </p>
        </div>

        <div className="doc-stack anim-up d2">
          {rows.map((r) => (
            <DocPair
              key={r.num}
              num={r.num}
              title={r.title}
              desc={r.desc}
              meta={r.meta}
              flip={r.flip}
              accent={r.accent}
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
