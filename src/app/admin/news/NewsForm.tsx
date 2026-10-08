"use client";

import { useState } from "react";

import {
  archiveNews,
  createNews,
  publishNews,
  updateNews,
} from "@/actions/news.actions";

import MediaPicker from "@/components/admin/MediaPicker";

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
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default function NewsForm({
  news,
  onCancel,
}: NewsFormProps) {
  const isEditMode = Boolean(news);

  const [title, setTitle] = useState(
    news?.title ?? "",
  );

  const [slug, setSlug] = useState(
    news?.slug ?? "",
  );

  const [excerpt, setExcerpt] = useState(
    news?.excerpt ?? "",
  );

  const [content, setContent] = useState(
    news?.content ?? "",
  );

  const [publishedAt, setPublishedAt] =
    useState(
      formatDateTimeLocal(
        news?.publishedAt,
      ),
    );

  const [category, setCategory] =
    useState(news?.category ?? "");

  const [mediaId, setMediaId] =
    useState(news?.mediaId ?? "");

  const [metaTitle, setMetaTitle] =
    useState(news?.metaTitle ?? "");

  const [metaDescription, setMetaDescription] =
    useState(
      news?.metaDescription ?? "",
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [success, setSuccess] = useState<
    string | null
  >(null);

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
          : "Terjadi kesalahan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!news) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await publishNews(
        news.id,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess(
        "Berita berhasil diterbitkan.",
      );

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!news) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await archiveNews(
        news.id,
      );

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setSuccess(
        "Berita berhasil diarsipkan.",
      );

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>
        {isEditMode
          ? "Edit Berita"
          : "Tambah Berita"}
      </h2>

      {error && (
        <p>
          Error: {error}
        </p>
      )}

      {success && (
        <p>
          {success}
        </p>
      )}

      <form
        onSubmit={handleSaveDraft}
      >
        <div>
          <label htmlFor="news-title">
            Judul
          </label>

          <input
            id="news-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="news-slug">
            Slug
          </label>

          <input
            id="news-slug"
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            maxLength={220}
            required
          />
        </div>

        <div>
          <label htmlFor="news-excerpt">
            Ringkasan
          </label>

          <textarea
            id="news-excerpt"
            value={excerpt}
            onChange={(event) =>
              setExcerpt(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="news-content">
            Konten
          </label>

          <textarea
            id="news-content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            required
            rows={10}
          />
        </div>

        <div>
          <label htmlFor="news-published-at">
            Tanggal Publikasi
          </label>

          <input
            id="news-published-at"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) =>
              setPublishedAt(
                event.target.value,
              )
            }
          />
        </div>

        <div>
          <label htmlFor="news-category">
            Kategori
          </label>

          <input
            id="news-category"
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value,
              )
            }
            maxLength={100}
          />
        </div>

        {/* Media */}
        <div>
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
              setMediaId(
                selectedMediaId ?? "",
              )
            }
          />
        </div>

        <div>
          <label htmlFor="news-meta-title">
            Meta Title
          </label>

          <input
            id="news-meta-title"
            type="text"
            value={metaTitle}
            onChange={(event) =>
              setMetaTitle(
                event.target.value,
              )
            }
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="news-meta-description">
            Meta Description
          </label>

          <textarea
            id="news-meta-description"
            value={metaDescription}
            onChange={(event) =>
              setMetaDescription(
                event.target.value,
              )
            }
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Menyimpan..."
              : "Simpan Draft"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batal
          </button>

          {news &&
            news.status === "DRAFT" && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                Publish
              </button>
            )}

          {news &&
            news.status !== "ARCHIVED" && (
              <button
                type="button"
                onClick={handleArchive}
                disabled={isSubmitting}
              >
                Archive
              </button>
            )}
        </div>
      </form>
    </section>
  );
}