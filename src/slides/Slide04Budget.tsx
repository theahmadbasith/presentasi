import { DocShot } from "../components/DocPair";
import { SlideChrome } from "../components/SlideChrome";
import { assets } from "../data/assets";

const fundingMessage = "Poskamling Tentrem dibiayai secara kolaboratif melalui APBDesa, swadaya warga, serta bantuan instansi terkait dan CSR.";

const fundingSources = [
  {
    title: "Alokasi APBDesa Tugurejo",
    desc: "Anggaran trantibum, perlengkapan Linmas, dan sarana pos.",
  },
  {
    title: "Swadaya Warga",
    desc: "Jimpitan dan iuran warga RT 01 RW 01 serta sumbangan masyarakat.",
  },
  {
    title: "Bantuan Instansi Terkait dan CSR",
    desc: "Fasilitas, logistik, dan dukungan dana dari pemerintah serta sektor swasta.",
  },
];

export default function Slide04Budget() {
  return (
    <SlideChrome index={4} total={12} sectionLabel="Dukungan Anggaran">
      <div className="slide-body-pad">
        <div className="slide-grid-2">
          <div className="slide-col">
            <div className="slide-header">
              <h2 className="slide-title anim-up">Dukungan Anggaran</h2>
              <p className="slide-lead anim-up d1">{fundingMessage}</p>
            </div>

            <div className="point-list anim-up d2">
              {fundingSources.map((f, i) => (
                <div key={f.title} className="item-row">
                  <div className="item-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 className="item-title">{f.title}</h3>
                    <p className="item-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slide-col gap-14 anim-scale d1">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
                minHeight: 0,
              }}
            >
              <DocShot
                src={assets.dukunganInstansi}
                alt="Dukungan"
                shape="curve"
                style={{ flex: 1, minHeight: 200 }}
              />
              <DocShot
                src={assets.pemberdayaanJimpitan}
                alt="Jimpitan"
                shape="curve"
                style={{ flex: 1, minHeight: 200 }}
              />
            </div>
          </div>
        </div>
      </div>
    </SlideChrome>
  );
}
