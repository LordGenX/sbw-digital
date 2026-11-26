"use client";

import { useMemo, useState } from "react";
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
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Filter,
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
  contentKey: string;
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

type StatusTab = "PUBLISHED" | "DRAFT" | "ARCHIVED";

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

const statusTabs: {
  value: StatusTab;
  label: string;
  icon: typeof CheckCircle2;
  activeStyle: string;
}[] = [
  {
    value: "PUBLISHED",
    label: "Published",
    icon: CheckCircle2,
    activeStyle: "text-green-700 border-green-600",
  },
  {
    value: "DRAFT",
    label: "Draft",
    icon: FilePenLine,
    activeStyle: "text-amber-700 border-amber-500",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    icon: Archive,
    activeStyle: "text-gray-700 border-gray-500",
  },
];

const ITEMS_PER_PAGE = 5;

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

  const [activeTab, setActiveTab] =
    useState<StatusTab>("PUBLISHED");

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedSection, setSelectedSection] =
    useState<MembershipData["section"] | "ALL">("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [viewingContent, setViewingContent] =
    useState<MembershipData | null>(null);

  // Menghitung jumlah konten berdasarkan status
  const publishedCount = contents.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const draftCount = contents.filter(
    (item) => item.status === "DRAFT"
  ).length;

  const archivedCount = contents.filter(
    (item) => item.status === "ARCHIVED"
  ).length;

  const statusCounts: Record<StatusTab, number> = {
    PUBLISHED: publishedCount,
    DRAFT: draftCount,
    ARCHIVED: archivedCount,
  };

  // Mengambil konten sesuai tab, pencarian, dan filter
  const filteredContents = useMemo(() => {
    return contents
      .filter((item) => item.status === activeTab)
      .filter((item) => {
        if (selectedSection === "ALL") return true;

        return item.section === selectedSection;
      })
      .filter((item) => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return true;

        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const sectionA = sections.findIndex(
          (section) => section.value === a.section
        );

        const sectionB = sections.findIndex(
          (section) => section.value === b.section
        );

        if (sectionA !== sectionB) {
          return sectionA - sectionB;
        }

        return a.sortOrder - b.sortOrder;
      });
  }, [contents, activeTab, selectedSection, searchQuery]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredContents.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedContents = filteredContents.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const startItem =
    filteredContents.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredContents.length
  );

  function handleAdd() {
    setEditingContent(null);
    setViewingContent(null);
    setIsCreating(true);
  }

  function handleEdit(content: MembershipData) {
    setIsCreating(false);
    setViewingContent(null);
    setEditingContent(content);
  }

  function handleView(content: MembershipData) {
    setViewingContent(content);
  }

  function handleCancel() {
    setIsCreating(false);
    setEditingContent(null);
    setViewingContent(null);
  }

  function handleSuccess() {
    handleCancel();
    router.refresh();
  }

  function handleTabChange(tab: StatusTab) {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedSection("ALL");
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleSectionChange(
    value: MembershipData["section"] | "ALL"
  ) {
    setSelectedSection(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  }

  const activeTabConfig = statusTabs.find(
    (tab) => tab.value === activeTab
  )!;

  const ActiveIcon = activeTabConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header Membership */}
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

      {/* Daftar konten */}
      {!isCreating && !editingContent && (
        <>
          {/* Tab status */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleTabChange(tab.value)}
                    className={`relative flex shrink-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-sm font-semibold transition ${
                      isActive
                        ? tab.activeStyle
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={17} />

                    {tab.label}

                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "border-current/20 bg-current/5"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }`}
                    >
                      {statusCounts[tab.value]}
                    </span>

                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel daftar */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header panel */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    activeTab === "PUBLISHED"
                      ? "bg-green-50 text-green-700"
                      : activeTab === "DRAFT"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <ActiveIcon size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konten {activeTabConfig.label}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {activeTab === "PUBLISHED"
                      ? "Konten yang aktif ditampilkan pada website."
                      : activeTab === "DRAFT"
                        ? "Konten yang masih dalam proses penyuntingan."
                        : "Konten lama yang tidak lagi aktif."}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[activeTab]}`}
              >
                {filteredContents.length} konten ditemukan
              </span>
            </div>

            {/* Pencarian dan filter */}
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 md:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    handleSearch(event.target.value)
                  }
                  placeholder="Cari judul atau isi konten..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="relative w-full md:w-64">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={selectedSection}
                  onChange={(event) =>
                    handleSectionChange(
                      event.target.value as
                        | MembershipData["section"]
                        | "ALL"
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="ALL">Semua Section</option>

                  {sections.map((section) => (
                    <option
                      key={section.value}
                      value={section.value}
                    >
                      {section.label}
                    </option>
                  ))}
                </select>

                <ChevronRight
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                />
              </div>
            </div>

            {/* Tabel */}
            {paginatedContents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-190 text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="w-16 px-5 py-4 text-center">
                        No.
                      </th>

                      <th className="px-5 py-4">
                        Judul Konten
                      </th>

                      <th className="px-5 py-4">
                        Section
                      </th>

                      <th className="w-24 px-5 py-4 text-center">
                        Urutan
                      </th>

                      <th className="w-32 px-5 py-4">
                        Status
                      </th>

                      <th className="w-48 px-5 py-4 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedContents.map((item, index) => (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-orange-50/30"
                      >
                        <td className="px-5 py-4 text-center text-gray-500">
                          {startItem + index}
                        </td>

                        <td className="max-w-md px-5 py-4">
                          <p
                            className="font-semibold text-gray-900"
                            title={item.title}
                          >
                            {item.title}
                          </p>

                          <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                            {formatContent(item.content)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex max-w-48 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                            {formatSection(item.section)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center text-gray-600">
                          <span className="inline-flex items-center justify-center gap-1.5">
                            <ArrowUpDown
                              size={14}
                              className="text-gray-400"
                            />
                            {item.sortOrder}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleView(item)}
                              title="Lihat detail konten"
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            >
                              <Eye size={15} />
                              Lihat
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit konten"
                              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty state */
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  {searchQuery || selectedSection !== "ALL" ? (
                    <Search size={25} />
                  ) : (
                    <FileText size={25} />
                  )}
                </div>

                <h4 className="mt-4 font-semibold text-gray-900">
                  {searchQuery || selectedSection !== "ALL"
                    ? "Konten tidak ditemukan"
                    : `Belum ada konten ${activeTabConfig.label.toLowerCase()}`}
                </h4>

                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                  {searchQuery || selectedSection !== "ALL"
                    ? "Coba gunakan kata kunci atau filter section yang berbeda."
                    : "Konten dengan status ini belum tersedia."}
                </p>

                {(searchQuery || selectedSection !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSection("ALL");
                      setCurrentPage(1);
                    }}
                    className="mt-4 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    Reset pencarian dan filter
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredContents.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-800">
                    {startItem}–{endItem}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredContents.length}
                  </span>{" "}
                  konten
                </p>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(safeCurrentPage - 1)
                    }
                    disabled={safeCurrentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      aria-label={`Halaman ${page}`}
                      aria-current={
                        safeCurrentPage === page ? "page" : undefined
                      }
                      className={`flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                        safeCurrentPage === page
                          ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(safeCurrentPage + 1)
                    }
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Halaman berikutnya"
                    className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* Modal detail konten */}
      {viewingContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingContent(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-detail-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header modal */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <FileText size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Detail Membership
                  </h3>

                  <p className="text-xs text-gray-500">
                    Informasi lengkap konten membership
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingContent(null)}
                aria-label="Tutup detail"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Isi modal */}
            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  {formatSection(viewingContent.section)}
                </span>

                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[viewingContent.status]}`}
                >
                  {statusLabels[viewingContent.status]}
                </span>
              </div>

              <div>
                <h4
                  id="membership-detail-title"
                  className="text-xl font-bold leading-7 text-gray-900"
                >
                  {viewingContent.title}
                </h4>

                <p className="mt-2 text-xs text-gray-500">
                  Urutan konten: {viewingContent.sortOrder}
                </p>
              </div>

              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-800">
                  Isi Konten
                </h5>

                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <p className="whitespace-pre-line wrap-break-word text-sm leading-7 text-gray-700">
                    {formatContent(viewingContent.content)}
                  </p>
                </div>
              </div>

              {/* Media */}
              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-800">
                  Media
                </h5>

                {viewingContent.media ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center">
                    {viewingContent.media.mimeType.startsWith(
                      "image/"
                    ) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={viewingContent.media.fileUrl}
                        alt={
                          viewingContent.media.altText ||
                          viewingContent.media.fileName
                        }
                        className="h-40 w-full rounded-lg border border-gray-100 bg-gray-50 object-contain sm:w-48"
                      />
                    ) : (
                      <div className="flex h-24 w-full items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400 sm:w-32">
                        <FileText size={30} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-gray-800">
                        {viewingContent.media.fileName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {viewingContent.media.mimeType}
                      </p>

                      <a
                        href={viewingContent.media.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800"
                      >
                        <Eye size={14} />
                        Buka media
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-white text-gray-400">
                      <ImageIcon size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Belum ada media
                      </p>

                      <p className="text-xs text-gray-500">
                        Konten ini tidak memiliki lampiran media.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer modal */}
            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setViewingContent(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => handleEdit(viewingContent)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <Pencil size={15} />
                Edit Konten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}