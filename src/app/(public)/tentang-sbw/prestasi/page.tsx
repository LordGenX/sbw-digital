import Link from "next/link";

import SiteFooter from "@/components/public/SiteFooter";
import AchievementList from "./AchievementList";

import {
  getAllPublicAboutAchievements,
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function PublicAchievementsPage() {
  const [achievements, contactInfo, siteSettings] =
    await Promise.all([
      getAllPublicAboutAchievements(),
      getPublicContactInfo(),
      getPublicSiteSettings(),
    ]);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <section className="border-b border-orange-100 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500"
            >
              <Link
                href="/"
                className="transition hover:text-orange-600"
              >
                Beranda
              </Link>

              <span aria-hidden="true">/</span>

              <Link
                href="/tentang-sbw"
                className="transition hover:text-orange-600"
              >
                Tentang SBW
              </Link>

              <span aria-hidden="true">/</span>

              <span className="font-medium text-orange-700">
                Prestasi
              </span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                Prestasi dan Penghargaan
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Perjalanan Prestasi SBW
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                Jelajahi berbagai prestasi dan penghargaan
                Koperasi Konsumen Setia Budi Wanita sebagai
                bagian dari perjalanan, dedikasi, dan komitmen
                dalam memberdayakan anggota.
              </p>
            </div>
          </div>
        </section>

        <AchievementList data={achievements} />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}