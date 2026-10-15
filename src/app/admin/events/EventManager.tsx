"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Send,
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

function StatusBadge({
  status,
}: {
  status: EventData["status"];
}) {
  const styles = {
    PUBLISHED:
      "bg-green-50 text-green-700 ring-green-600/20",
    DRAFT:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
    ARCHIVED:
      "bg-gray-100 text-gray-600 ring-gray-500/20",
  };

  const labels = {
    PUBLISHED: "Published",
    DRAFT: "Draft",
    ARCHIVED: "Archived",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function MediaPreview({
  media,
}: {
  media: EventMedia | null;
}) {
  if (!media) {
    return (
      <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400 sm:h-28 sm:w-36">
        <div className="flex flex-col items-center gap-1">
          <ImageIcon size={22} />
          <span className="text-xs">
            Belum ada media
          </span>
        </div>
      </div>
    );
  }

  const isImage = media.mimeType.startsWith("image/");

  return (
    <div className="w-full min-w-0 sm:w-36 sm:shrink-0">
      {isImage ? (
        <Image
          src={media.fileUrl}
          alt={media.altText || media.fileName}
          width={288}
          height={224}
          className="h-32 w-full rounded-lg border border-gray-200 bg-gray-50 object-cover"
        />
      ) : (
        <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 sm:h-28 sm:w-36">
          <FileText size={28} />
          <span className="text-xs">
            File dokumen
          </span>
        </div>
      )}

      <p
        className="mt-2 truncate text-xs text-gray-500"
        title={media.fileName}
      >
        {media.fileName}
      </p>
    </div>
  );
}

function EventCard({
  event,
  onEdit,
  onArchive,
  busyEventId,
}: {
  event: EventData;
  onEdit: (event: EventData) => void;
  onArchive: (id: string) => void;
  busyEventId: string | null;
}) {
  const isBusy = busyEventId === event.id;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <MediaPreview media={event.media} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={event.status} />
          </div>

          <h3 className="mt-2 text-base font-semibold text-gray-900 sm:text-lg">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
            {event.description}
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <CalendarDays
                size={16}
                className="mt-0.5 shrink-0 text-orange-600"
              />

              <span>
                {formatDate(event.startAt)}
              </span>
            </div>

            {event.endAt && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock3
                  size={16}
                  className="mt-0.5 shrink-0 text-orange-600"
                />

                <span>
                  Sampai {formatDate(event.endAt)}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-orange-600"
                />

                <span>
                  {event.location}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(event)}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={15} />
              Edit Agenda
            </button>

            <button
              type="button"
              onClick={() => onArchive(event.id)}
              disabled={busyEventId !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Archive size={15} />

              {isBusy
                ? "Mengarsipkan..."
                : "Archive"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventTable({
  title,
  description,
  events,
  emptyMessage,
  onEdit,
  onPublish,
  onArchive,
  busyEventId,
}: {
  title: string;
  description: string;
  events: EventData[];
  emptyMessage: string;
  onEdit: (event: EventData) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  busyEventId: string | null;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {events.length} agenda
          </span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <CalendarDays size={21} />
          </div>

          <p className="mt-3 text-sm font-medium text-gray-700">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">
                  Agenda
                </th>

                <th className="px-5 py-3 font-semibold">
                  Jadwal
                </th>

                <th className="px-5 py-3 font-semibold">
                  Lokasi
                </th>

                <th className="px-5 py-3 font-semibold">
                  Status
                </th>

                <th className="px-5 py-3 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {events.map((event) => {
                const isBusy =
                  busyEventId === event.id;

                return (
                  <tr
                    key={event.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate font-medium text-gray-900">
                        {event.title}
                      </p>

                      <p
                        className="mt-1 truncate text-xs text-gray-500"
                        title={
                          event.media?.fileName ?? ""
                        }
                      >
                        {event.media?.fileName ??
                          "Belum ada media"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      <p>
                        {formatDateShort(event.startAt)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(event.startAt)}
                      </p>
                    </td>

                    <td className="max-w-45 px-5 py-4 text-gray-600">
                      <span className="block truncate">
                        {event.location ||
                          "Belum ditentukan"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={event.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(event)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        {event.status === "DRAFT" && (
                          <button
                            type="button"
                            onClick={() =>
                              onPublish(event.id)
                            }
                            disabled={
                              busyEventId !== null
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Send size={14} />

                            {isBusy
                              ? "Memproses..."
                              : "Publish"}
                          </button>
                        )}

                        {event.status !==
                          "ARCHIVED" && (
                          <button
                            type="button"
                            onClick={() =>
                              onArchive(event.id)
                            }
                            disabled={
                              busyEventId !== null
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Archive size={14} />

                            {isBusy
                              ? "Memproses..."
                              : "Archive"}
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
      )}
    </section>
  );
}

export default function EventManager({
  events,
}: EventManagerProps) {
  const router = useRouter();

  const [showForm, setShowForm] =
    useState(false);

  const [editingEvent, setEditingEvent] =
    useState<EventData | undefined>(
      undefined,
    );

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success",
    );

  const [busyEventId, setBusyEventId] =
    useState<string | null>(null);

  const publishedEvents = events.filter(
    (event) =>
      event.status === "PUBLISHED",
  );

  const draftEvents = events.filter(
    (event) => event.status === "DRAFT",
  );

  const archivedEvents = events.filter(
    (event) =>
      event.status === "ARCHIVED",
  );

  function handleAdd() {
    setEditingEvent(undefined);
    setShowForm(true);
    setMessage("");
  }

  function handleEdit(event: EventData) {
    setEditingEvent(event);
    setShowForm(true);
    setMessage("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingEvent(undefined);
    setMessage("");
    router.refresh();
  }

  async function handlePublish(
    id: string,
  ) {
    if (busyEventId) return;

    setBusyEventId(id);
    setMessage("");

    try {
      const result =
        await publishEvent(id);

      if ("error" in result) {
        setMessageType("error");
        setMessage(
          result.error.message,
        );
        return;
      }

      setMessageType("success");
      setMessage(
        "Agenda berhasil dipublikasikan.",
      );

      router.refresh();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memublikasikan agenda.",
      );
    } finally {
      setBusyEventId(null);
    }
  }

  async function handleArchive(
    id: string,
  ) {
    if (busyEventId) return;

    setBusyEventId(id);
    setMessage("");

    try {
      const result =
        await archiveEvent(id);

      if ("error" in result) {
        setMessageType("error");
        setMessage(
          result.error.message,
        );
        return;
      }

      setMessageType("success");
      setMessage(
        "Agenda berhasil diarsipkan.",
      );

      router.refresh();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengarsipkan agenda.",
      );
    } finally {
      setBusyEventId(null);
    }
  }

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
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <Archive
              size={18}
              className="mt-0.5 shrink-0"
            />
          )}

          <p>{message}</p>
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
              {editingEvent
                ? "Edit Agenda"
                : "Tambah Agenda"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Lengkapi informasi kegiatan
              pada formulir berikut.
            </p>
          </div>

          <EventForm
            key={
              editingEvent?.id ?? "new"
            }
            event={editingEvent}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Agenda Kegiatan
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Kelola jadwal dan publikasi
                kegiatan SBW.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus size={18} />
              Tambah Agenda
            </button>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  Published
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                  <CheckCircle2 size={19} />
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {publishedEvents.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Agenda yang telah diterbitkan
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  Draft
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <FileText size={19} />
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {draftEvents.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Agenda yang belum diterbitkan
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  Archived
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <Archive size={19} />
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {archivedEvents.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Agenda yang telah diarsipkan
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Agenda Terbit
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Agenda yang sudah dipublikasikan.
              </p>
            </div>

            {publishedEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
                <CalendarDays
                  size={28}
                  className="mx-auto text-gray-400"
                />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  Belum ada agenda yang diterbitkan.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Agenda yang sudah dipublikasikan
                  akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {publishedEvents.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEdit}
                      onArchive={handleArchive}
                      busyEventId={busyEventId}
                    />
                  ),
                )}
              </div>
            )}
          </section>

          <EventTable
            title="Draft"
            description="Agenda yang masih dalam tahap penyusunan."
            events={draftEvents}
            emptyMessage="Tidak ada agenda draft."
            onEdit={handleEdit}
            onPublish={handlePublish}
            onArchive={handleArchive}
            busyEventId={busyEventId}
          />

          <EventTable
            title="Archived"
            description="Agenda yang sudah diarsipkan."
            events={archivedEvents}
            emptyMessage="Belum ada agenda yang diarsipkan."
            onEdit={handleEdit}
            onPublish={handlePublish}
            onArchive={handleArchive}
            busyEventId={busyEventId}
          />
        </>
      )}
    </div>
  );
}