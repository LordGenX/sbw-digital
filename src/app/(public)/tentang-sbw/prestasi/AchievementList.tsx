"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Award,
  Building2,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Trophy,
  X,
} from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
};

type AchievementListProps = {
  data: Achievement[];
};

type AchievementDetails = {
  description: string;
  date: string;
  issuer: string;
  year: string;
};

function parseAchievementContent(
  content: string,
): AchievementDetails {
  const descriptionLines: string[] = [];
  let date = "";
  let issuer = "";

  for (const line of content.split(/\r?\n/)) {
    const dateMatch = line.match(
      /^\s*Tanggal Penghargaan\s*:\s*(.*?)\s*$/i,
    );

    const issuerMatch = line.match(
      /^\s*Pemberi Penghargaan\s*:\s*(.*?)\s*$/i,
    );

    if (dateMatch) {
      date = dateMatch[1].trim();
    } else if (issuerMatch) {
      issuer = issuerMatch[1].trim();
    } else {
      descriptionLines.push(line);
    }
  }

  const yearMatch = date.match(/\b(?:19|20)\d{2}\b/);

  return {
    description: descriptionLines.join("\n").trim(),
    date,
    issuer,
    year: yearMatch?.[0] ?? "",
  };
}

export default function AchievementList({
  data,
}: AchievementListProps) {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");

  const achievements = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        details: parseAchievementContent(item.content),
      })),
    [data],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          achievements
            .map((item) => item.details.year)
            .filter(Boolean),
        ),
      ).sort((a, b) => Number(b) - Number(a)),
    [achievements],
  );

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");

    return achievements.filter((item) => {
      const matchesYear =
        selectedYear === "ALL" ||
        item.details.year === selectedYear;

      const searchableText = [
        item.title,
        item.details.description,
        item.details.date,
        item.details.issuer,
      ]
        .join(" ")
        .toLocaleLowerCase("id-ID");

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesYear && matchesSearch;
    });
  }, [achievements, search, selectedYear]);

  const hasActiveFilters =
    search.trim() !== "" || selectedYear !== "ALL";

  function resetFilters() {
    setSearch("");
    setSelectedYear("ALL");
  }

  return (
    <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Summary */}
        <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Trophy size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total prestasi dipublikasikan
              </p>
              <p className="mt-0.5 text-2xl font-bold text-gray-900">
                {data.length}{" "}
                <span className="text-sm font-medium text-gray-500">
                  prestasi
                </span>
              </p>
            </div>
          </div>

          <Link
            href="/tentang-sbw"
            className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            ← Kembali ke Tentang SBW
          </Link>
        </div>

        {/* Search and filters */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal
              size={18}
              className="text-orange-600"
            />
            <h2 className="font-semibold text-gray-900">
              Cari dan filter prestasi
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari judul, deskripsi, atau pemberi penghargaan..."
                aria-label="Cari prestasi"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <select
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(event.target.value)
              }
              aria-label="Filter tahun penghargaan"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="ALL">Semua tahun</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={16} />
              Reset
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-3 text-xs text-gray-500"
          >
            Menampilkan {filteredAchievements.length} dari{" "}
            {data.length} prestasi.
          </p>
        </div>

        {/* Achievement cards */}
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((item) => (
              <article
                key={item.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-orange-50">
                  {item.media?.fileUrl ? (
                    <Image
                      src={item.media.fileUrl}
                      alt={
                        item.media.altText || item.title
                      }
                      fill
                      unoptimized
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Trophy
                        size={44}
                        strokeWidth={1.4}
                        className="text-orange-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 gap-3 p-4 sm:p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Award size={19} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-6 text-gray-900 sm:text-base">
                      {item.title}
                    </h3>

                    {item.details.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                        {item.details.description}
                      </p>
                    )}

                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                      {item.details.date && (
                        <div className="flex items-start gap-2 text-xs leading-5 text-gray-500">
                          <CalendarDays
                            size={15}
                            className="mt-0.5 shrink-0 text-orange-600"
                          />
                          <span>
                            {item.details.date}
                          </span>
                        </div>
                      )}

                      {item.details.issuer && (
                        <div className="flex items-start gap-2 text-xs leading-5 text-gray-500">
                          <Building2
                            size={15}
                            className="mt-0.5 shrink-0 text-orange-600"
                          />
                          <span>
                            {item.details.issuer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Search size={25} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Prestasi tidak ditemukan
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Tidak ada prestasi yang sesuai dengan kata kunci
              atau tahun yang dipilih. Coba kata kunci lain
              atau hapus filter.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Tampilkan semua prestasi
            </button>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center">
          <Link
            href="/tentang-sbw"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            ← Kembali ke halaman Tentang SBW
          </Link>
        </div>
      </div>
    </section>
  );
}