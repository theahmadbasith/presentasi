import { DocPair, DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const rows = [
  {
    num: "04",
    title: "Damkar — Penanganan Kebakaran",
    desc: "Pembinaan teknis lintas sektor ini berlanjut dengan simulasi penanganan dini kebakaran pemukiman dan praktik penggunaan APAR sebagai langkah kesiapsiagaan masyarakat.",
    meta: "Damkar Kab. Ponorogo",
    flip: false,
    accent: true,
    shots: [
      { src: assets.pembinaanDamkar01, shape: "curve" as const },
      { src: assets.pembinaanDamkar02, shape: "curve" as const },
    ],
  },
  {
    num: "05",
    title: "BPBD — Penanganan Bencana",
    desc: "Pembinaan mitigasi, prosedur evakuasi, dan kesiapsiagaan penanganan bencana terus diperkuat agar masyarakat siap menghadapi situasi darurat secara cepat dan tertib.",
    meta: "BPBD Kab. Ponorogo",
    flip: true,
    shots: [
      { src: assets.pembinaanBpbd01, shape: "curve" as const },
      { src: assets.pembinaanBpbd03, shape: "curve" as const },
    ],
  },
  {
    num: "06",
    title: "Evaluasi & Pelayanan Satlinmas",
    desc: "Pada tahapan akhir, dilakukan evaluasi etika aparatur, standar pelayanan, dan pemanfaatan sistem digital Tentrem agar pelayanan kepada masyarakat semakin efektif dan terukur.",
    meta: "Pemerintah Desa",
    flip: false,
    accent: true,
    shots: [
      { src: assets.pembinaanRapat01, shape: "curve" as const },
      { src: assets.pembinaanBpbd02, shape: "curve" as const },
    ],
  },
];

export default function Slide06PembinaanLanjut() {
  return (
    <SlideChrome index={6} total={12} sectionLabel="Pembinaan Satlinmas">
      <div className="slide-body-pad">
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
