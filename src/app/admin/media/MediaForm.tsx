"use client";

import { FormEvent, useRef, useState } from "react";
import { uploadMedia } from "@/actions/media.actions";
import { MAX_MEDIA_FILE_SIZE } from "@/lib/media";

type MediaFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function MediaForm({
  onSuccess,
  onCancel,
}: MediaFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!file) {
      window.alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    if (file.size > MAX_MEDIA_FILE_SIZE) {
      window.alert("Ukuran file terlalu besar. Maksimal 5 MB.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await uploadMedia(
        file,
        altText.trim() || undefined,
      );

      if ("error" in result) {
        window.alert(result.error.message);
        return;
      }

      window.alert("Media berhasil diupload.");

      setFile(null);
      setAltText("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengupload media.",
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
          Upload Media
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="media-file"
          className="block text-sm font-medium"
        >
          File
        </label>

        <input
          ref={fileInputRef}
          id="media-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isSubmitting}
          required
          className="block w-full rounded-md border px-3 py-2 text-sm"
        />

        {file && (
          <div className="rounded-md bg-gray-50 p-3 text-sm">
            <p>
              <span className="font-medium">Nama:</span>{" "}
              {file.name}
            </p>

            <p>
              <span className="font-medium">Tipe:</span>{" "}
              {file.type}
            </p>

            <p>
              <span className="font-medium">Ukuran:</span>{" "}
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="media-alt-text"
          className="block text-sm font-medium"
        >
          Alt Text
        </label>

        <input
          id="media-alt-text"
          type="text"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          maxLength={255}
          disabled={isSubmitting}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Deskripsi singkat gambar"
        />

        <p className="text-xs text-gray-500">
          Opsional, maksimal 255 karakter.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="rounded-md bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Mengupload..." : "Upload Media"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border px-4 py-2 disabled:opacity-50"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}