"use client";

import { useEffect, useState } from "react";
import {
  UsersRound,
  Clock3,
  BriefcaseBusiness,
  Users,
} from "lucide-react";

type PublicHero = {
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  ctaText: string | null;
  ctaUrl: string | null;
};

type PublicStatistic = {
  id: string;
  name: string;
  value: string;
  unit: string | null;
  description: string | null;
};

type HeroSectionProps = {
  hero: PublicHero | null;
  statistics: PublicStatistic[];
};

function getYouTubeEmbedUrl(videoId: string) {
  const safeVideoId = /^[a-zA-Z0-9_-]{11}$/.test(videoId)
    ? videoId
    : null;

  if (!safeVideoId) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${safeVideoId}?autoplay=1&mute=1&loop=1&playlist=${safeVideoId}&controls=0&playsinline=1&rel=0`;
}

const statisticIcons = [
  UsersRound,
  Users,
  Clock3,
  BriefcaseBusiness,
];

export default function HeroSection({
  hero,
  statistics,
}: HeroSectionProps) {
  const embedUrl = hero ? getYouTubeEmbedUrl(hero.videoId) : null;

  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIntroVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const introClass = () =>
    `transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
      introVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-5 opacity-0"
    }`;

  return (
    <section className="relative isolate min-h-[calc(102svh-6rem)] overflow-hidden bg-neutral-950 text-white">
      {/* Video YouTube sebagai latar */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="Video pengenalan SBW"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay: sisi kiri lebih gelap, sisi kanan lebih terbuka */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-neutral-950/90 via-neutral-950/55 to-neutral-950/15" />

      {/* Overlay bagian bawah untuk menjaga keterbacaan statistik */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-linear-to-t from-neutral-950/80 via-neutral-950/35 to-transparent" />

      {/* Aksen dekoratif minimalis */}
      <div className="pointer-events-none absolute -left-36 -top-44 -z-10 h-80 w-80 rounded-full border border-orange-500/30" />
      <div className="pointer-events-none absolute -left-24 -top-32 -z-10 h-64 w-64 rounded-full border border-orange-500/20" />

      {/* Konten utama */}
      <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[1600px] flex-col justify-between px-5 pb-6 pt-8 sm:px-8 lg:px-12 lg:pb-8 lg:pt-8 xl:px-16">

        {/* Area headline */}
        <div className="flex flex-1 items-center py-6 lg:py-4">
          <div className="max-w-3xl">

            {/* Label koperasi */}
            <p
              style={{ transitionDelay: "100ms" }}
              className={`mb-5 inline-flex items-center gap-3 rounded-full border border-orange-400/35 bg-neutral-950/35 px-4 py-2 text-xs font-semibold tracking-wide text-orange-200 backdrop-blur-sm sm:text-sm ${introClass()}`}
            >
              <UsersRound
                size={17}
                className="text-orange-400"
                strokeWidth={2.2}
              />
              Koperasi Konsumen Setia Budi Wanita
            </p>

            {/* Judul utama */}
            <h1
              style={{ transitionDelay: "220ms" }}
              className={`max-w-212.5 font-hero text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl ${introClass()}`}
            >
              {hero?.title ?? "Bersama SBW, Tumbuh dan Berdaya"}
            </h1>

            {/* Aksen garis */}
            <div
              style={{ transitionDelay: "280ms" }}
              className={`mt-5 h-1 w-20 rounded-full bg-orange-500 ${introClass()}`}
            />

            {/* Deskripsi */}
            <p
              style={{ transitionDelay: "340ms" }}
              className={`mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8 ${introClass()}`}
            >
              {hero?.description ??
                "Bersama membangun kemandirian, memperkuat kebersamaan, dan tumbuh melalui koperasi."}
            </p>

            {/* Tombol CTA */}
            {hero?.ctaText && hero.ctaUrl && (
              <div
                style={{ transitionDelay: "460ms" }}
                className={`mt-7 flex flex-wrap items-center gap-3 sm:gap-4 ${introClass()}`}
              >
                <a
                  href={hero.ctaUrl}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-xl active:translate-y-0 sm:text-base"
                >
                  {hero.ctaText}
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </a>

                <a
                  href="/layanan"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/55 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/15 active:translate-y-0 sm:text-base"
                >
                  Pelajari Layanan
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Statistik dari database - satu frame horizontal */}
        {statistics.length > 0 && (
          <div
            className={`grid grid-cols-2 overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/50 shadow-xl shadow-black/10 backdrop-blur-md transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none lg:grid-cols-4 ${
              introVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            {statistics.map((statistic, index) => {
              const Icon =
                statisticIcons[index % statisticIcons.length];

              return (
                <article
                  key={statistic.id}
                  style={{
                    transitionDelay: `${500 + index * 100}ms`,
                  }}
                  className={`flex min-w-0 items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-7 ${
                    index % 2 === 0
                      ? "border-r border-white/10"
                      : ""
                  } ${
                    index < statistics.length - 2
                      ? "border-b border-white/10 lg:border-b-0"
                      : ""
                  } ${
                    index !== statistics.length - 1
                      ? "lg:border-r lg:border-white/10"
                      : ""
                  }`}
                >
                  {/* Ikon statistik */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 sm:h-12 sm:w-12">
                    <Icon size={23} strokeWidth={2} />
                  </div>

                  {/* Informasi statistik */}
                  <div className="min-w-0">
                    <p className="text-2xl font-bold leading-none tracking-tight text-white sm:text-3xl">
                      {statistic.value}

                      {statistic.unit && (
                        <span className="ml-1 text-base font-semibold text-orange-400 sm:text-lg">
                          {statistic.unit}
                        </span>
                      )}
                    </p>

                    <h2 className="mt-2 text-xs font-medium leading-5 text-white/90 sm:text-sm">
                      {statistic.name}
                    </h2>

                    {statistic.description && (
                      <p className="mt-1 text-[11px] leading-4 text-white/55 sm:text-xs">
                        {statistic.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}