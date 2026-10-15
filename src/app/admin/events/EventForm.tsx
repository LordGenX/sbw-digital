"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  MapPin,
  Save,
} from "lucide-react";

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

function toDateTimeLocal(
  value: Date | string | null | undefined,
): string {
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

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

const labelClassName =
  "mb-2 block text-sm font-medium text-gray-700";

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
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
  const [location, setLocation] = useState(event?.location ?? "");
  const [startAt, setStartAt] = useState(
    event ? toDateTimeLocal(event.startAt) : "",
  );
  const [endAt, setEndAt] = useState(
    event?.endAt ? toDateTimeLocal(event.endAt) : "",
  );
  const [mediaId, setMediaId] = useState(event?.mediaId ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    formEvent: FormEvent<HTMLFormElement>,
  ) {
    formEvent.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");

    if (endAt && new Date(endAt) < new Date(startAt)) {
      setErrorMessage(
        "Waktu selesai tidak boleh lebih awal daripada waktu mulai.",
      );
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
        setErrorMessage(result.error.message);
        return;
      }

      // Tidak menampilkan popup setelah berhasil.
      // onCancel mengembalikan admin ke daftar agenda.
      onCancel();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan agenda.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Informasi utama */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionHeader
            icon={<FileText size={20} />}
            title="Informasi Agenda"
            description="Masukkan judul, alamat URL, dan deskripsi kegiatan."
          />

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="event-title"
                className={labelClassName}
              >
                Judul Agenda <span className="text-red-500">*</span>
              </label>

              <input
                id="event-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className={inputClassName}
                placeholder="Contoh: Rapat Anggota Tahunan"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                {title.length}/200 karakter
              </p>
            </div>

            <div>
              <label
                htmlFor="event-slug"
                className={labelClassName}
              >
                Slug URL <span className="text-red-500">*</span>
              </label>

              <input
                id="event-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                maxLength={220}
                required
                className={inputClassName}
                placeholder="rapat-anggota-tahunan"
              />

              <p className="mt-1.5 text-xs text-gray-500">
                Gunakan huruf kecil, angka, dan tanda hubung.
              </p>
            </div>

            <div>
              <label
                htmlFor="event-description"
                className={labelClassName}
              >
                Deskripsi <span className="text-red-500">*</span>
              </label>

              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                className={`${inputClassName} resize-y leading-6`}
                placeholder="Jelaskan tujuan, rangkaian, dan informasi kegiatan..."
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Gunakan deskripsi yang jelas agar informasi agenda mudah
                dipahami pengunjung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jadwal dan lokasi */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionHeader
            icon={<CalendarDays size={20} />}
            title="Jadwal dan Lokasi"
            description="Atur waktu pelaksanaan serta tempat kegiatan."
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="event-start-at"
                className={labelClassName}
              >
                Waktu Mulai <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="event-start-at"
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  required
                  className={`${inputClassName} pl-10`}
                />
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Tanggal dan jam dimulainya kegiatan.
              </p>
            </div>

            <div>
              <label
                htmlFor="event-end-at"
                className={labelClassName}
              >
                Waktu Selesai
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="event-end-at"
                  type="datetime-local"
                  value={endAt}
                  min={startAt || undefined}
                  onChange={(e) => setEndAt(e.target.value)}
                  className={`${inputClassName} pl-10`}
                />
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Opsional jika waktu selesai belum ditentukan.
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="event-location"
                className={labelClassName}
              >
                Lokasi Kegiatan
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="event-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={255}
                  className={`${inputClassName} pl-10`}
                  placeholder="Contoh: Aula SBW Malang"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <SectionHeader
            icon={<FileText size={20} />}
            title="Media Agenda"
            description="Pilih gambar atau media pendukung melalui pustaka media."
          />

          <div className="mt-5">
            <MediaPicker
              value={mediaId || undefined}
              selectedMedia={event?.media ?? null}
              onChange={(selectedMediaId) =>
                setMediaId(selectedMediaId ?? "")
              }
            />
          </div>
        </div>
      </section>

      {/* Pesan error */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Status dan tombol aksi */}
      <section className="overflow-hidden rounded-xl border border-orange-100 bg-orange-50/70">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-700 shadow-sm">
            <Info size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Agenda disimpan sebagai Draft
            </p>

            <p className="mt-1 text-sm leading-5 text-gray-600">
              Setelah disimpan, kamu dapat memeriksa agenda lalu
              menerbitkannya melalui tombol Publish pada daftar agenda.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-orange-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Menyimpan...
              </>
            ) : (
              <>
                {event ? (
                  <Save size={17} />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                {event ? "Simpan Perubahan" : "Simpan Draft"}
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}