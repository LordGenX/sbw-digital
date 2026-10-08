"use client";

import Image from "next/image";
import { useState } from "react";
import { getMedia } from "@/actions/media.actions";

type MediaItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type MediaPickerProps = {
  value?: string;
  selectedMedia?: MediaItem | null;
  onChange: (mediaId: string | null) => void;
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

export default function MediaPicker({
  value,
  selectedMedia: initialSelectedMediaProp,
  onChange,
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialSelectedMedia, setInitialSelectedMedia] = useState(initialSelectedMediaProp);

  async function handleOpen() {
    setIsOpen(true);
    setIsLoading(true);

    try {
      const result = await getMedia();

      if ("error" in result) {
        window.alert(result.error.message);
        return;
      }

      setMedia(result.data);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat media.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(mediaId: string) {
    onChange(mediaId);
    setIsOpen(false);
  }

  function handleClear() {
    setInitialSelectedMedia(null);
    onChange(null);
  }

  const selectedMedia = media.find((item) => item.id === value) ?? initialSelectedMedia ?? null;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium">
          Media
        </label>

        <p className="mt-1 text-xs text-gray-500">
          Pilih gambar dari media yang sudah diupload.
        </p>
      </div>

      {selectedMedia ? (
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <Image
            src={selectedMedia.fileUrl}
            alt={
              selectedMedia.altText ??
              selectedMedia.fileName
            }
            width={120}
            height={80}
            className="h-20 w-30 rounded object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {selectedMedia.fileName}
            </p>

            <p className="text-xs text-gray-500">
              {formatFileSize(selectedMedia.fileSize)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpen}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Ganti Media
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border px-3 py-2 text-sm text-red-600"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-md border px-4 py-2 text-sm"
        >
          + Pilih Media
        </button>
      )}

      {isOpen && (
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">
              Pilih Media
            </h3>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Tutup
            </button>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500">
              Memuat media...
            </p>
          ) : media.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada media.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`overflow-hidden rounded-lg border text-left transition ${
                    item.id === value
                      ? "ring-2"
                      : ""
                  }`}
                >
                  <Image
                    src={item.fileUrl}
                    alt={
                      item.altText ??
                      item.fileName
                    }
                    width={400}
                    height={250}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-3">
                    <p className="truncate text-sm font-medium">
                      {item.fileName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(item.fileSize)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}