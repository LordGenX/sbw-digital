import ScrollReveal from "@/components/public/ScrollReveal";
import PublicNewsCard from "@/components/public/PublicNewsCard";

type FeaturedNewsProps = {
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
  } | null;
};

export default function FeaturedNews({ news }: FeaturedNewsProps) {
  return (
    <section aria-labelledby="featured-news-heading">
      <ScrollReveal direction="up">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Pilihan Redaksi
          </p>

          <h2
            id="featured-news-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Berita Unggulan
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Simak informasi pilihan terbaru dari Koperasi Setia Budi Wanita.
          </p>
        </div>
      </ScrollReveal>

      {news ? (
        <ScrollReveal direction="up" delay={100}>
          <PublicNewsCard news={news} featured />
        </ScrollReveal>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-600">
            ✦
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            Belum ada berita unggulan
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Berita yang telah dipublikasikan akan ditampilkan di bagian ini.
          </p>
        </div>
      )}
    </section>
  );
}