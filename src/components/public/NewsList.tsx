import ScrollReveal from "@/components/public/ScrollReveal";
import PublicNewsCard from "@/components/public/PublicNewsCard";

type NewsListItem = {
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

type NewsListProps = {
  news: NewsListItem[];
};

export default function NewsList({ news }: NewsListProps) {
  return (
    <section aria-labelledby="latest-news-heading" className="mt-16">
      <ScrollReveal direction="left">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Kabar Terbaru
            </p>

            <h2
              id="latest-news-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              Berita Terbaru
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Temukan berbagai informasi dan kegiatan terbaru dari SBW.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {news.length} berita lainnya
          </span>
        </div>
      </ScrollReveal>

      {news.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <ScrollReveal
              key={item.id}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={(index % 3) * 100}
            >
              <PublicNewsCard news={item} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <h3 className="text-lg font-bold text-slate-800">
            Belum ada berita lainnya
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Berita terbaru lainnya akan muncul di sini setelah dipublikasikan.
          </p>
        </div>
      )}
    </section>
  );
}