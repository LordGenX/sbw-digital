import SiteFooter from "@/components/public/SiteFooter";

import BeritaHero from "@/components/public/BeritaHero";
import FeaturedNews from "@/components/public/FeaturedNews";
import NewsList from "@/components/public/NewsList";
import UpcomingEvents from "@/components/public/UpcomingEvents";
import PastEvents from "@/components/public/PastEvents";
import NewsAgendaCTA from "@/components/public/NewsAgendaCTA";

import {
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const now = new Date();

  const [
    contactInfo,
    siteSettings,
    news,
    upcomingEvents,
    pastEvents,
  ] = await Promise.all([
    getPublicContactInfo(),
    getPublicSiteSettings(),

    prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: now,
        },
      },
      include: {
        media: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 7,
    }),

    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        startAt: {
          gte: now,
        },
      },
      include: {
        media: true,
      },
      orderBy: {
        startAt: "asc",
      },
      take: 3,
    }),

    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          {
            endAt: {
              lt: now,
            },
          },
          {
            endAt: null,
            startAt: {
              lt: now,
            },
          },
        ],
      },
      include: {
        media: true,
      },
      orderBy: {
        startAt: "desc",
      },
      take: 3,
    }),
  ]);

  const featuredNews = news[0] ?? null;
  const otherNews = news.slice(1);

  return (
    <>
      <main className="min-h-screen bg-white text-slate-800">
        <BeritaHero />

        <section
          id="berita"
          className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <FeaturedNews news={featuredNews} />
            <NewsList news={otherNews} />
          </div>
        </section>

        <UpcomingEvents events={upcomingEvents} />

        <PastEvents events={pastEvents} />

        <NewsAgendaCTA />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}