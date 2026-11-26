import { BriefcaseBusiness, Check } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/public/ScrollReveal";

type LeadershipContent = {
  id: string;
  title: string;
  content: string;
};

type ContentGroup = {
  heading: string;
  items: string[];
};

function parseLeadershipContent(content: string): ContentGroup[] {
  const groups: ContentGroup[] = [];
  let currentGroup: ContentGroup | null = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) continue;

    const headingMatch = line.match(/^\[([^\]]+)\]$/);

    if (headingMatch) {
      currentGroup = {
        heading: headingMatch[1].trim(),
        items: [],
      };

      groups.push(currentGroup);
      continue;
    }

    if (!currentGroup) {
      currentGroup = {
        heading: "TUGAS",
        items: [],
      };

      groups.push(currentGroup);
    }

    currentGroup.items.push(line);
  }

  return groups;
}

function LeadershipCard({
  content,
  roleLabel,
}: {
  content: LeadershipContent;
  roleLabel: string;
}) {
  const groups = parseLeadershipContent(content.content);

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6">
      <div className="inline-flex self-start rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
        {roleLabel}
      </div>

      <div className="mt-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        <BriefcaseBusiness size={27} strokeWidth={1.5} />
      </div>

      <h3 className="mt-4 text-base font-bold leading-6 text-gray-900">
        {content.title}
      </h3>

      <div className="mt-4 space-y-4">
        {groups.map((group, groupIndex) => {
          const heading = group.heading.toUpperCase();
          const isRights = heading === "HAK";
          const isDescription =
            heading === "KETERANGAN" || heading === "SANKSI";

          return (
            <section key={`${content.id}-${groupIndex}`}>
              <h4 className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-orange-700">
                {heading}
              </h4>

              {isRights ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((item, index) => (
                    <span
                      key={`${content.id}-${groupIndex}-${index}`}
                      className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : isDescription ? (
                <div className="mt-2 space-y-2">
                  {group.items.map((item, index) => (
                    <p
                      key={`${content.id}-${groupIndex}-${index}`}
                      className="whitespace-pre-line text-sm leading-6 text-gray-600"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {group.items.map((item, index) => (
                    <li
                      key={`${content.id}-${groupIndex}-${index}`}
                      className="flex items-start gap-2 text-sm leading-6 text-gray-600"
                    >
                      <Check
                        size={15}
                        className="mt-1 shrink-0 text-orange-600"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}

export default async function MembershipGroupLeadership() {
  const contents = await prisma.membershipInfo.findMany({
    where: {
      section: "REQUIREMENT",
      status: "PUBLISHED",
      contentKey: {
        in: ["GROUP_PJ", "GROUP_ASSISTANT"],
      },
    },
    select: {
      id: true,
      contentKey: true,
      title: true,
      content: true,
    },
  });

  const contentByKey = new Map(
    contents.map((item) => [item.contentKey, item])
  );

  const pjContent = contentByKey.get("GROUP_PJ");
  const assistantContent = contentByKey.get("GROUP_ASSISTANT");

  if (!pjContent && !assistantContent) {
    return null;
  }

  return (
    <section
      id="pengurus-kelompok"
      aria-labelledby="group-leadership-title"
      className="scroll-mt-24 bg-gray-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up">
          <header className="mb-8 sm:mb-10">
            <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
              Pengurus Kelompok
            </span>

            <h2
              id="group-leadership-title"
              className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
            >
              Tugas, Kewajiban, Hak, dan Sanksi Pengurus Kelompok
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Mengenal tugas dan tanggung jawab Penanggung Jawab serta
              Asisten Kelompok dalam menjalankan kegiatan kelompok.
            </p>
          </header>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {pjContent && (
            <ScrollReveal direction="left" delay={100} className="h-full">
              <LeadershipCard
                content={pjContent}
                roleLabel="Penanggung Jawab (PJ)"
              />
            </ScrollReveal>
          )}

          {assistantContent && (
            <ScrollReveal direction="right" delay={200} className="h-full">
              <LeadershipCard
                content={assistantContent}
                roleLabel="Asisten Kelompok"
              />
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}