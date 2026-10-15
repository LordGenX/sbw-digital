"use client";

import { useState } from "react";
import { updateService } from "@/actions/service.actions";
import MediaPicker from "@/components/admin/MediaPicker";

type ServiceMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type ServiceData = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  mediaId: string | null;
  media: ServiceMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
};

type ServiceFormProps = {
  service?: ServiceData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function ServiceForm({
  service,
  onCancel,
  onSuccess,
}: ServiceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaId, setMediaId] = useState(service?.mediaId ?? "");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!service) {
      setMessage("Pilih layanan yang ingin diedit.");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const input = {
        name: String(formData.get("name") ?? ""),
        slug: String(formData.get("slug") ?? ""),
        shortDescription: String(
          formData.get("shortDescription") ?? "",
        ),
        description: String(formData.get("description") ?? ""),
        mediaId: String(formData.get("mediaId") ?? "") || undefined,
        status: "PUBLISHED" as const,
        sortOrder: service.sortOrder,
        metaTitle:
          String(formData.get("metaTitle") ?? "") || undefined,
        metaDescription:
          String(formData.get("metaDescription") ?? "") || undefined,
      };

      const result = await updateService(service.id, input);

      if (result.success) {
        setMessage("Layanan berhasil diperbarui.");
        onSuccess?.();
      } else {
        setMessage(
          `${result.error.code}: ${result.error.message}`,
        );
      }
    } catch {
      setMessage("Terjadi kesalahan saat memperbarui layanan.");
    } finally {
      setIsPending(false);
    }
  }

  if (!service) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Pilih Layanan
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Pilih layanan dari daftar untuk mengedit informasinya.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
    >
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Edit Layanan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi layanan koperasi.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Layanan
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={150}
            defaultValue={service.name}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            maxLength={180}
            defaultValue={service.slug}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-400">
            Digunakan sebagai bagian alamat URL layanan.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="shortDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Deskripsi Singkat
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          required
          rows={3}
          defaultValue={service.shortDescription}
          disabled={isPending}
          className="w-full resize-y rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Deskripsi Lengkap
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={7}
          defaultValue={service.description}
          disabled={isPending}
          className="w-full resize-y rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm leading-6 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Media Layanan
        </h3>

        <MediaPicker
          value={mediaId || undefined}
          selectedMedia={service.media ?? null}
          onChange={(selectedMediaId) => {
            setMediaId(selectedMediaId ?? "");
          }}
        />

        <input
          id="service-mediaId"
          name="mediaId"
          type="hidden"
          value={mediaId}
          readOnly
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">
            Status Publikasi
          </span>
          <div
            aria-label="Status publikasi"
            className="flex min-h-11 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm font-semibold text-green-700"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-green-500"
            />
            Published
          </div>
          <p className="text-xs text-gray-400">
            Status layanan selalu Published saat disimpan.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Meta Title
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            type="text"
            maxLength={200}
            defaultValue={service.metaTitle ?? ""}
            disabled={isPending}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="metaDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Meta Description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          maxLength={200}
          rows={3}
          defaultValue={service.metaDescription ?? ""}
          disabled={isPending}
          className="w-full resize-y rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-400">
          Maksimal 200 karakter.
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-600">
          Urutan tampilan:{" "}
          <span className="font-semibold text-gray-900">
            {service.sortOrder}
          </span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Urutan dikelola melalui konfigurasi layanan yang sudah ada.
        </p>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.includes("berhasil")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}