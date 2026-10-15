"use client";

import { useState } from "react";
import {
  archiveNews,
  createNews,
  publishNews,
  updateNews,
} from "@/actions/news.actions";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  AlertCircle,
  Archive,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe,
  Image as ImageIcon,
  LoaderCircle,
  Save,
  Send,
  Tag,
  X,
} from "lucide-react";

type NewsMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: bigint;
  altText: string | null;
};

type NewsData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: string | Date | null;
  category: string | null;
  mediaId: string | null;
  media: NewsMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle: string | null;
  metaDescription: string | null;
};

type NewsFormProps = {
  news?: NewsData;
  onCancel: () => void;
};

function formatDateTimeLocal(
  value: string | Date | null | undefined,
) {
  if (!value) return "";

  const date =
    value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700";

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4 pl-0 sm:pl-13">
        {children}
      </div>
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status: NewsData["status"];
}) {
  const config = {
    DRAFT: {
      label: "Draft",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    PUBLISHED: {
      label: "Published",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ARCHIVED: {
      label: "Archived",
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function NewsForm({
  news,
  onCancel,
}: NewsFormProps) {
  const isEditMode = Boolean(news);

  const [title, setTitle] = useState(news?.title ?? "");
  const [slug, setSlug] = useState(news?.slug ?? "");
  const [excerpt, setExcerpt] = useState(news?.excerpt ?? "");
  const [content, setContent] = useState(news?.content ?? "");

  const [publishedAt, setPublishedAt] = useState(
    formatDateTimeLocal(news?.publishedAt),
  );

  const [category, setCategory] = useState(
    news?.category ?? "",
  );

  const [mediaId, setMediaId] = useState(
    news?.mediaId ?? "",
  );

  const [metaTitle, setMetaTitle] = useState(
    news?.metaTitle ?? "",
  );

  const [metaDescription, setMetaDescription] = useState(
    news?.metaDescription ?? "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSaveDraft(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const input = {
        title,
        slug,
        excerpt,
        content,
        publishedAt: publishedAt
          ? new Date(publishedAt)
          : null,
        category,
        mediaId,
        metaTitle,
        metaDescription,
      };

      let result;

      if (news) {
        result = await updateNews(news.id, {
          ...input,
          status: "DRAFT",
        });
      } else {
        result = await createNews(input);
      }

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess(
        isEditMode
          ? "Berita berhasil diperbarui."
          : "Berita berhasil dibuat sebagai Draft.",
      );

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan berita.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!news) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await publishNews(news.id);

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess("Berita berhasil diterbitkan.");
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menerbitkan berita.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!news) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await archiveNews(news.id);

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess("Berita berhasil diarsipkan.");
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengarsipkan berita.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header form */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FileText size={23} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEditMode ? "Edit Berita" : "Tambah Berita"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Perbarui informasi dan konten berita."
                : "Lengkapi informasi untuk membuat berita baru."}
            </p>
          </div>
        </div>

        {news && <StatusBadge status={news.status} />}
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Gagal memproses berita</p>
            <p className="mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Tutup pesan error"
            className="rounded p-1 hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSaveDraft} className="space-y-7">
        {/* Informasi utama */}
        <FormSection
          icon={<FileText size={21} />}
          title="Informasi Berita"
          description="Judul, alamat URL, kategori, dan ringkasan berita."
        >
          <div>
            <label htmlFor="news-title" className={labelClassName}>
              Judul Berita <span className="text-red-500">*</span>
            </label>
            <input
              id="news-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              placeholder="Masukkan judul berita"
              className={inputClassName}
              required
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Maksimal 200 karakter.
            </p>
          </div>

          <div>
            <label htmlFor="news-slug" className={labelClassName}>
              Slug URL <span className="text-red-500">*</span>
            </label>
            <input
              id="news-slug"
              type="text"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              maxLength={220}
              placeholder="contoh-judul-berita"
              className={inputClassName}
              required
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Digunakan sebagai bagian URL berita. Pastikan nilainya unik.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="news-category"
                className={labelClassName}
              >
                Kategori
              </label>
              <div className="relative">
                <Tag
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="news-category"
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  maxLength={100}
                  placeholder="Contoh: Kegiatan"
                  className={`${inputClassName} pl-9`}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="news-published-at"
                className={labelClassName}
              >
                Tanggal Publikasi
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="news-published-at"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(event) =>
                    setPublishedAt(event.target.value)
                  }
                  className={`${inputClassName} pl-9`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="news-excerpt"
              className={labelClassName}
            >
              Ringkasan Berita
            </label>
            <textarea
              id="news-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              placeholder="Tuliskan ringkasan singkat untuk membantu pembaca memahami isi berita."
              className={`${inputClassName} resize-y`}
              disabled={isSubmitting}
            />
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        {/* Isi berita */}
        <FormSection
          icon={<FileText size={21} />}
          title="Konten Berita"
          description="Tuliskan isi lengkap berita yang akan dikelola."
        >
          <div>
            <label
              htmlFor="news-content"
              className={labelClassName}
            >
              Isi Berita <span className="text-red-500">*</span>
            </label>
            <textarea
              id="news-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              placeholder="Tuliskan isi berita secara lengkap..."
              className={`${inputClassName} min-h-60 resize-y leading-6`}
              required
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Periksa kembali isi berita sebelum disimpan atau diterbitkan.
            </p>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        {/* Media */}
        <FormSection
          icon={<ImageIcon size={21} />}
          title="Media Berita"
          description="Pilih gambar atau media pendukung dari pustaka media."
        >
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <MediaPicker
              value={mediaId || undefined}
              selectedMedia={
                news?.media
                  ? {
                      ...news.media,
                      fileSize: news.media.fileSize.toString(),
                    }
                  : null
              }
              onChange={(selectedMediaId) =>
                setMediaId(selectedMediaId ?? "")
              }
            />
            <p className="mt-3 text-xs leading-5 text-gray-500">
              Media bersifat opsional jika validasi server mengizinkannya.
              Pastikan media yang dipilih sesuai dengan isi berita.
            </p>
          </div>
        </FormSection>

        <div className="border-t border-gray-100" />

        {/* SEO */}
        <FormSection
          icon={<Globe size={21} />}
          title="Pengaturan SEO"
          description="Metadata tambahan untuk membantu mesin pencari memahami berita."
        >
          <div>
            <label
              htmlFor="news-meta-title"
              className={labelClassName}
            >
              Meta Title
            </label>
            <input
              id="news-meta-title"
              type="text"
              value={metaTitle}
              onChange={(event) =>
                setMetaTitle(event.target.value)
              }
              maxLength={200}
              placeholder="Judul untuk mesin pencari (opsional)"
              className={inputClassName}
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Maksimal 200 karakter.
            </p>
          </div>

          <div>
            <label
              htmlFor="news-meta-description"
              className={labelClassName}
            >
              Meta Description
            </label>
            <textarea
              id="news-meta-description"
              value={metaDescription}
              onChange={(event) =>
                setMetaDescription(event.target.value)
              }
              rows={3}
              placeholder="Deskripsi singkat untuk mesin pencari (opsional)"
              className={`${inputClassName} resize-y`}
              disabled={isSubmitting}
            />
          </div>
        </FormSection>

        {/* Tombol aksi */}
        <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              Batal
            </button>

            <div className="flex flex-col gap-2 sm:flex-row">
              {news && news.status !== "ARCHIVED" && (
                <button
                  type="button"
                  onClick={handleArchive}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Archive size={16} />
                  )}
                  Archive
                </button>
              )}

              {news && news.status === "DRAFT" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Publish
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSubmitting ? "Memproses..." : "Simpan Draft"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}