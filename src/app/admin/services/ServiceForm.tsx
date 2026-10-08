"use client";

import { useState } from "react";

import {
  updateService,
  archiveService,
} from "@/actions/service.actions";

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
};

export default function ServiceForm({
  service,
  onCancel,
}: ServiceFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const [mediaId, setMediaId] = useState(service?.mediaId ?? "");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!service) {
      setMessage(
        "Pilih layanan yang ingin diedit.",
      );
      return;
    }

    const form = event.currentTarget;

    setIsPending(true);
    setMessage("");

    const formData = new FormData(form);

    const input = {
      name: String(
        formData.get("name") ?? "",
      ),

      slug: String(
        formData.get("slug") ?? "",
      ),

      shortDescription: String(
        formData.get("shortDescription") ?? "",
      ),

      description: String(
        formData.get("description") ?? "",
      ),

      mediaId:
        String(
          formData.get("mediaId") ?? "",
        ) || undefined,

      status: String(
        formData.get("status") ?? "",
      ) as ServiceData["status"],

      sortOrder: service.sortOrder,

      metaTitle:
        String(
          formData.get("metaTitle") ?? "",
        ) || undefined,

      metaDescription:
        String(
          formData.get("metaDescription") ?? "",
        ) || undefined,
    };

    const result = await updateService(
      service.id,
      input,
    );

    if (result.success) {
      setMessage(
        "Layanan berhasil diperbarui.",
      );
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  async function handleArchive() {
    if (!service) {
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mengarsipkan layanan "${service.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result = await archiveService(
      service.id,
    );

    if (result.success) {
      setMessage(
        "Layanan berhasil diarsipkan.",
      );
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  if (!service) {
    return (
      <section>
        <h2>Layanan</h2>

        <p>
          Pilih layanan untuk mengedit
          informasinya.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Layanan</h2>

      <div>
        <label htmlFor="name">
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
        />
      </div>

      <div>
        <label htmlFor="slug">
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
        />
      </div>

      <div>
        <label htmlFor="shortDescription">
          Deskripsi Singkat
        </label>

        <textarea
          id="shortDescription"
          name="shortDescription"
          required
          defaultValue={
            service.shortDescription
          }
          disabled={isPending}
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="description">
          Deskripsi Lengkap
        </label>

        <textarea
          id="description"
          name="description"
          required
          defaultValue={
            service.description
          }
          disabled={isPending}
          rows={10}
        />
      </div>

      <div>
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

      <div>
        <label htmlFor="status">
          Status
        </label>

        <select
          id="status"
          name="status"
          defaultValue={service.status}
          disabled={isPending}
        >
          <option value="DRAFT">
            Draft
          </option>

          <option value="PUBLISHED">
            Published
          </option>

          <option value="ARCHIVED">
            Archived
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="metaTitle">
          Meta Title
        </label>

        <input
          id="metaTitle"
          name="metaTitle"
          type="text"
          maxLength={200}
          defaultValue={
            service.metaTitle ?? ""
          }
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="metaDescription">
          Meta Description
        </label>

        <textarea
          id="metaDescription"
          name="metaDescription"
          maxLength={200}
          defaultValue={
            service.metaDescription ?? ""
          }
          disabled={isPending}
          rows={4}
        />
      </div>

      <div>
        <p>
          Urutan: {service.sortOrder}
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Memproses..."
            : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleArchive}
          disabled={
            isPending ||
            service.status === "ARCHIVED"
          }
        >
          Archive
        </button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}