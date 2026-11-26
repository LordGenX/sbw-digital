import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Building2,
  CalendarDays,
  Trophy,
} from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

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

type AboutAchievementProps = {
  data: Achievement[];
  totalCount?: number;
};

function parseAchievementContent(content: string) {
  const datePattern = /^\s*Tanggal Penghargaan\s*:\s*(.*?)\s*$/i;
  const issuerPattern =
    /^\s*Pemberi Penghargaan\s*:\s*(.*?)\s*$/i;

  const descriptionLines: string[] = [];
  let date = "";
  let issuer = "";

  for (const line of content.split(/\r?\n/)) {
    const dateMatch = line.match(datePattern);
    const issuerMatch = line.match(issuerPattern);

    if (dateMatch) {
      date = dateMatch[1].trim();
    } else if (issuerMatch) {
      issuer = issuerMatch[1].trim();
    } else {
      descriptionLines.push(line);
    }
  }

  return {
    description: descriptionLines.join("\n").trim(),
    date,
    issuer,
  };
}

export default function AboutAchievement({
  data,
  totalCount = data.length,
}: AboutAchievementProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <section
      id="prestasi"
      className="bg-gray-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-10">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Prestasi
            </span>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Prestasi dan Penghargaan SBW
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Penghargaan dan capaian koperasi yang menunjukkan
              komitmen pada pemberdayaan ekonomi dan sosial.
            </p>
          </div>
        </ScrollReveal>

        {/* Achievement cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((achievement, index) => {
            const details = parseAchievementContent(
              achievement.content
            );

            return (
              <ScrollReveal
                key={achievement.id}
                direction="up"
                delay={(index % 3) * 120}
                className="h-full"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-orange-50">
                    {achievement.media?.fileUrl ? (
                      <Image
                        src={achievement.media.fileUrl}
                        alt={
                          achievement.media.altText ||
                          achievement.title
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

                  {/* Content */}
                  <div className="flex flex-1 gap-3 p-4 sm:p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <Award size={19} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold leading-5 text-gray-900 sm:text-base">
                        {achievement.title}
                      </h3>

                      {details.description && (
                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-5 text-gray-600 sm:text-sm">
                          {details.description}
                        </p>
                      )}

                      <div className="mt-3 space-y-2">
                        {details.date && (
                          <div className="flex items-start gap-2 text-xs leading-4 text-gray-500">
                            <CalendarDays
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                            <span>{details.date}</span>
                          </div>
                        )}

                        {details.issuer && (
                          <div className="flex items-start gap-2 text-xs leading-4 text-gray-500">
                            <Building2
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                            <span>{details.issuer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Link to the complete achievements page */}
        {totalCount > 6 && (
          <ScrollReveal direction="up" delay={150}>
            <div className="mt-8 text-center">
              <Link
                href="/tentang-sbw/prestasi"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
              >
                Lihat semua prestasi
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}