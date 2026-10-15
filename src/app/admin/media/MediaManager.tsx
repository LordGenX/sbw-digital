"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { deleteMedia } from "@/actions/media.actions";
import MediaForm from "./MediaForm";

type MediaItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
  createdAt: Date | string;
};

type MediaManagerProps = {
  media: MediaItem[];
};

type Notice = {
  type: "success" | "error";
  text: string;
};

function formatFileSize(size: string): string {
  const bytes = Number(size);

  if (!Number.isFinite(bytes) || bytes < 0) {
    return "-";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function NoticeBanner({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const isError = notice.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {isError ? (
        <AlertCircle size={19} className="mt-0.5 shrink-0" />
      ) : (
        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
      )}

      <p className="min-w-0 flex-1 leading-5">{notice.text}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded-md p-0.5 opacity-70 transition hover:opacity-100"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function MediaPreview({
  item,
  compact = false,
}: {
  item: MediaItem;
  compact?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = isImage(item.mimeType) && !imageFailed;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 ${
        compact ? "size-12" : "h-20 w-28"
      }`}
    >
      {showImage ? (
        <Image
          src={item.fileUrl}
          alt={item.altText || item.fileName}
          fill
          sizes={compact ? "48px" : "112px"}
          unoptimized
          onError={() => setImageFailed(true)}
          className="object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
          {isImage(item.mimeType) ? (
            <ImageIcon size={compact ? 20 : 25} />
          ) : (
            <FileText size={compact ? 20 : 25} />
          )}

          {!compact && (
            <span className="text-[10px] font-medium">
              {isImage(item.mimeType) ? "Preview gagal" : "File"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function MediaManager({
  media,
}: MediaManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(media);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(
    null,
  );

  function handleUploadSuccess() {
    setShowForm(false);
    window.location.reload();
  }

  async function handleDelete() {
    if (!pendingDelete || isDeleting) {
      return;
    }

    const item = pendingDelete;

    setIsDeleting(item.id);
    setNotice(null);

    try {
      const result = await deleteMedia(item.id);

      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error.message,
        });
        return;
      }

      setItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );

      setPendingDelete(null);
      setNotice({
        type: "success",
        text: `Media "${item.fileName}" berhasil dihapus.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus media.",
      });
    } finally {
      setIsDeleting(null);
    }
  }

  const totalSize = items.reduce((total, item) => {
    const size = Number(item.fileSize);
    return total + (Number.isFinite(size) && size > 0 ? size : 0);
  }, 0);

  const imageCount = items.filter((item) =>
    isImage(item.mimeType),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FileImage size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Media Library
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-gray-500">
              Kelola gambar yang digunakan pada konten website SBW.
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              setShowForm(true);
            }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Plus size={18} />
            Upload Media
          </button>
        )}
      </section>

      {/* Notifications */}
      {notice && (
        <NoticeBanner
          notice={notice}
          onDismiss={() => setNotice(null)}
        />
      )}

      {/* Upload form */}
      {showForm && (
        <MediaForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <FileImage size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Media</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900">
                {items.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ImageIcon size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">File Gambar</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900">
                {imageCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <Upload size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Ukuran</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900">
                {formatFileSize(String(totalSize))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 sm:px-6">
          <h3 className="font-semibold text-gray-900">
            Daftar Media
          </h3>
          <p className="text-sm text-gray-500">
            Media diurutkan berdasarkan waktu unggah terbaru.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FileImage size={27} />
            </div>

            <h4 className="mt-4 font-semibold text-gray-800">
              Belum ada media
            </h4>

            <p className="mt-1 max-w-sm text-sm leading-5 text-gray-500">
              Unggah gambar pertama untuk mulai menggunakannya pada konten
              website.
            </p>

            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
              >
                <Plus size={17} />
                Upload Media
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold sm:px-6">
                    Preview
                  </th>
                  <th className="px-5 py-3.5 font-semibold">
                    Nama File
                  </th>
                  <th className="px-5 py-3.5 font-semibold">
                    Ukuran
                  </th>
                  <th className="px-5 py-3.5 font-semibold">
                    Alt Text
                  </th>
                  <th className="px-5 py-3.5 font-semibold">
                    Tanggal Upload
                  </th>
                  <th className="px-5 py-3.5 text-right font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <MediaPreview item={item} />
                    </td>

                    <td className="max-w-64 px-5 py-3.5">
                      <p
                        className="truncate font-semibold text-gray-800"
                        title={item.fileName}
                      >
                        {item.fileName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.mimeType}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">
                      {formatFileSize(item.fileSize)}
                    </td>

                    <td className="max-w-48 px-5 py-3.5">
                      <p
                        className="truncate text-gray-600"
                        title={item.altText || ""}
                      >
                        {item.altText || "-"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setNotice(null);
                          setPendingDelete(item);
                        }}
                        disabled={isDeleting !== null}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:px-6">
            <p className="text-xs text-gray-500">
              Menampilkan {items.length} media
            </p>
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isDeleting
            ) {
              setPendingDelete(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-media-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  id="delete-media-title"
                  className="font-semibold text-gray-900"
                >
                  Hapus media?
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-600">
                  Media berikut akan dihapus dari library:
                </p>

                <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <MediaPreview item={pendingDelete} compact />

                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold text-gray-800"
                      title={pendingDelete.fileName}
                    >
                      {pendingDelete.fileName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(pendingDelete.fileSize)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  Jika media masih digunakan oleh konten website,
                  server akan menolak penghapusan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting !== null}
                aria-label="Tutup konfirmasi"
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting !== null}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting !== null}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting === pendingDelete.id ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Hapus Media
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}