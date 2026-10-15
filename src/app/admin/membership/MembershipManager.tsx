
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  FileText,
  Layers3,
  ArrowUpDown,
  Archive,
  FilePenLine,
  CheckCircle2,
} from "lucide-react";

import MembershipForm from "./MembershipForm";

type MembershipMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type MembershipData = {
  id: string;
  section:
    | "WHY_JOIN"
    | "BENEFIT"
    | "REQUIREMENT"
    | "HOW_TO_REGISTER"
    | "FAQ";
  title: string;
  content: string;
  mediaId: string | null;
  media: MembershipMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type MembershipManagerProps = {
  contents: MembershipData[];
};

const sections: {
  value: MembershipData["section"];
  label: string;
}[] = [
  { value: "WHY_JOIN", label: "Mengapa Bergabung" },
  { value: "BENEFIT", label: "Manfaat Membership" },
  { value: "REQUIREMENT", label: "Persyaratan" },
  { value: "HOW_TO_REGISTER", label: "Cara Pendaftaran" },
  { value: "FAQ", label: "Pertanyaan Umum (FAQ)" },
];

const statusStyles: Record<MembershipData["status"], string> = {
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  PUBLISHED: "border-green-200 bg-green-50 text-green-700",
  ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
};

const statusLabels: Record<MembershipData["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

function formatSection(section: MembershipData["section"]) {
  return (
    sections.find((item) => item.value === section)?.label ?? section
  );
}

function formatContent(content: string) {
  const normalized = content.trim();
  return normalized || "Tidak ada isi konten.";
}

export default function MembershipManager({
  contents,
}: MembershipManagerProps) {
  const router = useRouter();

  const [editingContent, setEditingContent] =
    useState<MembershipData | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  const publishedContents = contents
    .filter((item) => item.status === "PUBLISHED")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const draftContents = contents.filter(
    (item) => item.status === "DRAFT",
  );

  const archivedContents = contents.filter(
    (item) => item.status === "ARCHIVED",
  );

  function handleAdd() {
    setEditingContent(null);
    setIsCreating(true);
  }

  function handleEdit(content: MembershipData) {
    setIsCreating(false);
    setEditingContent(content);
  }

  function handleCancel() {
    setIsCreating(false);
    setEditingContent(null);
  }

  function handleSuccess() {
    handleCancel();
    router.refresh();
  }

  function renderStatusTable(
    items: MembershipData[],
    status: "DRAFT" | "ARCHIVED",
  ) {
    return (
      <div className="space-y-5">
        {sections.map((section) => {
          const sectionItems = items
            .filter((item) => item.section === section.value)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <section
              key={`${status}-${section.value}`}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-5">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {section.label}
                  </h4>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {sectionItems.length} konten
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                >
                  {statusLabels[status]}
                </span>
              </div>

              {sectionItems.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-500 sm:px-5">
                  Belum ada konten{" "}
                  {statusLabels[status].toLowerCase()} pada section ini.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-130 text-left text-sm">
                    <thead className="border-b border-gray-100 bg-white text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold sm:px-5">
                          Judul
                        </th>

                        <th className="px-4 py-3 font-semibold">
                          Urutan
                        </th>

                        <th className="px-4 py-3 text-right font-semibold sm:px-5">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {sectionItems.map((item) => (
                        <tr
                          key={item.id}
                          className="transition hover:bg-orange-50/40"
                        >
                          <td className="max-w-sm px-4 py-4 sm:px-5">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                              {formatContent(item.content)}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                            <span className="inline-flex items-center gap-1.5">
                              <ArrowUpDown
                                size={14}
                                className="text-gray-400"
                              />
                              {item.sortOrder}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right sm:px-5">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <Layers3 size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Konten Membership
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Kelola informasi manfaat, persyaratan, dan pendaftaran
              membership SBW.
            </p>

            <p className="mt-2 text-sm font-medium text-gray-700">
              {contents.length} konten terdaftar
            </p>
          </div>
        </div>

        {!isCreating && !editingContent && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Plus size={18} />
            Tambah Membership
          </button>
        )}
      </div>

      {/* Form tambah */}
      {isCreating && (
        <MembershipForm
          key="create"
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {/* Form edit */}
      {editingContent && !isCreating && (
        <MembershipForm
          key={editingContent.id}
          content={editingContent}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {/* Daftar hanya tampil saat form ditutup */}
      {!isCreating && !editingContent && (
        <>
          {/* Published cards */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konten Published
                  </h3>

                  <p className="text-sm text-gray-500">
                    Konten yang aktif ditampilkan pada website.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {publishedContents.length} konten
              </span>
            </div>

            {publishedContents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-green-200 bg-green-50/40 px-5 py-8 text-center">
                <FileText
                  className="mx-auto text-green-700"
                  size={26}
                />

                <p className="mt-3 text-sm font-medium text-gray-800">
                  Belum ada konten yang dipublikasikan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {publishedContents.map((item) => (
                  <article
                    key={item.id}
                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                          {formatSection(item.section)}
                        </span>

                        <h4 className="mt-3 wrap-break-word text-lg font-bold leading-7 text-gray-900">
                          {item.title}
                        </h4>
                      </div>

                      <span
                        className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles.PUBLISHED}`}
                      >
                        Published
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {formatContent(item.content)}
                    </p>

                    {/* Preview media dan nama file */}
                    <div className="mt-4 flex min-w-0 items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/70 p-2.5">
                      {item.media ? (
                        <>
                          {item.media.mimeType.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.media.fileUrl}
                              alt={
                                item.media.altText ||
                                item.media.fileName
                              }
                              className="h-19 w-27.5 shrink-0 rounded-md border border-gray-200 bg-white object-cover"
                            />
                          ) : (
                            <div className="flex h-19 w-27.5 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                              <FileText
                                size={24}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">
                              Media
                            </p>

                            <p
                              className="mt-1 truncate text-sm font-medium text-gray-800"
                              title={item.media.fileName}
                            >
                              {item.media.fileName}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-19 w-27.5 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white">
                            <FileText
                              size={24}
                              className="text-gray-300"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500">
                              Media
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                              Belum ada media
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                        <ArrowUpDown size={16} />
                        Urutan: {item.sortOrder}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-orange-200 px-3.5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Draft table */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <FilePenLine size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konten Draft
                  </h3>

                  <p className="text-sm text-gray-500">
                    Konten yang masih dalam proses penyuntingan.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {draftContents.length} konten
              </span>
            </div>

            {renderStatusTable(draftContents, "DRAFT")}
          </section>

          {/* Archived table */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Archive size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konten Archived
                  </h3>

                  <p className="text-sm text-gray-500">
                    Konten lama yang tidak lagi aktif.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {archivedContents.length} konten
              </span>
            </div>

            {renderStatusTable(archivedContents, "ARCHIVED")}
          </section>
        </>
      )}
    </div>
  );
}