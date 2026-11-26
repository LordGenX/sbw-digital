
import ScrollReveal from "@/components/public/ScrollReveal";

type ContactMapProps = {
  contactInfo: {
    address: string;
    mapUrl: string | null;
  } | null;
};

const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63226.53914518398!2d112.57510404863277!3d-7.930669699999987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62991c5d1b563%3A0x6a031b508b4edf9e!2sKoperasi%20Serba%20Usaha%20Setia%20Budi%20Wanita!5e0!3m2!1sid!2sid!4v1795141727652!5m2!1sid!2sid";

export default function ContactMap({
  contactInfo,
}: ContactMapProps) {
  const address = contactInfo?.address?.trim();
  const mapUrl = contactInfo?.mapUrl?.trim();

  return (
    <section
      id="lokasi"
      className="scroll-mt-24 bg-white px-5 pb-20 pt-8 sm:px-8 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Temukan Kami
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Lokasi Kantor
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Kunjungi kantor Koperasi Setia Budi Wanita untuk
              mendapatkan informasi dan layanan lebih lanjut.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg lg:grid-cols-[0.8fr_1.2fr]">

            {/* Informasi alamat */}
            <div className="flex flex-col justify-center bg-slate-900 p-7 text-white sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl">
                <span aria-hidden="true">⌖</span>
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Kunjungi Kantor Kami
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Kami siap menyambut Anda untuk mengenal lebih dekat
                layanan dan kegiatan SBW.
              </p>

              <div className="mt-7 border-t border-white/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
                  Alamat
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-100">
                  {address || "Alamat kantor belum tersedia."}
                </p>
              </div>

              {/* Tombol menuju profil Google Maps */}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Buka di Google Maps
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>

            {/* Peta Google Maps */}
            <div className="min-h-80 bg-slate-100 lg:min-h-110">
              <iframe
                title="Lokasi Koperasi Serba Usaha Setia Budi Wanita"
                src={mapEmbedUrl}
                className="h-80 w-full border-0 lg:h-full lg:min-h-110"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}