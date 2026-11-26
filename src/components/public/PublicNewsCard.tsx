import Image from "next/image";
import Link from "next/link";

type PublicNewsCardProps = {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    category: string | null;
    media: {
      fileUrl: string;
      altText: string | null;
    } | null;
  };
  featured?: boolean;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function PublicNewsCard({
  news,
  featured = false,
}: PublicNewsCardProps) {
  return (
    <article
      className={`group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? "lg:grid lg:grid-cols-2 lg:rounded-3xl" : "flex flex-col"
      }`}
    >
      <Link
        href={`/berita/${news.slug}`}
        className={`flex h-full ${
          featured ? "flex-col lg:flex-row lg:contents" : "flex-col"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-orange-50 ${
            featured
              ? "aspect-16/10 lg:aspect-auto lg:min-h-105"
              : "aspect-16/10"
          }`}
        >
          {news.media?.fileUrl ? (
            <Image
              src={news.media.fileUrl}
              alt={news.media.altText || news.title}
              fill
              priority={featured}
              sizes={
                featured
                  ? "(max-width: 1024px) 100vw, 50vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-linear-to-br from-orange-50 to-amber-100">
              <span
                className={`font-black text-orange-300 ${
                  featured ? "text-6xl sm:text-7xl" : "text-4xl"
                }`}
              >
                SBW
              </span>
            </div>
          )}

          {featured && (
            <span className="absolute left-5 top-5 rounded-full bg-orange-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              Berita Unggulan
            </span>
          )}
        </div>

        <div
          className={`flex flex-1 flex-col ${
            featured ? "justify-center p-6 sm:p-10 lg:p-12" : "p-6"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {news.category && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                {news.category}
              </span>
            )}

            {news.publishedAt && (
              <time dateTime={news.publishedAt.toISOString()}>
                {formatDate(news.publishedAt)}
              </time>
            )}
          </div>

          <h2
            className={`mt-4 font-extrabold leading-snug text-slate-900 transition group-hover:text-orange-700 ${
              featured ? "text-2xl sm:text-3xl" : "text-lg"
            }`}
          >
            {news.title}
          </h2>

          <p
            className={`mt-3 flex-1 leading-7 text-slate-600 ${
              featured ? "line-clamp-4" : "line-clamp-3 text-sm"
            }`}
          >
            {news.excerpt || "Baca informasi selengkapnya dari SBW."}
          </p>

          <span className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-orange-600">
            Baca selengkapnya
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