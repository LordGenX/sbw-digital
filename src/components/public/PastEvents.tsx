import ScrollReveal from "@/components/public/ScrollReveal";
import PublicEventCard from "@/components/public/PublicEventCard";

type PastEventsProps = {
  events: {
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
  }[];
};

export default function PastEvents({ events }: PastEventsProps) {
  return (
    <section
      aria-labelledby="past-events-heading"
      className="bg-white px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="right">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Rekam Jejak Kegiatan
            </p>

            <h2
              id="past-events-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              Agenda Sebelumnya
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Lihat kembali berbagai kegiatan yang telah dilaksanakan oleh
              Koperasi Setia Budi Wanita.
            </p>
          </div>
        </ScrollReveal>

        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <ScrollReveal
                key={event.id}
                direction={index % 2 === 0 ? "left" : "up"}
                delay={index * 100}
              >
                <PublicEventCard event={event} past />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-600">
              ◷
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Belum ada arsip agenda
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Kegiatan yang telah selesai akan ditampilkan di bagian ini
              setelah tersedia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}