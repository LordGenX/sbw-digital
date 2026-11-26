import Image from "next/image";
import Link from "next/link";

type PublicEventCardProps = {
  event: {
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
  past?: boolean;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function PublicEventCard({
  event,
  past = false,
}: PublicEventCardProps) {
  const endDate = event.endAt ?? event.startAt;

  const showEndTime =
    event.endAt !== null &&
    event.endAt.toDateString() !== event.startAt.toDateString();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/agenda/${event.slug}`}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-16/10 overflow-hidden bg-orange-50">
          {event.media?.fileUrl ? (
            <Image
              src={event.media.fileUrl}
              alt={event.media.altText || event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-orange-50 to-amber-100">
              <span className="text-4xl font-black text-orange-300">
                SBW
              </span>
            </div>
          )}

          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
              past
                ? "bg-slate-700 text-white"
                : "bg-orange-600 text-white"
            }`}
          >
            {past ? "Selesai" : "Akan Datang"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="rounded-xl bg-orange-50 px-4 py-3">
            <p className="text-sm font-bold text-orange-700">
              {formatDate(event.startAt)}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {formatDateTime(event.startAt)}
              {showEndTime && ` — ${formatDateTime(endDate)}`}
            </p>
          </div>

          <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-orange-700">
            {event.title}
          </h3>

          {event.location && (
            <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
              <span aria-hidden="true">📍</span>
              <span>{event.location}</span>
            </p>
          )}

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-600">
            {event.description}
          </p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600">
            Lihat agenda
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}