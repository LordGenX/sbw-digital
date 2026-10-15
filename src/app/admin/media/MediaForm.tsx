"use client";

import { FormEvent, useRef, useState } from "react";
import {
  CheckCircle2,
  FileImage,
  FileUp,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { uploadMedia } from "@/actions/media.actions";
import {
  ALLOWED_MEDIA_TYPES,
  MAX_MEDIA_FILE_SIZE,
} from "@/lib/media";

type MediaFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MediaForm({
  onSuccess,
  onCancel,
}: MediaFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0] ?? null;

    setMessage(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      !ALLOWED_MEDIA_TYPES.includes(
        selectedFile.type as (typeof ALLOWED_MEDIA_TYPES)[number],
      )
    ) {
      setFile(null);
      event.target.value = "";
      setMessage({
        type: "error",
        text: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP.",
      });
      return;
    }

    if (selectedFile.size > MAX_MEDIA_FILE_SIZE) {
      setFile(null);
      event.target.value = "";
      setMessage({
        type: "error",
        text: "Ukuran file maksimal 5 MB. Silakan pilih file yang lebih kecil.",
      });
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!file) {
      setMessage({
        type: "error",
        text: "Silakan pilih file gambar terlebih dahulu.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await uploadMedia(
        file,
        altText.trim() || undefined,
      );

      if (!result.success) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Media berhasil diunggah.",
      });

      setFile(null);
      setAltText("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengunggah media.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FileUp size={22} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Upload Media
            </h2>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              Tambahkan gambar ke Media Library SBW.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Tutup form upload"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message.type === "error" ? (
              <X size={18} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="leading-5">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="media-file"
            className="block text-sm font-semibold text-gray-800"
          >
            File gambar <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="media-file"
            className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition ${
              isSubmitting
                ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                : "border-orange-200 bg-orange-50/40 hover:border-orange-400 hover:bg-orange-50"
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
              <Upload size={22} />
            </div>

            <p className="mt-3 text-sm font-semibold text-gray-800">
              Klik untuk memilih gambar
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              JPG, PNG, atau WebP · Maksimal 5 MB
            </p>

            <input
              ref={fileInputRef}
              id="media-file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isSubmitting}
              required={!file}
              className="sr-only"
            />
          </label>

          {file && (
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <FileImage size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold text-gray-800"
                  title={file.name}
                >
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {file.type} · {formatFileSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setMessage(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={isSubmitting}
                aria-label="Batalkan pilihan file"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-red-600 disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="media-alt-text"
            className="block text-sm font-semibold text-gray-800"
          >
            Alt Text
            <span className="ml-2 font-normal text-gray-400">
              Opsional
            </span>
          </label>

          <input
            id="media-alt-text"
            name="altText"
            type="text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            maxLength={255}
            disabled={isSubmitting}
            placeholder="Contoh: Kegiatan anggota Koperasi SBW"
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
          />

          <p className="text-xs leading-5 text-gray-500">
            Deskripsi singkat untuk membantu aksesibilitas gambar.
            Maksimal 255 karakter.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !file}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload size={17} />
                Upload Media
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}