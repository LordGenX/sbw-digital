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

type AgendaDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export default async function AgendaDetailPage({
  params,
}: AgendaDetailPageProps) {
  const { slug } = await params;
  const now = new Date();

  const [event, contactInfo, siteSettings] = await Promise.all([
    prisma.event.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        title: true,
        slug: true,
        description: true,
        location: true,
        startAt: true,
        endAt: true,
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

  if (!event) {
    notFound();
  }

  const isPast = (event.endAt ?? event.startAt) < now;

  const dateLabel =
    event.endAt &&
    event.startAt.toDateString() !== event.endAt.toDateString()
      ? `${formatDate(event.startAt)} – ${formatDate(event.endAt)}`
      : formatDate(event.startAt);

  const timeLabel =
    event.endAt &&
    event.startAt.toDateString() === event.endAt.toDateString()
      ? `${formatTime(event.startAt)} – ${formatTime(event.endAt)} WIB`
      : `${formatTime(event.startAt)} WIB`;

  const googleMapsUrl = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : null;

  return (
    <>
      <main className="min-h-screen bg-white text-slate-800">
        <article>
          <section className="bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 px-5 py-14 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-4xl">
              <ScrollReveal direction="left">
                <Link
                  href="/berita#agenda"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-50 transition hover:text-white"
                >
                  <span aria-hidden="true">←</span>
                  Kembali ke Berita & Agenda
                </Link>

                <div className="mt-8">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      isPast
                        ? "bg-white/20 text-white"
                        : "bg-white text-orange-700"
                    }`}
                  >
                    {isPast ? "Agenda Selesai" : "Agenda Mendatang"}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {event.title}
                </h1>

                <div className="mt-7 flex flex-col gap-4 text-sm text-orange-50 sm:flex-row sm:flex-wrap sm:gap-6">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-xl">
                      ▦
                    </span>
                    <div>
                      <p className="font-bold text-white">Tanggal</p>
                      <p className="mt-1">{dateLabel}</p>
                      <p className="mt-1">{timeLabel}</p>
                    </div>
                  </div>

                  {event.location ? (
                    <div className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-xl">
                        ⌖
                      </span>
                      <div>
                        <p className="font-bold text-white">Lokasi</p>
                        <p className="mt-1">{event.location}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </ScrollReveal>
            </div>
          </section>

          <section className="px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-4xl">
              <ScrollReveal>
                {event.media?.fileUrl ? (
                  <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <Image
                      src={event.media.fileUrl}
                      alt={event.media.altText || event.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 896px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <h2 className="text-2xl font-extrabold text-slate-900">
                  Tentang Agenda
                </h2>

                <div className="mt-5 whitespace-pre-wrap wrap-break-word text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                  {event.description}
                </div>

                {event.location && googleMapsUrl ? (
                  <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-6 sm:p-8">
                    <p className="text-sm font-bold uppercase tracking-wider text-orange-700">
                      Lokasi Acara
                    </p>

                    <p className="mt-3 font-semibold leading-7 text-slate-800">
                      {event.location}
                    </p>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                    >
                      Buka Lokasi di Google Maps
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                ) : null}
              </ScrollReveal>

              <div className="mt-12 border-t border-slate-200 pt-8">
                <Link
                  href="/berita#agenda"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <span aria-hidden="true">←</span>
                  Kembali ke Daftar Agenda
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