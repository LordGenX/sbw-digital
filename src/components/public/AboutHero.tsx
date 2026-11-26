"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowLeft, Clock3 } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

type AboutHistory = {
  title: string;
  content: string;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
};

type AboutHeroProps = {
  history: AboutHistory | null;
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

// Sesuaikan tahun dan peristiwa dengan dokumentasi resmi SBW.
const historyTimeline: TimelineItem[] = [
  {
    year: "1980",
    title: "Pendirian SBW",
    description:
      "Awal perjalanan koperasi untuk kesejahteraan dan kemandirian ekonomi perempuan.",
  },
  {
    year: "[Tahun]",
    title: "Pengembangan Layanan",
    description:
      "Perkembangan layanan simpan pinjam untuk mendukung kebutuhan dan usaha anggota.",
  },
  {
    year: "[Tahun]",
    title: "Pemberdayaan Anggota",
    description:
      "Pengembangan pendidikan, keterampilan, dan pendampingan usaha mikro.",
  },
  {
    year: "[Tahun]",
    title: "Pertumbuhan Digital",
    description:
      "Pengembangan sarana digital agar layanan semakin mudah diakses anggota.",
  },
];

function splitParagraphs(content: string): string[] {
  return content
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function AboutHero({ history }: AboutHeroProps) {
  const [expanded, setExpanded] = useState(false);

  const title = history?.title || "Sejarah Singkat";
  const paragraphs = splitParagraphs(history?.content ?? "");

  // Tampilan ringkas menampilkan maksimal satu paragraf.
  const hasMore = paragraphs.length > 1;
  const visibleParagraphs =
    expanded || !hasMore ? paragraphs : paragraphs.slice(0, 1);

  const imageUrl = history?.media?.fileUrl || "/images/gedung-sbw.jpg";
  const imageAlt =
    history?.media?.altText || "Gedung Koperasi Konsumen Setia Budi Wanita";

  return (
    <section
      id="sejarah"
      className="relative isolate overflow-hidden bg-neutral-950 text-white"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        unoptimized={imageUrl.startsWith("http")}
      />

      {/* Overlay foto */}
      <div
        className="absolute inset-0 z-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/75 to-neutral-950/35"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-360 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="max-w-3xl">
          <ScrollReveal direction="up">
            <span className="inline-flex rounded-full bg-orange-600 px-3 py-1 text-[10px] font-semibold text-white">
              Tentang SBW
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
          </ScrollReveal>

          {/* Narasi ringkas atau lengkap */}
          <ScrollReveal direction="up" delay={200}>
            <div className="mt-5 space-y-3 text-xs leading-6 text-neutral-200 sm:text-sm sm:leading-7">
              {paragraphs.length > 0 ? (
                visibleParagraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>
                  Informasi sejarah SBW belum tersedia. Silakan lengkapi
                  konten sejarah melalui halaman admin.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* Linimasa hanya muncul pada tampilan lengkap */}
          {expanded && (
            <ScrollReveal direction="up">
              <div className="mt-8 sm:mt-10">
                <h2 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                  <Clock3
                    size={17}
                    className="text-orange-500"
                    aria-hidden="true"
                  />
                  Jejak Perjalanan SBW
                </h2>

                <ol className="relative mt-5 space-y-5 border-l border-orange-500/50 pl-5 sm:pl-6">
                  {historyTimeline.map((item) => (
                    <li
                      key={`${item.year}-${item.title}`}
                      className="relative"
                    >
                      <span
                        className="absolute -left-6.25 top-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-neutral-950/70 sm:-left-7.25"
                        aria-hidden="true"
                      />

                      <p className="text-xs font-semibold text-orange-400">
                        {item.year}
                        <span className="mx-1.5 text-neutral-500">/</span>
                        <span className="text-neutral-100">{item.title}</span>
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-300">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ol>

                <p className="mt-4 text-[10px] leading-5 text-neutral-400">
                  Kronologi perlu disesuaikan dengan dokumentasi resmi SBW.
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Tombol berubah sesuai kondisi */}
          {hasMore && (
            <ScrollReveal direction="up" delay={100}>
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                aria-expanded={expanded}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 transition-colors hover:text-orange-400 sm:text-sm"
              >
                {expanded ? (
                  <>
                    <ArrowLeft size={14} aria-hidden="true" />
                    Tampilkan lebih sedikit
                  </>
                ) : (
                  <>
                    Baca selengkapnya
                    <ArrowDown size={14} aria-hidden="true" />
                  </>
                )}
              </button>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}