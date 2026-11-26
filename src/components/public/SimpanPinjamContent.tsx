import ScrollReveal from "@/components/public/ScrollReveal";
import ServicesCTA from "@/components/public/ServicesCTA";
import Link from "next/link";

type SimpanPinjamContentProps = {
  contactInfo: {
    phone: string | null;
    email: string | null;
    address: string;
  } | null;
};

const loanProducts = [
  {
    title: "Pinjaman Kelompok Tanggung Renteng di Pertemuan Kelompok",
    details: [
      {
        title: "Ketentuan simpanan pokok dan wajib",
        description: "Lihat ketentuan keanggotaan SBW.",
      },
      {
        title: "Prosedur Surat Pengajuan Pinjaman (SPP)",
        description: "Informasi prosedur pengajuan pinjaman.",
      },
      {
        title: "Tata cara pelayanan di kelompok",
        description: "Informasi pelayanan melalui kelompok.",
      },
    ],
  },
  {
    title: "Pinjaman Kelompok Tanggung Renteng di Kantor",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi pinjaman kelompok di kantor.",
      },
    ],
  },
  {
    title: "Pinjaman PMPU (Pinjaman Modal Pendamping Usaha)",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi pinjaman modal pendamping usaha.",
      },
    ],
  },
  {
    title: "Pinjaman Waserda (Warung Serba Ada)",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi layanan pinjaman Waserda.",
      },
    ],
  },
  {
    title: "Pinjaman Non Tanggung Renteng",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi layanan pinjaman non tanggung renteng.",
      },
    ],
  },
  {
    title: "Pinjaman Masa Depan (PIMAPAN)",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi layanan PIMAPAN.",
      },
    ],
  },
  {
    title: "Pinjaman KPPK (Kelompok Pengusaha Pedagang Kecil)",
    details: [
      {
        title: "Informasi layanan",
        description: "Informasi layanan KPPK.",
      },
    ],
  },
];

const savingProducts = [
  {
    title: "Simpanan Manasuka",
    badge: "Jasa 7,5% / tahun",
    symbol: "▣",
  },
  {
    title: "Simpanan Berjangka",
    badge: "Jangka 12 bulan",
    symbol: "▦",
  },
  {
    title: "Simpanan Simpati",
    badge: "Jasa 6%",
    symbol: "♡",
  },
  {
    title: "Simpanan Simara",
    badge: "Fleksibel",
    symbol: "⟳",
  },
  {
    title: "Simpanan Sifna",
    badge: "Khusus",
    symbol: "♙",
  },
  {
    title: "Simpanan Masa Depan",
    badge: "Jasa 10% / tahun",
    symbol: "↗",
  },
];

export default function SimpanPinjamContent({
  contactInfo,
}: SimpanPinjamContentProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
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
          <span className="text-[15rem] xl:text-[20rem]">
            SBW
          </span>
        </div>

        {/* Konten hero */}
        <div className="w-full px-0 sm:px-0 lg:pl-8">
          <ScrollReveal direction="left">
            <div className="mx-auto w-full max-w-7xl">
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="mb-5 text-xs text-orange-100 sm:text-sm"
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

                <Link
                  href="/layanan"
                  className="transition hover:text-white"
                >
                  Layanan
                </Link>

                <span className="mx-2" aria-hidden="true">
                  /
                </span>

                <span
                  className="font-medium text-white"
                  aria-current="page"
                >
                  Simpan Pinjam
                </span>
              </nav>

              {/* Judul dan deskripsi */}
              <div className="max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-100 sm:text-sm">
                  Layanan SBW
                </p>

                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Simpan Pinjam
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-orange-50 sm:text-base sm:leading-8 lg:text-lg">
                  Layanan simpanan dan pinjaman untuk mendukung
                  kebutuhan serta kesejahteraan anggota Koperasi
                  Setia Budi Wanita.
                </p>

                {/* Navigasi bagian */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="#simpan"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Simpan
                  </Link>

                  <Link
                    href="#pinjam"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Pinjam
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pinjaman */}
      <section
        id="pinjam"
        className="scroll-mt-24 bg-slate-50 px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
              Pinjaman
            </span>

            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Pinjam
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Informasi produk dan ketentuan layanan pinjaman SBW.
            </p>
          </ScrollReveal>

          {/* Rumus jasa pinjaman */}
          <div className="mt-8">
            <ScrollReveal>
              <h3 className="text-lg font-bold text-slate-900">
                Rumus Jasa Pinjaman
              </h3>
            </ScrollReveal>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ScrollReveal>
                <div className="h-full rounded-2xl border-t-2 border-orange-500 bg-white p-6 shadow-sm">
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    Tanpa tanggungan
                  </span>

                  <p className="mt-4 text-xs text-slate-500">
                    Jangka waktu: 1 tahun buku ke atas
                  </p>

                  <div className="mt-5 rounded-xl bg-orange-50 px-4 py-6 text-center">
                    <p className="font-bold text-slate-900">
                      [(n + 1) / 2] × pinjaman × b%
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    n = Jangka Waktu. b = Jasa Pinjaman.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="h-full rounded-2xl border-t-2 border-orange-500 bg-white p-6 shadow-sm">
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    Dengan tanggungan
                  </span>

                  <p className="mt-4 text-xs text-slate-500">
                    Jangka waktu: maksimal 10 tahun
                  </p>

                  <div className="mt-5 rounded-xl bg-orange-50 px-4 py-6 text-center">
                    <p className="font-bold leading-7 text-slate-900">
                      [(n + 1) / 2] × pinjaman × b%
                      <br />
                      + (pinjaman × tanggungan)
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    n = Jangka Waktu. b = Jasa Pinjaman.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
              <span className="font-bold text-orange-500">ⓘ</span>
              <p>
                Rumus ini mengikuti referensi desain. Ketentuan dan
                perhitungan resmi perlu dikonfirmasi kepada pengelola
                SBW sebelum dipublikasikan sebagai informasi operasional.
              </p>
            </div>
          </div>

          {/* Daftar produk pinjaman */}
          <div className="mt-10">
            <h3 className="text-xl font-extrabold text-slate-900">
              Produk Pinjaman
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Kenali pilihan layanan pinjaman yang tersedia.
            </p>

            <div className="mt-5 space-y-3">
              {loanProducts.map((product, index) => (
                <details
                  key={product.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {index + 1}
                    </span>

                    <span className="flex-1 text-sm font-bold leading-6 text-slate-800">
                      {product.title}
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-orange-500 transition group-open:rotate-180"
                    >
                      ⌄
                    </span>
                  </summary>

                  <div className="border-t border-slate-100 px-5 py-4">
                    {product.details.map((detail) => (
                      <div
                        key={detail.title}
                        className="flex gap-3 py-2 text-sm"
                      >
                        <span className="text-orange-500">⊙</span>

                        <div>
                          <p className="font-medium text-slate-800">
                            {detail.title}
                          </p>

                          <p className="mt-1 leading-6 text-slate-500">
                            {detail.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simpanan */}
      <section
        id="simpan"
        className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
              Produk Simpanan
            </span>

            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Simpan
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Pilihan produk simpanan untuk membantu anggota
              merencanakan kebutuhan keuangan.
            </p>
          </ScrollReveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savingProducts.map((product, index) => (
              <ScrollReveal
                key={product.title}
                delay={(index % 3) * 80}
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500">
                    {product.symbol}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {product.title}
                  </h3>

                  <span className="mt-3 inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    {product.badge}
                  </span>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Informasi produk dan ketentuan simpanan dapat
                    dikonfirmasi melalui kantor SBW.
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Perhitungan jasa simpanan */}
          <ScrollReveal>
            <div className="mt-8 rounded-2xl border-l-2 border-orange-500 bg-slate-50 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">
                Perhitungan dan Pembayaran Jasa Simpanan
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Perhitungan dan pembayaran jasa simpanan mengikuti
                ketentuan masing-masing produk. Konfirmasikan periode
                dan mekanisme pembayaran kepada pengelola SBW.
              </p>

              <div className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <span className="text-orange-500">▦</span>
                  Berdasarkan periode simpanan
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-orange-500">▣</span>
                  Mengikuti ketentuan produk
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-orange-500">≡</span>
                  Informasi pembayaran
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA bersama dengan halaman layanan */}
      <ServicesCTA
        phone={contactInfo?.phone}
        email={contactInfo?.email}
        address={contactInfo?.address}
      />
    </>
  );
}