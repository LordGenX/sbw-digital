"use client";

import { FormEvent, useState } from "react";
import { createEvent, updateEvent } from "@/actions/event.actions";
import MediaPicker from "@/components/admin/MediaPicker";

type EventMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type EventFormEvent = {
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

type EventFormProps = {
  event?: EventFormEvent;
  onCancel: () => void;
};

function toDateTimeLocal(value: Date | string | null | undefined): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export default function EventForm({
  event,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [description, setDescription] = useState(
    event?.description ?? "",
  );
  const [location, setLocation] = useState(
    event?.location ?? "",
  );
  const [startAt, setStartAt] = useState(
    event ? toDateTimeLocal(event.startAt) : "",
  );
  const [endAt, setEndAt] = useState(
    event?.endAt ? toDateTimeLocal(event.endAt) : "",
  );
  const [mediaId, setMediaId] = useState(
    event?.mediaId ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const input = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        location: location.trim(),
        startAt,
        endAt: endAt || null,
        mediaId: mediaId.trim(),
        status: "DRAFT" as const,
      };

      let result;

      if (event) {
        result = await updateEvent(event.id, input);
      } else {
        result = await createEvent(input);
      }

      if ("error" in result) {
        window.alert(result.error.message);
        return;
      }

      window.alert(
        event
          ? "Agenda berhasil diperbarui."
          : "Agenda berhasil dibuat.",
      );

      onCancel();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan agenda.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">
          {event ? "Edit Agenda" : "Tambah Agenda"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Agenda akan disimpan sebagai draft.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="event-title"
          className="block text-sm font-medium"
        >
          Judul
        </label>

        <input
          id="event-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="Judul agenda"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="event-slug"
          className="block text-sm font-medium"
        >
          Slug
        </label>

        <input
          id="event-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          maxLength={220}
          required
          className="w-full rounded-md border px-3 py-2"
          placeholder="contoh-agenda-sbw"
        />

        <p className="text-xs text-gray-500">
          Gunakan huruf kecil, angka, dan tanda hubung.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="event-description"
          className="block text-sm font-medium"
        >
          Deskripsi
        </label>

        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Deskripsi agenda"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="event-location"
          className="block text-sm font-medium"
        >
          Lokasi
        </label>

        <input
          id="event-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={255}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Lokasi agenda"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="event-start-at"
            className="block text-sm font-medium"
          >
            Mulai
          </label>

          <input
            id="event-start-at"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="event-end-at"
            className="block text-sm font-medium"
          >
            Selesai
          </label>

          <input
            id="event-end-at"
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <MediaPicker
          value={mediaId || undefined}
          selectedMedia={event?.media ?? null}
          onChange={(selectedMediaId) =>
            setMediaId(selectedMediaId ?? "")
          }
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : event
              ? "Simpan Perubahan"
              : "Simpan Draft"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2 disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}