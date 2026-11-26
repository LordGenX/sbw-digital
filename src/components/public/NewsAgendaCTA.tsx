import Link from "next/link";
import ScrollReveal from "@/components/public/ScrollReveal";

export default function NewsAgendaCTA() {
  return (
    <section
      aria-labelledby="news-agenda-cta-heading"
      className="px-5 pb-16 sm:px-8 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up">
          <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-r from-orange-600 to-amber-500 px-6 py-10 text-center sm:px-12 sm:py-14">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-12 -z-10 h-56 w-56 rounded-full bg-amber-200/20 blur-2xl"
            />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                Koperasi Setia Budi Wanita
              </p>

              <h2
                id="news-agenda-cta-heading"
                className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl"
              >
                Terus Terhubung dengan SBW
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-orange-50 sm:text-base">
                Ikuti informasi dan kegiatan terbaru dari SBW untuk mengenal
                lebih dekat perjalanan, program, dan kontribusi koperasi.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Kembali ke Beranda
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}