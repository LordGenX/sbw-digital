import ScrollReveal from "@/components/public/ScrollReveal";

export default function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-amber-400">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <ScrollReveal direction="left">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-100">
              Kami Siap Membantu
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hubungi <span className="text-orange-100">SBW</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-orange-50 sm:text-lg">
              Punya pertanyaan, membutuhkan informasi, atau ingin mengenal
              lebih dekat Koperasi Setia Budi Wanita? Kami siap membantu
              melalui saluran komunikasi yang tersedia.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#informasi-kontak"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Informasi Kontak
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="#lokasi"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Lihat Lokasi
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden select-none font-black leading-none text-white/[0.07] lg:block"
        >
          <span className="text-[15rem] xl:text-[19rem]">SBW</span>
        </div>
      </div>
    </section>
  );
}