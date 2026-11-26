"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePenLine,
  FileText,
  Filter,
  Image as ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";

import AboutForm from "./AboutForm";

type AboutMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type AboutData = {
  id: string;
  section:
    | "HISTORY"
    | "VISION_MISSION"
    | "PROFILE"
    | "ORGANIZATION"
    | "ACHIEVEMENT";
  title: string;
  content: string;
  mediaId: string | null;
  media: AboutMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type AboutManagerProps = {
  contents: AboutData[];
};

type StatusTab = AboutData["status"];

const ITEMS_PER_PAGE = 5;

const sections: {
  value: AboutData["section"];
  label: string;
}[] = [
  { value: "HISTORY", label: "Sejarah" },
  { value: "VISION_MISSION", label: "Visi dan Misi" },
  { value: "PROFILE", label: "Profil" },
  { value: "ORGANIZATION", label: "Organisasi" },
  { value: "ACHIEVEMENT", label: "Prestasi" },
];

const statusStyles: Record<AboutData["status"], string> = {
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  PUBLISHED: "border-green-200 bg-green-50 text-green-700",
  ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
};

const statusLabels: Record<AboutData["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusTabs: {
  value: StatusTab;
  label: string;
  description: string;
  activeClass: string;
}[] = [
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Konten yang aktif ditampilkan pada website.",
    activeClass: "border-green-600 text-green-700",
  },
  {
    value: "DRAFT",
    label: "Draft",
    description: "Konten yang masih dalam proses penyuntingan.",
    activeClass: "border-amber-500 text-amber-700",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Konten lama yang tidak lagi aktif.",
    activeClass: "border-gray-500 text-gray-700",
  },
];

function formatSection(section: AboutData["section"]) {
  return sections.find((item) => item.value === section)?.label ?? section;
}

function formatContent(content: string) {
  const normalized = content.trim();
  return normalized || "Tidak ada isi konten.";
}

function StatusBadge({ status }: { status: AboutData["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function AboutMediaPreview({
  media,
  compact = false,
}: {
  media: AboutMedia | null;
  compact?: boolean;
}) {
  if (!media) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-400 ${
          compact ? "h-12 w-16" : "h-36 w-full sm:w-52"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <ImageIcon size={compact ? 18 : 26} />
          {!compact && <span className="text-xs">Belum ada media</span>}
        </div>
      </div>
    );
  }

  if (!media.mimeType.startsWith("image/")) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 ${
          compact ? "h-12 w-16" : "h-36 w-full sm:w-52"
        }`}
        title={media.fileName}
      >
        <div className="flex flex-col items-center gap-1">
          <FileText size={compact ? 18 : 26} />
          {!compact && <span className="text-xs">File media</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${
        compact ? "h-12 w-16" : "h-36 w-full sm:w-52"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.fileUrl}
        alt={media.altText || media.fileName}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function AboutManager({ contents }: AboutManagerProps) {
  const router = useRouter();

  const [editingContent, setEditingContent] = useState<AboutData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingContent, setViewingContent] = useState<AboutData | null>(null);

  const [activeTab, setActiveTab] = useState<StatusTab>("PUBLISHED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<
    AboutData["section"] | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const statusCounts: Record<StatusTab, number> = {
    PUBLISHED: contents.filter((item) => item.status === "PUBLISHED").length,
    DRAFT: contents.filter((item) => item.status === "DRAFT").length,
    ARCHIVED: contents.filter((item) => item.status === "ARCHIVED").length,
  };

  const filteredContents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return contents
      .filter((item) => item.status === activeTab)
      .filter((item) => {
        if (selectedSection === "ALL") return true;
        return item.section === selectedSection;
      })
      .filter((item) => {
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

        if (sectionA !== sectionB) return sectionA - sectionB;
        return a.sortOrder - b.sortOrder;
      });
  }, [contents, activeTab, selectedSection, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContents.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContents = filteredContents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const firstItem = filteredContents.length === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredContents.length
  );

  function handleAdd() {
    setEditingContent(null);
    setViewingContent(null);
    setIsCreating(true);
  }

  function handleEdit(content: AboutData) {
    setIsCreating(false);
    setViewingContent(null);
    setEditingContent(content);
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
    setSearchQuery("");
    setSelectedSection("ALL");
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleSectionChange(value: AboutData["section"] | "ALL") {
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

  return (
    <div className="space-y-6">
      {/* Header About */}
      <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <Layers3 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Konten About</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Kelola informasi tentang sejarah, visi & misi, profil,
              organisasi, dan prestasi SBW.
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
            Tambah Konten
          </button>
        )}
      </section>

      {/* Form tambah */}
      {isCreating && (
        <AboutForm
          key="create"
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {/* Form edit */}
      {editingContent && !isCreating && (
        <AboutForm
          key={editingContent.id}
          content={editingContent}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {!isCreating && !editingContent && (
        <>
          {/* Tabs status */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
              {statusTabs.map((tab) => {
                const isActive = activeTab === tab.value;
                const Icon =
                  tab.value === "PUBLISHED"
                    ? CheckCircle2
                    : tab.value === "DRAFT"
                      ? FilePenLine
                      : Archive;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleTabChange(tab.value)}
                    className={`relative flex shrink-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-sm font-semibold transition ${
                      isActive
                        ? tab.activeClass
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

          {/* Panel tabel */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                  {activeTab === "PUBLISHED" ? (
                    <CheckCircle2 size={22} />
                  ) : activeTab === "DRAFT" ? (
                    <FilePenLine size={22} />
                  ) : (
                    <Archive size={22} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Konten {activeTabConfig.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeTabConfig.description}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[activeTab]}`}
              >
                {filteredContents.length} konten ditemukan
              </span>
            </div>

            {/* Search dan filter */}
            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 md:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => handleSearch(event.target.value)}
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
                      event.target.value as AboutData["section"] | "ALL"
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="ALL">Semua Section</option>
                  {sections.map((section) => (
                    <option key={section.value} value={section.value}>
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

            {/* Tabel konten */}
            {paginatedContents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="w-14 px-4 py-4 text-center">No.</th>
                      <th className="min-w-85 px-4 py-4">Judul Konten</th>
                      <th className="w-44 px-4 py-4">Section</th>
                      <th className="w-24 px-4 py-4 text-center">Urutan</th>
                      <th className="w-32 px-4 py-4">Status</th>
                      <th className="w-48 px-4 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedContents.map((item, index) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-orange-50/30"
                      >
                        <td className="px-4 py-4 text-center text-gray-500">
                          {firstItem + index}
                        </td>

                        <td className="max-w-lg px-4 py-4">
                          <div className="flex items-center gap-3">
                            <AboutMediaPreview media={item.media} compact />
                            <div className="min-w-0">
                              <p
                                className="truncate font-semibold text-gray-900"
                                title={item.title}
                              >
                                {item.title}
                              </p>
                              <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                {formatContent(item.content)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex max-w-40 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                            {formatSection(item.section)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center text-gray-600">
                          <span className="inline-flex items-center justify-center gap-1.5">
                            <ArrowUpDown size={14} className="text-gray-400" />
                            {item.sortOrder}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingContent(item)}
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
                    {firstItem}–{lastItem}
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
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Halaman sebelumnya"
                    className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
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
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
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

      {/* Modal detail */}
      {viewingContent && !isCreating && !editingContent && (
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
            aria-labelledby="about-detail-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <FileText size={21} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Detail Konten About</h3>
                  <p className="text-xs text-gray-500">
                    Informasi lengkap konten Tentang SBW
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

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  {formatSection(viewingContent.section)}
                </span>
                <StatusBadge status={viewingContent.status} />
              </div>

              <div>
                <h4
                  id="about-detail-title"
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

              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-800">
                  Media
                </h5>
                {viewingContent.media ? (
                  <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
                    <AboutMediaPreview media={viewingContent.media} />
                    <div>
                      <p className="break-all text-sm font-semibold text-gray-800">
                        {viewingContent.media.fileName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {viewingContent.media.mimeType}
                      </p>
                      {viewingContent.media.altText && (
                        <p className="mt-1 text-xs text-gray-500">
                          Alt text: {viewingContent.media.altText}
                        </p>
                      )}
                    </div>
                    <a
                      href={viewingContent.media.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 hover:text-orange-800"
                    >
                      <Eye size={14} />
                      Buka media
                    </a>
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