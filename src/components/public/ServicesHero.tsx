import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="relative isolate flex min-h-80 items-center overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 sm:min-h-96 lg:min-h-105">
      {/* Dekorasi lingkaran */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-112 w-md rounded-full border-[3rem] border-white/10 sm:h-144 sm:w-xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[12%] -z-10 h-112 w-md rounded-full bg-amber-300/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 -z-10 h-64 w-64 rounded-full bg-orange-400/30 blur-3xl"
      />

      {/* Tulisan dekoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-0 -z-10 hidden select-none font-black leading-none text-white/9 lg:block"
      >
        <span className="text-[15rem] xl:text-[20rem]">SBW</span>
      </div>

      {/* Konten hero rata kiri */}
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="max-w-4xl translate-x-0 lg:-translate-x-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 text-xs font-medium text-orange-100 sm:text-sm"
          >
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Beranda
            </Link>

            <span className="mx-2" aria-hidden="true">
              /
            </span>

            <span
              aria-current="page"
              className="text-white"
            >
              Layanan
            </span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-100 sm:text-sm">
            Koperasi Setia Budi Wanita
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Layanan SBW
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-orange-50 sm:text-base sm:leading-8 lg:text-lg">
            Delapan unit usaha dan layanan untuk mendukung
            kemandirian ekonomi anggota.
          </p>

          <Link
            href="#daftar-layanan"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
          >
            Jelajahi layanan
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}