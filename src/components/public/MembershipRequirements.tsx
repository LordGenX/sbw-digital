import {
  UserRoundCheck,
  Wallet,
  GraduationCap,
  ListOrdered,
  LogOut,
  FileText,
  CircleDollarSign,
  CheckCircle2,
  Repeat2,
  Info,
  ClipboardCheck,
  Users,
  Handshake,
  Eye,
  ShieldCheck,
  Clock,
  Scale,
  HeartHandshake,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/public/ScrollReveal";

type CardType = "chips" | "checklist" | "steps";

type CardConfig = {
  contentKey: string;
  fallbackTitle: string;
  type: CardType;
};

type MembershipCardData = {
  id: string;
  title: string;
  content: string;
};

const entryCards: CardConfig[] = [
  {
    contentKey: "MEMBERSHIP_REQUIREMENTS",
    fallbackTitle: "Persyaratan Keanggotaan",
    type: "chips",
  },
  {
    contentKey: "FINANCIAL_ADMIN",
    fallbackTitle: "Ketentuan Finansial & Administrasi",
    type: "chips",
  },
  {
    contentKey: "MANDATORY_EDUCATION",
    fallbackTitle: "Pendidikan Wajib",
    type: "chips",
  },
  {
    contentKey: "REGISTRATION_STEPS",
    fallbackTitle: "Tata Cara Masuk",
    type: "steps",
  },
];

const exitCards: CardConfig[] = [
  {
    contentKey: "EXIT_CRITERIA",
    fallbackTitle: "Kriteria Keluar",
    type: "checklist",
  },
  {
    contentKey: "EXIT_PROCEDURE",
    fallbackTitle: "Tata Cara Keluar",
    type: "steps",
  },
  {
    contentKey: "EXIT_SAVINGS",
    fallbackTitle: "Klasifikasi & Pengambilan Simpanan",
    type: "chips",
  },
];

const withdrawalCards: CardConfig[] = [
  {
    contentKey: "SAVINGS_WITHDRAWAL_REQUIREMENTS",
    fallbackTitle: "Syarat Penarikan",
    type: "checklist",
  },
  {
    contentKey: "SAVINGS_WITHDRAWAL_STEPS",
    fallbackTitle: "Tata Cara Penarikan",
    type: "steps",
  },
];

const cardIcons: Record<string, typeof UserRoundCheck> = {
  MEMBERSHIP_REQUIREMENTS: UserRoundCheck,
  FINANCIAL_ADMIN: Wallet,
  MANDATORY_EDUCATION: GraduationCap,
  REGISTRATION_STEPS: ListOrdered,
  EXIT_CRITERIA: LogOut,
  EXIT_PROCEDURE: FileText,
  EXIT_SAVINGS: CircleDollarSign,
  SAVINGS_WITHDRAWAL_REQUIREMENTS: ClipboardCheck,
  SAVINGS_WITHDRAWAL_STEPS: ListOrdered,
};

const trValueIcons = [
  Users,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Scale,
];

// Memisahkan konten menjadi daftar item dan deskripsi.
function parseContent(content: string) {
  const blocks = content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const items = (blocks[0] ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    items,
    description: blocks.slice(1).join("\n\n"),
  };
}

// Parsing khusus untuk klasifikasi pengambilan simpanan.
function parseSavingsDescriptions(content: string) {
  const blocks = content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (blocks[1] ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return {
          title: "",
          description: line,
        };
      }

      return {
        title: line.slice(0, separatorIndex).trim(),
        description: line.slice(separatorIndex + 1).trim(),
      };
    });
}

// Komponen kartu informasi keanggotaan.
function MembershipCard({
  card,
  data,
}: {
  card: CardConfig;
  data: MembershipCardData;
}) {
  const Icon = cardIcons[card.contentKey] ?? FileText;
  const { items, description } = parseContent(data.content);

  const isExitProcedure = card.contentKey === "EXIT_PROCEDURE";
  const isExitSavings = card.contentKey === "EXIT_SAVINGS";

  const savingsDescriptions = isExitSavings
    ? parseSavingsDescriptions(data.content)
    : [];

  // Tata Cara Keluar: baris pertama menjadi badge.
  const exitProcedureLines = isExitProcedure
    ? data.content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const procedureLabel = isExitProcedure
    ? exitProcedureLines[0]
    : undefined;

  const displayedItems = isExitProcedure
    ? exitProcedureLines.slice(1)
    : items;

  // Kedua kartu khusus tidak menggunakan paragraf biasa.
  const displayedDescription =
    isExitProcedure || isExitSavings ? "" : description;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md sm:p-6">
      <div className="flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        <Icon size={30} strokeWidth={1.5} />
      </div>

      <h3 className="mt-5 text-base font-bold leading-6 text-gray-900">
        {data.title || card.fallbackTitle}
      </h3>

      {/* Badge persetujuan tata cara keluar */}
      {isExitProcedure && procedureLabel && (
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
            {procedureLabel}
          </span>
        </div>
      )}

      {/* Checklist */}
      {card.type === "checklist" && items.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {items.map((item, index) => (
            <li
              key={`${data.id}-${index}`}
              className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
            >
              <CheckCircle2
                size={16}
                className="mt-1 shrink-0 text-orange-600"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Chips kategori */}
      {card.type === "chips" && items.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={`${data.id}-${index}`}
              className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium leading-5 text-orange-800"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* Numbered steps */}
      {card.type === "steps" && displayedItems.length > 0 && (
        <ol className="mt-3 space-y-2.5">
          {displayedItems.map((item, index) => (
            <li
              key={`${data.id}-${index}`}
              className="flex items-start gap-3 text-sm leading-6 text-gray-600"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-600">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )}

      {/* Deskripsi klasifikasi pengambilan simpanan */}
      {isExitSavings && savingsDescriptions.length > 0 && (
        <div className="mt-5 space-y-4">
          {savingsDescriptions.map((item, index) => (
            <div
              key={`${data.id}-${index}`}
              className="border-l-2 border-orange-200 pl-3"
            >
              {item.title && (
                <h4 className="text-sm font-semibold leading-6 text-gray-800">
                  {item.title}
                </h4>
              )}

              <p className="mt-1 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Deskripsi biasa untuk kartu lainnya */}
      {displayedDescription && (
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
          {displayedDescription}
        </p>
      )}
    </article>
  );
}

// Parsing konten definisi sistem tanggung renteng.
function parseDefinitionItems(content: string) {
  const blocks = content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const introduction = blocks[0] ?? "";

  const items = blocks
    .slice(1)
    .join("\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return {
          title: line,
          description: "",
        };
      }

      return {
        title: line.slice(0, separatorIndex).trim(),
        description: line.slice(separatorIndex + 1).trim(),
      };
    });

  return { introduction, items };
}

// Parsing konten paragraf dan daftar item.
function parseParagraphAndItems(content: string) {
  const blocks = content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const introduction = blocks[0] ?? "";

  const items = blocks
    .slice(1)
    .join("\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    items,
    introduction,
  };
}

// Section Sistem Tanggung Renteng.
function TanggungRentengSection({
  definition,
  objectives,
  principles,
  values,
}: {
  definition?: MembershipCardData;
  objectives?: MembershipCardData;
  principles?: MembershipCardData;
  values?: MembershipCardData;
}) {
  if (!definition && !objectives && !principles && !values) {
    return null;
  }

  const definitionContent = definition
    ? parseDefinitionItems(definition.content)
    : { introduction: "", items: [] };

  const objectiveContent = objectives
    ? parseParagraphAndItems(objectives.content)
    : { items: [], introduction: "" };

  const principleContent = principles
    ? parseContent(principles.content)
    : { items: [], description: "" };

  const valueContent = values
    ? parseContent(values.content)
    : { items: [], description: "" };

  return (
    <section
      id="sistem-tanggung-renteng"
      aria-labelledby="tanggung-renteng-title"
      className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up">
          <header className="mb-8 sm:mb-10">
            <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
              Fondasi Keanggotaan
            </span>

            <h2
              id="tanggung-renteng-title"
              className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
            >
              Sistem Tanggung Renteng
            </h2>

            <p className="mt-3 max-w-6xl text-sm leading-6 text-gray-600 sm:text-base">
              Konsep dasar, hakekat, tujuan, prinsip pelaksanaan, serta tata nilai Sistem Tanggung Renteng yang menjadi pilar utama Koperasi SBW.
            </p>
          </header>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {definition && (
            <ScrollReveal direction="left" delay={100} className="h-full">
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Users size={27} strokeWidth={1.5} />
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {definition.title || "Definisi & Unsur"}
                </h3>

                {definitionContent.introduction && (
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {definitionContent.introduction}
                  </p>
                )}

                <div className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
                  {definitionContent.items.map((item, index) => (
                    <div
                      key={`${definition.id}-${index}`}
                      className="rounded-xl bg-orange-50 px-3 py-2.5"
                    >
                      <p className="font-semibold text-orange-800">
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          )}

          {objectives && (
            <ScrollReveal direction="right" delay={200} className="h-full">
              <article className="h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Handshake size={27} strokeWidth={1.5} />
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-900">
                  {objectives.title || "Hakekat & Tujuan"}
                </h3>

                {objectiveContent.introduction && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {objectiveContent.introduction}
                  </p>
                )}

                {objectiveContent.items.length > 0 && (
                  <ul className="mt-3 space-y-2.5">
                    {objectiveContent.items.map((item, index) => (
                      <li
                        key={`${objectives.id}-${index}`}
                        className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-1 shrink-0 text-orange-600"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </ScrollReveal>
          )}
        </div>

        {(principles || values) && (
          <ScrollReveal direction="up" delay={150}>
            <article className="mt-4 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-5 sm:p-6 lg:grid-cols-[0.8fr_1.2fr]">
              {principles && (
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {principles.title || "Prinsip Pelaksanaan"}
                  </h3>

                  <ul className="mt-4 space-y-2.5">
                    {principleContent.items.map((item, index) => (
                      <li
                        key={`${principles.id}-${index}`}
                        className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-1 shrink-0 text-orange-600"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {principleContent.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {principleContent.description}
                    </p>
                  )}
                </div>
              )}

              {values && (
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {values.title || "Nilai-Nilai TR"}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {valueContent.items.map((item, index) => {
                      const Icon =
                        trValueIcons[index % trValueIcons.length];

                      return (
                        <div
                          key={`${values.id}-${index}`}
                          className="flex min-h-20 flex-col items-start justify-center gap-2 rounded-xl bg-orange-50 p-3"
                        >
                          <Icon
                            size={17}
                            className="text-orange-600"
                          />
                          <span className="text-xs font-semibold leading-5 text-orange-800">
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {valueContent.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {valueContent.description}
                    </p>
                  )}
                </div>
              )}
            </article>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

// Halaman informasi persyaratan dan ketentuan keanggotaan.
export default async function MembershipRequirements() {
  const publishedContents = await prisma.membershipInfo.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        {
          section: "REQUIREMENT",
          contentKey: {
            in: [
              "MEMBERSHIP_REQUIREMENTS",
              "FINANCIAL_ADMIN",
              "MANDATORY_EDUCATION",
              "EXIT_CRITERIA",
              "EXIT_PROCEDURE",
              "EXIT_SAVINGS",
              "RAYON_TRANSFER",
              "SAVINGS_WITHDRAWAL_REQUIREMENTS",
              "SAVINGS_WITHDRAWAL_STEPS",
              "TR_DEFINITION",
              "TR_OBJECTIVES",
              "TR_PRINCIPLES",
              "TR_VALUES",
            ],
          },
        },
        {
          section: "HOW_TO_REGISTER",
          contentKey: "REGISTRATION_STEPS",
        },
      ],
    },
    select: {
      id: true,
      section: true,
      contentKey: true,
      title: true,
      content: true,
    },
  });

  const contentByKey = new Map<string, MembershipCardData>(
    publishedContents.map((item) => [
      item.contentKey,
      {
        id: item.id,
        title: item.title,
        content: item.content,
      },
    ])
  );

  const visibleEntryCards = entryCards.flatMap((card) => {
    const data = contentByKey.get(card.contentKey);
    return data ? [{ card, data }] : [];
  });

  const visibleExitCards = exitCards.flatMap((card) => {
    const data = contentByKey.get(card.contentKey);
    return data ? [{ card, data }] : [];
  });

  const visibleWithdrawalCards = withdrawalCards.flatMap((card) => {
    const data = contentByKey.get(card.contentKey);
    return data ? [{ card, data }] : [];
  });

  const rayonContent = contentByKey.get("RAYON_TRANSFER");

  const trDefinition = contentByKey.get("TR_DEFINITION");
  const trObjectives = contentByKey.get("TR_OBJECTIVES");
  const trPrinciples = contentByKey.get("TR_PRINCIPLES");
  const trValues = contentByKey.get("TR_VALUES");

  const hasTanggungRenteng =
    Boolean(trDefinition) ||
    Boolean(trObjectives) ||
    Boolean(trPrinciples) ||
    Boolean(trValues);

  if (
    visibleEntryCards.length === 0 &&
    visibleExitCards.length === 0 &&
    visibleWithdrawalCards.length === 0 &&
    !rayonContent &&
    !hasTanggungRenteng
  ) {
    return null;
  }

  return (
    <>
      {/* SECTION ANGGOTA MASUK */}
      {visibleEntryCards.length > 0 && (
        <section
          id="anggota-masuk"
          aria-labelledby="membership-entry-title"
          className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <ScrollReveal direction="up">
              <header className="mb-8 sm:mb-10">
                <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Anggota Masuk
                </span>

                <h2
                  id="membership-entry-title"
                  className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
                >
                  Syarat dan Tata Cara Anggota Masuk
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Pelajari persyaratan, ketentuan, pendidikan, dan tahapan
                  untuk menjadi anggota Koperasi Konsumen Setia Budi Wanita.
                </p>
              </header>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {visibleEntryCards.map(({ card, data }, index) => (
                <ScrollReveal
                  key={data.id}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 120}
                  className="h-full"
                >
                  <MembershipCard card={card} data={data} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION ANGGOTA KELUAR */}
      {visibleExitCards.length > 0 && (
        <section
          id="anggota-keluar"
          aria-labelledby="membership-exit-title"
          className="scroll-mt-24 bg-gray-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <ScrollReveal direction="left">
              <header className="mb-8 sm:mb-10">
                <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Anggota Keluar
                </span>

                <h2
                  id="membership-exit-title"
                  className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
                >
                  Syarat dan Tata Cara Anggota Keluar
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Informasi kriteria keluar, prosedur pengunduran diri,
                  serta klasifikasi dan pengambilan simpanan anggota.
                </p>
              </header>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleExitCards.map(({ card, data }, index) => (
                <ScrollReveal
                  key={data.id}
                  direction={
                    index === 1 ? "up" : index === 0 ? "left" : "right"
                  }
                  delay={index * 120}
                  className="h-full"
                >
                  <MembershipCard card={card} data={data} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION RAYON KELOMPOK */}
      {rayonContent && (
        <section
          id="rayon-kelompok"
          aria-labelledby="rayon-kelompok-title"
          className="scroll-mt-24 bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <ScrollReveal direction="left">
              <header className="mb-8 sm:mb-10">
                <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Rayon Kelompok
                </span>

                <h2
                  id="rayon-kelompok-title"
                  className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
                >
                  Rayon Kelompok (Mutasi Kelompok)
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                  Ketentuan administratif dan syarat perpindahan rayon atau mutasi kelompok bagi anggota koperasi.
                </p>
              </header>
            </ScrollReveal>

            {(() => {
              const blocks = rayonContent.content
                .trim()
                .split(/\r?\n\s*\r?\n/)
                .map((block) => block.trim())
                .filter(Boolean);

              const requirements = (blocks[0] ?? "")
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);

              const notice = blocks.slice(1).join("\n\n");

              return (
                <ScrollReveal direction="right" delay={120}>
                  <article className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10 md:p-8">
                    <div>
                      <div className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                        <Repeat2 size={34} strokeWidth={1.5} />
                      </div>

                      <h3 className="mt-5 text-base font-bold text-gray-900">
                        {rayonContent.title || "Ketentuan Pindah Rayon"}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Syarat utama bagi anggota yang ingin melakukan kepindahan rayon kelompok harus dipastikan berjalan tertib dan sesuai dengan ketentuan organisasi koperasi.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {requirements.length > 0 && (
                        <ul className="space-y-3">
                          {requirements.map((item, index) => (
                            <li
                              key={`${rayonContent.id}-${index}`}
                              className="flex items-start gap-2.5 text-sm leading-6 text-gray-600"
                            >
                              <CheckCircle2
                                size={17}
                                className="mt-0.5 shrink-0 text-orange-600"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {notice && (
                        <div className="flex items-start gap-3 rounded-xl bg-orange-50 p-4 text-sm leading-6 text-orange-800">
                          <Info
                            size={19}
                            className="mt-0.5 shrink-0 text-orange-600"
                          />
                          <p className="whitespace-pre-line">{notice}</p>
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              );
            })()}
          </div>
        </section>
      )}

      {/* SECTION PENARIKAN SIMPANAN */}
      {visibleWithdrawalCards.length > 0 && (
        <section
          id="penarikan-simpanan"
          aria-labelledby="savings-withdrawal-title"
          className="scroll-mt-24 bg-gray-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <ScrollReveal direction="up">
              <header className="mb-8 sm:mb-10">
                <span className="inline-flex rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                  Penarikan Simpanan
                </span>

                <h2
                  id="savings-withdrawal-title"
                  className="mt-4 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl"
                >
                  Penarikan Simpanan Pokok dan Simpanan Wajib
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Informasi persyaratan dan prosedur penarikan simpanan anggota.
                </p>
              </header>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {visibleWithdrawalCards.map(({ card, data }, index) => (
                <ScrollReveal
                  key={data.id}
                  direction={index === 0 ? "left" : "right"}
                  delay={index * 140}
                  className="h-full"
                >
                  <MembershipCard card={card} data={data} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION SISTEM TANGGUNG RENTENG */}
      <TanggungRentengSection
        definition={trDefinition}
        objectives={trObjectives}
        principles={trPrinciples}
        values={trValues}
      />
    </>
  );
}