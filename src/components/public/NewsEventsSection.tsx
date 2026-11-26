import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/public/ScrollReveal";

type PublicNews = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: Date | null;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
};

type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  startAt: Date;
  endAt: Date | null;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
};

type NewsEventsSectionProps = {
  news: PublicNews[];
  events: PublicEvent[];
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  timeZone: "Asia/Jakarta",
});

function formatDate(date: Date) {
  return dateFormatter.format(new Date(date));
}

function getDateParts(date: Date) {
  const parts = shortDateFormatter
    .formatToParts(new Date(date))
    .reduce<Record<string, string>>((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});

  return {
    day: parts.day ?? "",
    month: (parts.month ?? "").replace(".", "").toUpperCase(),
  };
}

export default function NewsEventsSection({
  news,
  events,
}: NewsEventsSectionProps) {
  return (
    <section id="berita-agenda" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Heading */}
        <ScrollReveal direction="up">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
              Berita & Agenda
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Berita Terbaru & Agenda Mendatang
            </h2>
          </div>
        </ScrollReveal>

        {/* Berita Terbaru */}
        <div>
          <ScrollReveal direction="up">
            <h3 className="mb-5 text-lg font-bold text-neutral-900">
              Berita Terbaru
            </h3>
          </ScrollReveal>

          {news.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item, index) => (
                <ScrollReveal
                  key={item.id}
                  direction="up"
                  delay={index * 100}
                >
                  <article className="group h-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <Link
                      href={`/berita/${item.slug}`}
                      className="block h-full"
                      aria-label={`Baca berita ${item.title}`}
                    >
                      <div className="relative h-48 overflow-hidden bg-orange-50">
                        {item.media?.fileUrl ? (
                          <Image
                            src={item.media.fileUrl}
                            alt={item.media.altText || item.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            width={400}
                            height={300}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-orange-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="h-12 w-12"
                              aria-hidden="true"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                              />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" />
                      </div>

                      <div className="p-5">
                        {item.category && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                            {item.category}
                          </p>
                        )}

                        <h4 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-neutral-900 transition group-hover:text-orange-600">
                          {item.title}
                        </h4>

                        {item.publishedAt && (
                          <p className="mb-3 text-xs text-neutral-400">
                            {formatDate(item.publishedAt)}
                          </p>
                        )}

                        <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600">
                          {item.excerpt || "Baca berita selengkapnya."}
                        </p>
                      </div>
                    </Link>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-neutral-200 px-5 py-10 text-center text-sm text-neutral-500">
              Belum ada berita yang dipublikasikan.
            </p>
          )}

          <ScrollReveal direction="up" delay={100}>
            <div className="mt-6 text-center">
              <Link
                href="/berita"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
              >
                Lihat semua berita <span aria-hidden="true">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Agenda Mendatang */}
        <div className="mt-12 sm:mt-14">
          <ScrollReveal direction="up">
            <h3 className="mb-5 text-lg font-bold text-neutral-900">
              Agenda Mendatang
            </h3>
          </ScrollReveal>

          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, index) => {
                const date = getDateParts(event.startAt);

                return (
                  <ScrollReveal
                    key={event.id}
                    direction="right"
                    delay={index * 100}
                  >
                    <article className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-orange-600 text-white">
                        <span className="text-lg font-bold leading-tight">
                          {date.day}
                        </span>
                        <span className="text-[10px] font-semibold">
                          {date.month}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/agenda/${event.slug}`}
                          className="font-bold text-neutral-900 transition hover:text-orange-600"
                        >
                          {event.title}
                        </Link>

                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                          {event.description}
                        </p>

                        <p className="mt-2 text-xs text-neutral-400">
                          {formatDate(event.startAt)}
                          {event.endAt &&
                            new Date(event.endAt).toDateString() !==
                              new Date(event.startAt).toDateString() &&
                            ` – ${formatDate(event.endAt)}`}
                        </p>
                      </div>

                      {event.location && (
                        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-medium text-neutral-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4 text-orange-600"
                            aria-hidden="true"
                          >
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-neutral-200 px-5 py-10 text-center text-sm text-neutral-500">
              Belum ada agenda mendatang.
            </p>
          )}

          <ScrollReveal direction="up" delay={100}>
            <div className="mt-6 text-center">
              <Link
                href="/berita#agenda"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
              >
                Lihat semua agenda <span aria-hidden="true">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}