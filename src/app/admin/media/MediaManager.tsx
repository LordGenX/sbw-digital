"use client";

import Image from "next/image";
import { useState } from "react";
import MediaForm from "./MediaForm";
import { deleteMedia } from "@/actions/media.actions";

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

function formatFileSize(size: string): string {
  const bytes = Number(size);

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MediaManager({
  media,
}: MediaManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(media);
  const [isDeleting, setIsDeleting] = useState<string | null>(
    null,
  );

  function handleUploadSuccess() {
    setShowForm(false);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus media ini?",
    );

    if (!confirmed) {
      return;
    }

    if (isDeleting) {
      return;
    }

    setIsDeleting(id);

    try {
      const result = await deleteMedia(id);

      if ("error" in result) {
        window.alert(result.error.message);
        return;
      }

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== id),
      );

      window.alert("Media berhasil dihapus.");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus media.",
      );
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          + Upload Media
        </button>
      )}

      {showForm && (
        <MediaForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Daftar Media
        </h2>

        {items.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
            Belum ada media.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 font-medium">
                    Preview
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Nama File
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Tipe
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Ukuran
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Alt Text
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <Image
                        src={item.fileUrl}
                        alt={item.altText ?? item.fileName}
                        width={96}
                        height={64}
                        className="h-16 w-24 rounded object-cover"
                      />
                    </td>

                    <td className="px-4 py-3">
                      {item.fileName}
                    </td>

                    <td className="px-4 py-3">
                      {item.mimeType}
                    </td>

                    <td className="px-4 py-3">
                      {formatFileSize(item.fileSize)}
                    </td>

                    <td className="px-4 py-3">
                      {item.altText || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="rounded-md border px-3 py-1.5 text-sm text-red-600 disabled:opacity-50"
                      >
                        {isDeleting === item.id
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}