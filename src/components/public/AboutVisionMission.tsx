import { Check, Eye, Target } from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

type AboutVisionMissionData = {
  title: string;
  content: string;
} | null;

type AboutVisionMissionProps = {
  data: AboutVisionMissionData;
};

type ParsedVisionMission = {
  vision: string;
  missions: string[];
};

function parseVisionMission(
  content: string,
): ParsedVisionMission {
  const visionMatch = content.match(
    /VISI:\s*([\s\S]*?)(?=\n\s*MISI:|$)/i,
  );

  const missionMatch = content.match(
    /MISI:\s*([\s\S]*)$/i,
  );

  const vision = visionMatch?.[1]?.trim() ?? "";

  const missions = (missionMatch?.[1] ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^[-•]\s*/, ""));

  return { vision, missions };
}

export default function AboutVisionMission({
  data,
}: AboutVisionMissionProps) {
  const parsed = data
    ? parseVisionMission(data.content)
    : { vision: "", missions: [] };

  const hasContent =
    parsed.vision.length > 0 || parsed.missions.length > 0;

  return (
    <section
      id="visi-misi"
      className="bg-[#F7F7F7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-360">
        {/* Heading section */}
        <ScrollReveal direction="up">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
              Visi &amp; Misi
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Arah dan Tujuan Kami
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
              Menjadi koperasi wanita terdepan dalam pemberdayaan
              ekonomi dan sosial masyarakat Indonesia.
            </p>
          </div>
        </ScrollReveal>

        {!hasContent ? (
          <div className="mx-auto max-w-5xl rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            Konten visi dan misi belum tersedia atau belum
            dipublikasikan.
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
            {/* Kartu Misi */}
            <ScrollReveal direction="left">
              <article className="relative h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)] sm:p-9">
                <div
                  className="absolute inset-x-0 top-0 h-0.5 bg-orange-500"
                  aria-hidden="true"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Target
                    size={23}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-neutral-900">
                  Misi
                </h3>

                <div className="my-4 h-px bg-neutral-100" />

                {parsed.missions.length > 0 ? (
                  <ul className="space-y-4">
                    {parsed.missions.map((mission, index) => (
                      <li
                        key={`${index}-${mission}`}
                        className="flex items-start gap-3 text-sm leading-6 text-neutral-600"
                      >
                        <Check
                          size={17}
                          className="mt-0.5 shrink-0 text-orange-500"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-6 text-neutral-500">
                    Konten misi belum tersedia.
                  </p>
                )}
              </article>
            </ScrollReveal>

            {/* Kartu Visi */}
            <ScrollReveal direction="right" delay={150}>
              <article className="relative h-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)] sm:p-9">
                <div
                  className="absolute inset-x-0 top-0 h-0.5 bg-orange-500"
                  aria-hidden="true"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Eye
                    size={23}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-neutral-900">
                  Visi
                </h3>

                <div className="my-4 h-px bg-neutral-100" />

                {parsed.vision ? (
                  <div className="relative">
                    <span
                      className="pointer-events-none absolute -right-1 -top-4 select-none text-7xl leading-none text-orange-100"
                      aria-hidden="true"
                    >
                      ”
                    </span>

                    <p className="relative z-10 text-base font-semibold leading-7 text-neutral-800 sm:text-lg sm:leading-[1.65]">
                      {parsed.vision}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-neutral-500">
                    Konten visi belum tersedia.
                  </p>
                )}
              </article>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}