import ScrollReveal from "@/components/public/ScrollReveal";
import PublicEventCard from "@/components/public/PublicEventCard";

type UpcomingEventsProps = {
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

export default function UpcomingEvents({
  events,
}: UpcomingEventsProps) {
  return (
    <section
      id="agenda"
      aria-labelledby="upcoming-events-heading"
      className="scroll-mt-20 bg-slate-50 px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="left">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Catat Tanggalnya
            </p>

            <h2
              id="upcoming-events-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
            >
              Agenda Mendatang
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Temukan jadwal kegiatan SBW yang akan datang dan catat tanggal
              pentingnya.
            </p>
          </div>
        </ScrollReveal>

        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <ScrollReveal
                key={event.id}
                direction={index % 2 === 0 ? "up" : "right"}
                delay={index * 100}
              >
                <PublicEventCard event={event} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl text-orange-600">
              ◷
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Belum ada agenda mendatang
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Agenda yang akan datang akan ditampilkan di sini setelah
              dipublikasikan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}