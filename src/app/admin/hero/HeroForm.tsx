"use client";

import { useState } from "react";
import {
  ImageIcon,
  Video,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  LoaderCircle,
  Settings2,
} from "lucide-react";

import {
  saveHeroSection,
  updateHeroSection,
} from "@/actions/hero.actions";

type HeroData = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  ctaText: string | null;
  ctaUrl: string | null;
  isActive: boolean;
};

type HeroFormProps = {
  hero?: HeroData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-medium text-gray-700";

function FormSection({
  title,
  description,
  children,
}: {
  icon: typeof ImageIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <ImageIcon size={20} />
        </span>

        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function HeroForm({
  hero,
  onCancel,
  onSuccess,
}: HeroFormProps) {
  const isEditMode = Boolean(hero);

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    setIsPending(true);
    setMessage("");
    setIsSuccess(false);

    const formData = new FormData(form);

    const input = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      videoUrl: String(formData.get("videoUrl") ?? ""),
      videoId: String(formData.get("videoId") ?? ""),
      ctaText: String(formData.get("ctaText") ?? "") || undefined,
      ctaUrl: String(formData.get("ctaUrl") ?? "") || undefined,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const result = hero
        ? await updateHeroSection(hero.id, input)
        : await saveHeroSection(input);

      if (!result.success) {
        setMessage(result.error.message);
        return;
      }

      setIsSuccess(true);
      setMessage(
        hero
          ? "Hero berhasil diperbarui."
          : "Hero berhasil disimpan.",
      );

      onSuccess?.();
    } catch {
      setMessage("Terjadi kesalahan saat menyimpan data Hero.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex items-center gap-3 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:px-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <ImageIcon size={25} />
          </span>

          <div>
            <h2 className="text-lg font-bold">
              {isEditMode ? "Edit Hero" : "Tambah Hero"}
            </h2>
            <p className="mt-1 text-sm text-orange-50">
              Kelola banner utama website SBW Digital.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
          <Settings2
            size={19}
            className="mt-0.5 shrink-0 text-orange-600"
          />
          <p className="text-sm leading-6 text-gray-600">
            Atur judul, deskripsi, video latar, serta tombol ajakan
            bertindak yang ditampilkan pada halaman utama.
          </p>
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role={isSuccess ? "status" : "alert"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            isSuccess
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{message}</p>
        </div>
      )}

      {/* Main content */}
      <FormSection
        icon={ImageIcon}
        title="Konten Hero"
        description="Informasi utama yang dilihat pengunjung."
      >
        <div>
          <label htmlFor="title" className={labelClassName}>
            Judul Hero <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={hero?.title ?? ""}
            className={inputClassName}
            disabled={isPending}
            placeholder="Masukkan judul hero"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Maksimal 200 karakter.
          </p>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={hero?.description ?? ""}
            className={`${inputClassName} resize-y`}
            disabled={isPending}
            placeholder="Tuliskan deskripsi singkat..."
          />
        </div>
      </FormSection>

      {/* Video */}
      <FormSection
        icon={Video}
        title="Video Latar"
        description="Konfigurasi sumber video untuk Hero."
      >
        <div>
          <label htmlFor="videoUrl" className={labelClassName}>
            Video URL <span className="text-red-500">*</span>
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            required
            defaultValue={hero?.videoUrl ?? ""}
            className={inputClassName}
            disabled={isPending}
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="videoId" className={labelClassName}>
            Video ID <span className="text-red-500">*</span>
          </label>
          <input
            id="videoId"
            name="videoId"
            type="text"
            required
            maxLength={50}
            defaultValue={hero?.videoId ?? ""}
            className={inputClassName}
            disabled={isPending}
            placeholder="Masukkan ID video"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Gunakan ID video yang sesuai dengan sumber video.
          </p>
        </div>
      </FormSection>

      {/* CTA */}
      <FormSection
        icon={MousePointerClick}
        title="Tombol CTA"
        description="Opsional: tombol ajakan bertindak pada Hero."
      >
        <div>
          <label htmlFor="ctaText" className={labelClassName}>
            Teks Tombol
          </label>
          <input
            id="ctaText"
            name="ctaText"
            type="text"
            maxLength={100}
            defaultValue={hero?.ctaText ?? ""}
            className={inputClassName}
            disabled={isPending}
            placeholder="Contoh: Pelajari Selengkapnya"
          />
        </div>

        <div>
          <label htmlFor="ctaUrl" className={labelClassName}>
            URL Tujuan
          </label>
          <input
            id="ctaUrl"
            name="ctaUrl"
            type="url"
            defaultValue={hero?.ctaUrl ?? ""}
            className={inputClassName}
            disabled={isPending}
            placeholder="https://..."
          />
        </div>
      </FormSection>

      {/* Status */}
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              Status Hero
            </p>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Aktifkan jika Hero ini ingin ditampilkan sesuai aturan
              publikasi website.
            </p>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 self-start sm:self-center">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={hero?.isActive ?? false}
            disabled={isPending}
            className="size-4 accent-orange-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Aktifkan Hero
          </span>
        </label>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white/95 px-1 py-4 backdrop-blur sm:flex-row sm:justify-end">
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
            Batal
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save size={17} />
              {isEditMode ? "Simpan Perubahan" : "Simpan Hero"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}