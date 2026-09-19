import { DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const partners = [
  { name: "Pemdes", logo: assets.logoDesa },
  { name: "Bhabinkamtibmas", logo: assets.logoPolres },
  { name: "Babinsa", logo: assets.logoKodim },
  { name: "Satgas Linmas", logo: assets.logoLinmas },
  { name: "Damkar", logo: assets.logoDamkar },
  { name: "BPBD", logo: assets.logoPusdalops },
];

const sinergi = [
  {
    partner: "Dengan TNI / POLRI",
    meta: "Babinsa · Bhabinkamtibmas",
    items: [
      "Pengamanan pemilu dan pilkada",
      "Pengamanan hari besar, keagamaan, dan kebudayaan",
      "Koordinasi penanganan gangguan Kamtibmas",
      "Pembinaan disiplin anggota Satlinmas",
    ],
    shots: [assets.sinergiDoc01, assets.sinergiDoc03],
  },
  {
    partner: "Dengan BPBD",
    meta: "Kesiapsiagaan & penanganan bencana",
    items: [
      "Simulasi dan pelatihan kebencanaan",
      "Penanganan tanah longsor, banjir, pohon tumbang",
      "Apel gelar pasukan dan peralatan",
      "Penyiapan jalur dan titik evakuasi",
      "Evakuasi korban kecelakaan khusus",
      "Penanganan kebakaran hutan dan lahan",
    ],
    shots: [assets.sinergiDoc02, assets.sinergiDoc04],
  },
  {
    partner: "Dengan Damkar",
    meta: "Kebakaran & penyelamatan",
    items: [
      "Sosialisasi pencegahan kebakaran",
      "Edukasi penggunaan APAR",
      "Simulasi penanganan kebakaran dan penyelamatan",
      "Dukungan penyelamatan pada kondisi darurat",      
    ],
    shots: [assets.pembinaanDamkar01, assets.sinergiDoc05],
  },
];

export default function Slide11Sinergitas() {
  return (
    <SlideChrome index={11} total={12} sectionLabel="Sinergitas Siskamling">
      <div className="slide-body-pad slide11">
        <div className="slide-header slide11-header">
          <h2 className="slide-title anim-up">Sinergitas Siskamling dengan Lintas Sektor</h2>
          <p className="slide-lead anim-up d1">
            Kolaborasi lintas sektor dalam mewujudkan keamanan lingkungan, kesiapsiagaan bencana, dan respons cepat terhadap keadaan darurat.
          </p>
        </div>

        <div className="partner-logo-strip anim-up d1">
          {partners.map((pt) => (
            <div key={pt.name} className="partner-logo-item" title={pt.name}>
              <span className="partner-logo-badge">
                <img src={pt.logo} alt={pt.name} />
              </span>
              <span className="partner-logo-name">{pt.name}</span>
            </div>
          ))}
        </div>

        <div className="sinergi-grid anim-up d2">
          {sinergi.map((col) => (
            <div key={col.partner} className="sinergi-col">
              <div className="sinergi-col-head">
                <strong>{col.partner}</strong>
                <span>{col.meta}</span>
              </div>
              <ul className="sinergi-list">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="sinergi-photos">
                {col.shots.map((src) => (
                  <DocShot key={src} src={src} alt={col.partner} shape="curve" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideChrome>
  );
}
