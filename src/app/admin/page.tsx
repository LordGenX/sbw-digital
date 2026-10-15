import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Images,
  ChartNoAxesColumn,
  Phone,
  BriefcaseBusiness,
  Settings,
  Users,
  Image as ImageIcon,
  Newspaper,
  Zap,
} from "lucide-react";

const quickLinks = [
  {
    title: "Berita",
    description: "Kelola berita terbaru di website.",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Agenda",
    description: "Kelola acara dan agenda kegiatan.",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Layanan",
    description: "Kelola informasi layanan koperasi.",
    href: "/admin/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Media",
    description: "Kelola gambar dan media konten.",
    href: "/admin/media",
    icon: Images,
  },
  {
    title: "Statistics",
    description: "Kelola angka ringkasan website publik.",
    href: "/admin/statistics",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Informasi Kontak",
    description: "Perbarui informasi kontak website.",
    href: "/admin/contact",
    icon: Phone,
  },
  {
    title: "Hero",
    description: "Kelola bagian utama halaman depan.",
    href: "/admin/hero",
    icon: ImageIcon,
  },
  {
    title: "About",
    description: "Kelola profil dan informasi koperasi.",
    href: "/admin/about",
    icon: FileText,
  },
  {
    title: "Membership",
    description: "Kelola informasi keanggotaan.",
    href: "/admin/membership",
    icon: Users,
  },
  {
    title: "Site Settings",
    description: "Kelola identitas dasar website.",
    href: "/admin/site-settings",
    icon: Settings,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Banner sambutan */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-orange-100 bg-linear-to-r from-orange-50 via-orange-100/70 to-amber-50 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-20 -z-10 size-64 rounded-full bg-orange-200/40 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-orange-700">
            SBW DIGITAL
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Selamat datang di panel pengelolaan website SBW Digital.
            Kelola konten dan informasi koperasi dengan mudah melalui
            menu yang tersedia.
          </p>
        </div>

        <div className="relative mt-5 flex size-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-orange-600 shadow-sm sm:absolute sm:bottom-8 sm:right-8 sm:mt-0">
          S
        </div>
      </section>

      {/* Akses cepat */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Zap size={19} />
              </span>

              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                Akses Cepat
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Pilih modul yang ingin kamu kelola.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {quickLinks.length} modul
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const isSiteSettings = item.href === "/admin/site-settings";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-h-28 items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  isSiteSettings ? "sm:col-span-2 xl:col-span-3" : ""
                }`}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
                  <Icon size={23} strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900 transition-colors group-hover:text-orange-700">
                    {item.title}
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-gray-500">
                    {item.description}
                  </span>
                </span>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-orange-600"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}