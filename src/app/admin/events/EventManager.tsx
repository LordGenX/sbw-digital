"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

import {
  archiveEvent,
  publishEvent,
} from "@/actions/event.actions";

import EventForm from "./EventForm";

type EventMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type EventData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  startAt: Date | string;
  endAt: Date | string | null;
  mediaId: string | null;
  media: EventMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type EventManagerProps = {
  events: EventData[];
};

type StatusTab = EventData["status"];

const ITEMS_PER_PAGE = 5;

const statusTabs: {
  value: StatusTab;
  label: string;
  description: string;
  activeClass: string;
}[] = [
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Agenda yang sudah dipublikasikan dan ditampilkan pada website.",
    activeClass: "border-orange-600 text-orange-700",
  },
  {
    value: "DRAFT",
    label: "Draft",
    description: "Agenda yang masih dalam tahap penyusunan.",
    activeClass: "border-amber-500 text-amber-700",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Agenda yang sudah diarsipkan.",
    activeClass: "border-gray-500 text-gray-700",
  },
];

const statusStyles: Record<EventData["status"], string> = {
  PUBLISHED: "border-green-200 bg-green-50 text-green-700",
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
};

const statusLabels: Record<EventData["status"], string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

function formatDate(value: Date | string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateShort(value: Date | string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value: Date | string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({ status }: { status: EventData["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function EventThumbnail({
  media,
  compact = false,
}: {
  media: EventMedia | null;
  compact?: boolean;
}) {
  const isImage = media?.mimeType.startsWith("image/") ?? false;

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

  if (!isImage) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 ${
          compact ? "h-12 w-16" : "h-36 w-full sm:w-52"
        }`}
        title={media.fileName}
      >
        <div className="flex flex-col items-center gap-1">
          <FileText size={compact ? 18 : 26} />
          {!compact && <span className="text-xs">File dokumen</span>}
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
      <Image
        src={media.fileUrl}
        alt={media.altText || media.fileName}
        fill
        sizes={compact ? "64px" : "(max-width: 640px) 100vw, 208px"}
        className="object-cover"
      />
    </div>
  );
}

export default function EventManager({ events }: EventManagerProps) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | undefined>(
    undefined
  );
  const [viewingEvent, setViewingEvent] = useState<EventData | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [busyEventId, setBusyEventId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<StatusTab>("PUBLISHED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const publishedCount = events.filter(
    (event) => event.status === "PUBLISHED"
  ).length;
  const draftCount = events.filter(
    (event) => event.status === "DRAFT"
  ).length;
  const archivedCount = events.filter(
    (event) => event.status === "ARCHIVED"
  ).length;

  const statusCounts: Record<StatusTab, number> = {
    PUBLISHED: publishedCount,
    DRAFT: draftCount,
    ARCHIVED: archivedCount,
  };

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        events
          .map((event) => event.location?.trim())
          .filter((location): location is string => Boolean(location))
      )
    ).sort((a, b) => a.localeCompare(b, "id"));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events
      .filter((event) => event.status === activeTab)
      .filter((event) => {
        if (selectedLocation === "ALL") return true;
        return event.location === selectedLocation;
      })
      .filter((event) => {
        if (!query) return true;

        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          (event.location ?? "").toLowerCase().includes(query) ||
          event.slug.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );
  }, [events, activeTab, selectedLocation, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const firstItem = filteredEvents.length === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length);

  function handleAdd() {
    setEditingEvent(undefined);
    setViewingEvent(null);
    setShowForm(true);
    setMessage("");
  }

  function handleEdit(event: EventData) {
    setEditingEvent(event);
    setViewingEvent(null);
    setShowForm(true);
    setMessage("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingEvent(undefined);
    setViewingEvent(null);
    setMessage("");
    router.refresh();
  }

  function handleTabChange(tab: StatusTab) {
    setActiveTab(tab);
    setSearchQuery("");
    setSelectedLocation("ALL");
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleLocationChange(value: string) {
    setSelectedLocation(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  async function handlePublish(id: string) {
    if (busyEventId) return;

    setBusyEventId(id);
    setMessage("");

    try {
      const result = await publishEvent(id);

      if ("error" in result) {
        setMessageType("error");
        setMessage(result.error.message);
        return;
      }

      setMessageType("success");
      setMessage("Agenda berhasil dipublikasikan.");
      router.refresh();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memublikasikan agenda."
      );
    } finally {
      setBusyEventId(null);
    }
  }

  async function handleArchive(id: string) {
    if (busyEventId) return;

    setBusyEventId(id);
    setMessage("");

    try {
      const result = await archiveEvent(id);

      if ("error" in result) {
        setMessageType("error");
        setMessage(result.error.message);
        return;
      }

      setMessageType("success");
      setMessage("Agenda berhasil diarsipkan.");
      router.refresh();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengarsipkan agenda."
      );
    } finally {
      setBusyEventId(null);
    }
  }

  const activeTabConfig = statusTabs.find(
    (tab) => tab.value === activeTab
  )!;

  return (
    <div className="space-y-6">
      {message && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <Archive size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{message}</p>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-auto rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showForm ? (
        <div className="space-y-4">
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="mb-3 text-sm font-medium text-gray-500 transition hover:text-orange-700"
            >
              ← Kembali ke daftar agenda
            </button>

            <h2 className="text-xl font-bold text-gray-900">
              {editingEvent ? "Edit Agenda" : "Tambah Agenda"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Lengkapi informasi kegiatan pada formulir berikut.
            </p>
          </div>

          <EventForm
            key={editingEvent?.id ?? "new"}
            event={editingEvent}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {/* Header Event */}
          <section className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <CalendarDays size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Konten Event
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Kelola informasi kegiatan, agenda, dan event SBW.
                </p>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {events.length} agenda terdaftar
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <Plus size={18} />
              Tambah Agenda
            </button>
          </section>

          {/* Tabs status */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
              {statusTabs.map((tab) => {
                const isActive = activeTab === tab.value;
                const Icon =
                  tab.value === "PUBLISHED"
                    ? CheckCircle2
                    : tab.value === "DRAFT"
                      ? FileText
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

          {/* Tabel agenda */}
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
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Agenda {activeTabConfig.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeTabConfig.description}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[activeTab]}`}
              >
                {filteredEvents.length} agenda ditemukan
              </span>
            </div>

            {/* Search dan filter lokasi */}
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
                  placeholder="Cari judul, deskripsi, atau lokasi agenda..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="relative w-full md:w-64">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={selectedLocation}
                  onChange={(event) =>
                    handleLocationChange(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="ALL">Semua Lokasi</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                />
              </div>
            </div>

            {paginatedEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-262.5 text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="w-14 px-4 py-4 text-center">No.</th>
                      <th className="w-24 px-4 py-4">Thumbnail</th>
                      <th className="min-w-56 px-4 py-4">Judul Event</th>
                      <th className="min-w-56 px-4 py-4">
                        Tanggal Pelaksanaan
                      </th>
                      <th className="min-w-40 px-4 py-4">Lokasi</th>
                      <th className="w-32 px-4 py-4">Status</th>
                      <th className="min-w-52 px-4 py-4 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedEvents.map((event, index) => {
                      const isBusy = busyEventId === event.id;

                      return (
                        <tr
                          key={event.id}
                          className="transition-colors hover:bg-orange-50/30"
                        >
                          <td className="px-4 py-4 text-center text-gray-500">
                            {firstItem + index}
                          </td>

                          <td className="px-4 py-3">
                            <EventThumbnail media={event.media} compact />
                          </td>

                          <td className="max-w-xs px-4 py-4">
                            <p
                              className="line-clamp-2 font-semibold text-gray-900"
                              title={event.title}
                            >
                              {event.title}
                            </p>
                            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                              {event.description}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            <div className="flex items-start gap-2">
                              <CalendarDays
                                size={16}
                                className="mt-0.5 shrink-0 text-orange-600"
                              />
                              <div>
                                <p className="font-medium">
                                  {formatDateShort(event.startAt)}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {formatTime(event.startAt)}
                                  {event.endAt
                                    ? ` – ${formatTime(event.endAt)}`
                                    : ""}
                                </p>
                                {event.endAt && (
                                  <p className="mt-1 text-xs text-gray-400">
                                    Sampai {formatDateShort(event.endAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="max-w-48 px-4 py-4 text-gray-600">
                            <div className="flex items-start gap-2">
                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-orange-600"
                              />
                              <span className="line-clamp-2">
                                {event.location || "Belum ditentukan"}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={event.status} />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingEvent(event)}
                                disabled={isBusy}
                                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Eye size={14} />
                                Lihat
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEdit(event)}
                                disabled={isBusy || busyEventId !== null}
                                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              {event.status === "DRAFT" && (
                                <button
                                  type="button"
                                  onClick={() => handlePublish(event.id)}
                                  disabled={busyEventId !== null}
                                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Send size={14} />
                                  {isBusy ? "Memproses..." : "Publish"}
                                </button>
                              )}

                              {event.status !== "ARCHIVED" && (
                                <button
                                  type="button"
                                  onClick={() => handleArchive(event.id)}
                                  disabled={busyEventId !== null}
                                  title="Arsipkan agenda"
                                  aria-label={`Arsipkan ${event.title}`}
                                  className="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Archive size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  {searchQuery || selectedLocation !== "ALL" ? (
                    <Search size={25} />
                  ) : (
                    <CalendarDays size={25} />
                  )}
                </div>
                <h4 className="mt-4 font-semibold text-gray-900">
                  {searchQuery || selectedLocation !== "ALL"
                    ? "Agenda tidak ditemukan"
                    : `Belum ada agenda ${activeTabConfig.label.toLowerCase()}`}
                </h4>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                  {searchQuery || selectedLocation !== "ALL"
                    ? "Coba gunakan kata kunci atau filter lokasi yang berbeda."
                    : "Agenda dengan status ini belum tersedia."}
                </p>
                {(searchQuery || selectedLocation !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLocation("ALL");
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
            {filteredEvents.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-800">
                    {firstItem}–{lastItem}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredEvents.length}
                  </span>{" "}
                  agenda
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

      {/* Modal detail agenda */}
      {viewingEvent && !showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewingEvent(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-detail-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <CalendarDays size={21} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Detail Agenda</h3>
                  <p className="text-xs text-gray-500">
                    Informasi lengkap kegiatan SBW
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEvent(null)}
                aria-label="Tutup detail"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={viewingEvent.status} />
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  Agenda
                </span>
              </div>

              <div>
                <h4
                  id="event-detail-title"
                  className="text-xl font-bold leading-7 text-gray-900"
                >
                  {viewingEvent.title}
                </h4>
                <p className="mt-2 break-all text-xs text-gray-400">
                  Slug: {viewingEvent.slug}
                </p>
              </div>

              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-800">
                  Media Agenda
                </h5>
                {viewingEvent.media ? (
                  <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
                    <EventThumbnail media={viewingEvent.media} />
                    <p className="break-all text-xs text-gray-500">
                      {viewingEvent.media.fileName}
                    </p>
                    <a
                      href={viewingEvent.media.fileUrl}
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
                        Agenda ini tidak memiliki lampiran media.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h5 className="mb-2 text-sm font-semibold text-gray-800">
                  Deskripsi
                </h5>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <p className="whitespace-pre-line wrap-break-word text-sm leading-7 text-gray-700">
                    {viewingEvent.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <CalendarDays size={17} />
                    <h5 className="text-sm font-semibold text-gray-800">
                      Mulai
                    </h5>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    {formatDate(viewingEvent.startAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock3 size={17} />
                    <h5 className="text-sm font-semibold text-gray-800">
                      Selesai
                    </h5>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    {viewingEvent.endAt
                      ? formatDate(viewingEvent.endAt)
                      : "Belum ditentukan"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <MapPin size={17} />
                  <h5 className="text-sm font-semibold text-gray-800">
                    Lokasi
                  </h5>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {viewingEvent.location || "Belum ditentukan"}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setViewingEvent(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleEdit(viewingEvent)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                <Pencil size={15} />
                Edit Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}