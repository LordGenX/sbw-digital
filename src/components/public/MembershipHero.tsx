import Link from "next/link";

const navigationItems = [
  { label: "Anggota Masuk", href: "#anggota-masuk" },
  { label: "Anggota Keluar", href: "#anggota-keluar" },
  { label: "Rayon Kelompok", href: "#rayon-kelompok" },
  { label: "Penarikan Simpanan", href: "#penarikan-simpanan" },
  { label: "Sistem Tanggung Renteng", href: "#sistem-tanggung-renteng" },
  { label: "Pengurus Kelompok", href: "#pengurus-kelompok" },
];

export default function MembershipHero() {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
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

      {/* Tulisan dekoratif SBW */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-0 -z-10 hidden select-none font-black leading-none text-white/9 lg:block"
      >
        <span className="text-[15rem] xl:text-[20rem]">SBW</span>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-xs text-orange-100 sm:text-sm"
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
            className="font-medium text-white"
          >
            Keanggotaan
          </span>
        </nav>

        {/* Heading */}
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-100 sm:text-sm">
            Koperasi Setia Budi Wanita
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Keanggotaan SBW
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-orange-50 sm:text-base sm:leading-8 lg:text-lg">
            Lebih kuat bersama, lebih sejahtera bersama. Pelajari
            informasi dan ketentuan keanggotaan Koperasi Konsumen
            Setia Budi Wanita.
          </p>
        </div>

        {/* Navigasi keanggotaan */}
        <nav
          aria-label="Navigasi keanggotaan"
          className="mt-6 flex flex-wrap gap-2.5"
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/50 bg-white/95 px-4 py-2 text-xs font-semibold text-orange-700 shadow-sm transition duration-200 hover:border-white hover:bg-white hover:text-orange-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600 sm:text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}