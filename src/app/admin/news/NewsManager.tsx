"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Plus,
  Pencil,
  FileText,
  CalendarDays,
  Image as ImageIcon,
  Newspaper,
  Archive,
  FilePenLine,
  CheckCircle2,
  Tag,
} from "lucide-react";

import NewsForm from "./NewsForm";

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

type NewsManagerProps = {
  news: NewsData[];
};

function formatDate(date: string | Date | null) {
  if (!date) return "Belum dijadwalkan";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Tanggal tidak valid";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({
  status,
}: {
  status: NewsData["status"];
}) {
  const styles = {
    PUBLISHED:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
    ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
  };

  const labels = {
    PUBLISHED: "Published",
    DRAFT: "Draft",
    ARCHIVED: "Archived",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function MediaPreview({
  media,
}: {
  media: NewsMedia | null;
}) {
  if (!media) {
    return (
      <div className="flex h-25 w-30 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
        <ImageIcon size={22} />
        <span className="text-center text-[11px]">
          Belum ada media
        </span>
      </div>
    );
  }

  if (media.mimeType.startsWith("image/")) {
    return (
      <div className="relative h-25 w-30 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <Image
          src={media.fileUrl}
          alt={media.altText || media.fileName}
          fill
          sizes="120px"
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-25 w-30 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
      <FileText size={26} />
      <span className="max-w-26.25 truncate px-1 text-xs">
        {media.fileName}
      </span>
    </div>
  );
}

function NewsCard({
  item,
  onEdit,
}: {
  item: NewsData;
  onEdit: (item: NewsData) => void;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <MediaPreview media={item.media} />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />

            {item.category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                <Tag size={12} />
                {item.category}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {item.title}
          </h3>

          {item.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
              {item.excerpt}
            </p>
          )}

          <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              <span>
                {item.publishedAt
                  ? `Publikasi: ${formatDate(item.publishedAt)}`
                  : "Belum memiliki tanggal publikasi"}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-1.5">
              <ImageIcon size={14} className="shrink-0" />
              <span className="truncate">
                {item.media?.fileName ?? "Belum ada media"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-50"
            >
              <Pencil size={15} />
              Edit Berita
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function NewsTable({
  items,
  onEdit,
}: {
  items: NewsData[];
  onEdit: (item: NewsData) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
        <FileText
          size={28}
          className="mx-auto mb-2 text-gray-300"
        />
        <p className="text-sm text-gray-500">
          Belum ada berita pada bagian ini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-150 text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">
              Berita
            </th>
            <th className="px-4 py-3 font-medium text-gray-600">
              Kategori
            </th>
            <th className="px-4 py-3 font-medium text-gray-600">
              Terakhir dijadwalkan
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className="transition-colors hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {item.media?.mimeType.startsWith("image/") ? (
                    <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      <Image
                        src={item.media.fileUrl}
                        alt={
                          item.media.altText ||
                          item.media.fileName
                        }
                        fill
                        sizes="56px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                      <FileText size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="mt-1 max-w-65 truncate text-xs text-gray-500">
                      {item.media?.fileName ?? "Belum ada media"}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-gray-600">
                {item.category || "—"}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {formatDate(item.publishedAt)}
              </td>

              <td className="px-4 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  aria-label={`Edit berita ${item.title}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-orange-700 transition-colors hover:bg-orange-50"
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
  );
}

export default function NewsManager({
  news,
}: NewsManagerProps) {
  const [editingNews, setEditingNews] =
    useState<NewsData | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  const showForm = isCreating || editingNews !== null;

  const publishedNews = news.filter(
    (item) => item.status === "PUBLISHED",
  );

  const draftNews = news.filter(
    (item) => item.status === "DRAFT",
  );

  const archivedNews = news.filter(
    (item) => item.status === "ARCHIVED",
  );

  function handleCreate() {
    setEditingNews(null);
    setIsCreating(true);
  }

  function handleEdit(item: NewsData) {
    setIsCreating(false);
    setEditingNews(item);
  }

  function handleCancel() {
    setEditingNews(null);
    setIsCreating(false);
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Manajemen Berita
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola berita dan publikasi SBW Digital.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus size={18} />
              Tambah Berita
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Published
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {publishedNews.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Berita telah diterbitkan
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Draft</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {draftNews.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Berita belum diterbitkan
                  </p>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                  <FilePenLine size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Archived
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {archivedNews.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Berita yang diarsipkan
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3 text-gray-500">
                  <Archive size={22} />
                </div>
              </div>
            </div>
          </div>

          {news.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <Newspaper size={24} />
              </div>

              <h2 className="font-semibold text-gray-900">
                Belum ada berita
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                Mulai tambahkan berita untuk ditampilkan di
                pengelolaan publikasi SBW Digital.
              </p>

              <button
                type="button"
                onClick={handleCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                <Plus size={17} />
                Tambah Berita Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Berita Terbit
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Berita yang sudah dipublikasikan.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {publishedNews.length} berita
                  </span>
                </div>

                {publishedNews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-7 text-center">
                    <Newspaper
                      size={26}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="text-sm text-gray-500">
                      Belum ada berita yang diterbitkan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {publishedNews.map((item) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Draft
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Berita yang masih dalam proses penyuntingan.
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {draftNews.length} berita
                  </span>
                </div>

                <NewsTable
                  items={draftNews}
                  onEdit={handleEdit}
                />
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Archived
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Berita yang sudah diarsipkan.
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {archivedNews.length} berita
                  </span>
                </div>

                <NewsTable
                  items={archivedNews}
                  onEdit={handleEdit}
                />
              </section>
            </div>
          )}
        </>
      )}

      {showForm && (
        <section className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-5 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingNews ? "Edit Berita" : "Tambah Berita"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {editingNews
                  ? "Perbarui informasi berita yang dipilih."
                  : "Isi informasi untuk membuat berita baru."}
              </p>
            </div>

            <NewsForm
              key={editingNews?.id ?? "new"}
              news={editingNews ?? undefined}
              onCancel={handleCancel}
            />
          </div>
        </section>
      )}
    </div>
  );
}