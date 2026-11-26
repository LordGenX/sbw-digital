import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Target, Check } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

const missions = [
  "Mengembangkan layanan keuangan mikro yang mudah diakses.",
  "Meningkatkan kapasitas anggota melalui pelatihan dan edukasi.",
  "Membangun ekosistem bisnis yang berkelanjutan dan inklusif.",
];

export default function AboutSection() {
  return (
    <section
      id="tentang-sbw"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Judul section */}
        <ScrollReveal direction="up">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
            <span className="inline-flex rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
              Tentang SBW
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Mengenal SBW
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
              Menjelajahi sejarah, visi, dan misi Setia Budi Wanita dalam
              mendorong kemandirian ekonomi wanita Indonesia.
            </p>
          </div>
        </ScrollReveal>

        {/* Konten utama */}
        <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* Foto gedung */}
          <ScrollReveal direction="left">
            <div className="relative min-h-90 overflow-hidden rounded-2xl sm:min-h-110 lg:min-h-120">
              <Image
                src="/images/gedung-sbw.jpg"
                alt="Gedung Koperasi Konsumen Setia Budi Wanita"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />

              {/* Gradasi putih di sisi kanan - desktop */}
              <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-white via-white/70 to-transparent md:block lg:w-1/4" />
              
              {/* Gradasi putih dari bawah - mobile */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-white via-white/60 to-transparent md:hidden" />
            </div>
          </ScrollReveal>

          {/* Sejarah, visi, dan misi */}
          <div className="min-w-0">
            <ScrollReveal direction="right">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                  Sejarah Singkat
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base sm:leading-6">
                  Setia Budi Wanita (SBW) didirikan pada tahun 1980 sebagai
                  wadah untuk meningkatkan kesejahteraan dan kemandirian
                  ekonomi wanita Indonesia. Dalam perjalanannya, SBW terus
                  berkembang menjadi salah satu koperasi wanita terbesar di
                  Indonesia dengan fokus pada layanan simpan pinjam,
                  pendidikan, dan pemberdayaan usaha mikro.
                </p>
              </div>
            </ScrollReveal>

            {/* Kartu visi dan misi */}
            <div className="mt-7 grid items-start gap-5 sm:grid-cols-2">
              {/* Kartu visi */}
              <ScrollReveal direction="up" delay={100}>
                <article className="h-full rounded-2xl border border-neutral-100 border-t-2 border-t-orange-500 bg-white p-6 shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Eye size={21} strokeWidth={1.8} />
                  </div>

                  <h4 className="mt-4 text-lg font-bold text-neutral-900">
                    Visi
                  </h4>

                  <p className="mt-2 text-sm leading-5 text-neutral-500">
                    Menjadi koperasi wanita terdepan dalam pemberdayaan
                    ekonomi dan sosial masyarakat Indonesia.
                  </p>
                </article>
              </ScrollReveal>

              {/* Kartu misi */}
              <ScrollReveal direction="up" delay={250}>
                <article className="h-full rounded-2xl border border-neutral-100 border-t-2 border-t-orange-500 bg-white p-6 shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Target size={21} strokeWidth={1.8} />
                  </div>

                  <h4 className="mt-4 text-lg font-bold text-neutral-900">
                    Misi
                  </h4>

                  <ul className="mt-3 space-y-3">
                    {missions.map((mission) => (
                      <li
                        key={mission}
                        className="flex items-start gap-2 text-sm leading-5 text-neutral-500"
                      >
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="mt-0.5 shrink-0 text-orange-600"
                        />
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            </div>

            {/* CTA */}
            <ScrollReveal direction="up" delay={150}>
              <div className="mt-7 text-center">
                <Link
                  href="/tentang-sbw"
                  className="group inline-flex items-center gap-2 border-b border-orange-200 pb-1 text-sm font-semibold text-orange-600 transition-colors hover:border-orange-600 hover:text-orange-700"
                >
                  Pelajari tentang SBW
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}