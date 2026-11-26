import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/public/SiteFooter";
import ScrollReveal from "@/components/public/ScrollReveal";

import {
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

import { prisma } from "@/lib/prisma";

type BeritaDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function BeritaDetailPage({
  params,
}: BeritaDetailPageProps) {
  const { slug } = await params;
  const now = new Date();

  const [news, contactInfo, siteSettings] = await Promise.all([
    prisma.news.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        publishedAt: {
          not: null,
          lte: now,
        },
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        category: true,
        publishedAt: true,
        metaTitle: true,
        metaDescription: true,
        media: {
          select: {
            fileUrl: true,
            altText: true,
          },
        },
      },
    }),
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  if (!news) {
    notFound();
  }

  const formattedDate = news.publishedAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(news.publishedAt)
    : "";

  return (
    <>
      <main className="min-h-screen bg-white text-slate-800">
        <article>
          <section className="bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 px-5 py-14 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-4xl">
              <ScrollReveal direction="left">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-50 transition hover:text-white"
                >
                  <span aria-hidden="true">←</span>
                  Kembali ke Berita & Agenda
                </Link>

                {news.category ? (
                  <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                    {news.category}
                  </p>
                ) : null}

                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {news.title}
                </h1>

                {news.excerpt ? (
                  <p className="mt-6 max-w-3xl text-base leading-8 text-orange-50 sm:text-lg">
                    {news.excerpt}
                  </p>
                ) : null}

                {formattedDate ? (
                  <p className="mt-6 text-sm font-medium text-orange-100">
                    Dipublikasikan pada {formattedDate}
                  </p>
                ) : null}
              </ScrollReveal>
            </div>
          </section>

          <section className="px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <ScrollReveal>
                {news.media?.fileUrl ? (
                  <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <Image
                      src={news.media.fileUrl}
                      alt={news.media.altText || news.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 896px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="whitespace-pre-wrap wrap-break-word text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                  {news.content}
                </div>
              </ScrollReveal>

              <div className="mt-12 border-t border-slate-200 pt-8">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <span aria-hidden="true">←</span>
                  Lihat Berita Lainnya
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}