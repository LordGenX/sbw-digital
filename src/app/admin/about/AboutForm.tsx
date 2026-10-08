"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createAboutContent,
  updateAboutContent,
  archiveAboutContent,
  publishAboutContent,
} from "@/actions/about.actions";

import MediaPicker from "@/components/admin/MediaPicker";

type AboutMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type AboutData = {
  id: string;
  section:
    | "HISTORY"
    | "VISION_MISSION"
    | "PROFILE"
    | "ORGANIZATION"
    | "ACHIEVEMENT";
  title: string;
  content: string;
  mediaId: string | null;
  media: AboutMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type AboutUpdateStatus =
  | "DRAFT"
  | "ARCHIVED";

type AboutFormProps = {
  content?: AboutData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function AboutForm({
  content,
  onCancel,
  onSuccess,
}: AboutFormProps) {
  const router = useRouter();

  const [isPending, setIsPending] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [mediaId, setMediaId] = useState(
    content?.mediaId ?? "",
  );

  const isCreateMode = !content;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    setIsPending(true);
    setMessage("");

    const formData = new FormData(form);

    const section = String(
      formData.get("section") ?? "",
    ) as AboutData["section"];

    const title = String(
      formData.get("title") ?? "",
    );

    const contentValue = String(
      formData.get("content") ?? "",
    );

    const mediaId =
      String(
        formData.get("mediaId") ?? "",
      ) || undefined;

    const sortOrder = Number(
      formData.get("sortOrder") ?? 0,
    );

    /*
     * CREATE
     */
    if (isCreateMode) {
      const result =
        await createAboutContent({
          section,
          title,
          content: contentValue,
          mediaId,
          sortOrder,
        });

      if (result.success) {
        setMessage(
          "Konten About berhasil dibuat sebagai Draft.",
        );

        form.reset();

        router.refresh();

        onSuccess?.();
      } else {
        setMessage(
          `${result.error.code}: ${result.error.message}`,
        );
      }

      setIsPending(false);

      return;
    }

    /*
     * UPDATE
     */
    const statusFromForm =
      String(
        formData.get("status") ?? "",
      ) as AboutUpdateStatus;

    const input = {
      section,
      title,
      content: contentValue,
      mediaId,
      status:
        content.status === "PUBLISHED"
          ? "DRAFT"
          : statusFromForm,
      sortOrder,
    };

    const result =
      await updateAboutContent(
        content.id,
        input,
      );

    if (result.success) {
      setMessage(
        "Konten About berhasil diperbarui.",
      );

      router.refresh();

      onSuccess?.();
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  async function handlePublish() {
    if (
      !content ||
      content.status !== "DRAFT"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Apakah Anda yakin ingin menerbitkan konten ini?",
      );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result =
      await publishAboutContent(
        content.id,
      );

    if (result.success) {
      setMessage(
        "Konten About berhasil diterbitkan.",
      );

      router.refresh();

      onSuccess?.();
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  async function handleArchive() {
    if (!content) {
      return;
    }

    const confirmed =
      window.confirm(
        "Apakah Anda yakin ingin mengarsipkan konten ini?",
      );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result =
      await archiveAboutContent(
        content.id,
      );

    if (result.success) {
      setMessage(
        "Konten About berhasil diarsipkan.",
      );

      router.refresh();

      onSuccess?.();
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {isCreateMode
          ? "Tambah About Content"
          : "Edit About Content"}
      </h2>

      <div>
        <label htmlFor="section">
          Section
        </label>

        <select
          id="section"
          name="section"
          defaultValue={
            content?.section ?? "HISTORY"
          }
          disabled={isPending}
        >
          <option value="HISTORY">
            Sejarah
          </option>

          <option value="VISION_MISSION">
            Visi & Misi
          </option>

          <option value="PROFILE">
            Profile
          </option>

          <option value="ORGANIZATION">
            Struktur Organisasi
          </option>

          <option value="ACHIEVEMENT">
            Prestasi
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="title">
          Judul
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={
            content?.title ?? ""
          }
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor="content">
          Konten
        </label>

        <textarea
          id="content"
          name="content"
          required
          defaultValue={
            content?.content ?? ""
          }
          disabled={isPending}
          rows={10}
        />
      </div>

      <div>
        <MediaPicker
          value={mediaId || undefined}
          selectedMedia={content?.media ?? null}
          onChange={(selectedMediaId) => {
            setMediaId(selectedMediaId ?? "");
          }}
        />

        <input
          id="about-media-id"
          name="mediaId"
          type="hidden"
          value={mediaId}
          readOnly
        />
      </div>

      {!isCreateMode && (
        <div>
          <label>
            Status
          </label>

          {content.status ===
          "PUBLISHED" ? (
            <input
              type="text"
              value="Published"
              disabled
              readOnly
            />
          ) : (
            <select
              id="status"
              name="status"
              defaultValue={
                content.status
              }
              disabled={isPending}
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>
          )}
        </div>
      )}

      <div>
        <label htmlFor="sortOrder">
          Urutan
        </label>

        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={
            content?.sortOrder ?? 0
          }
          disabled={isPending}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Memproses..."
            : isCreateMode
              ? "Simpan Draft"
              : "Simpan Perubahan"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            Batal
          </button>
        )}

        {!isCreateMode &&
          content.status ===
            "DRAFT" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
            >
              {isPending
                ? "Memproses..."
                : "Publish"}
            </button>
          )}

        {!isCreateMode && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={
              isPending ||
              content.status ===
                "ARCHIVED"
            }
          >
            Archive
          </button>
        )}
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}