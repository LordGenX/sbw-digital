"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createMembershipInfo,
  updateMembershipInfo,
  archiveMembershipInfo,
  publishMembershipInfo,
} from "@/actions/membership.actions";

import MediaPicker from "@/components/admin/MediaPicker";

type MembershipMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type MembershipData = {
  id: string;
  section:
    | "WHY_JOIN"
    | "BENEFIT"
    | "REQUIREMENT"
    | "HOW_TO_REGISTER"
    | "FAQ";
  title: string;
  content: string;
  mediaId: string | null;
  media: MembershipMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type MembershipUpdateStatus =
  | "DRAFT"
  | "ARCHIVED";

type MembershipFormProps = {
  content?: MembershipData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function MembershipForm({
  content,
  onCancel,
  onSuccess,
}: MembershipFormProps) {
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
    ) as MembershipData["section"];

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
        await createMembershipInfo({
          section,
          title,
          content: contentValue,
          mediaId,
          sortOrder,
        });

      if (result.success) {
        setMessage(
          "Konten Membership berhasil dibuat sebagai Draft.",
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
      ) as MembershipUpdateStatus;

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
      await updateMembershipInfo(
        content.id,
        input,
      );

    if (result.success) {
      setMessage(
        "Konten Membership berhasil diperbarui.",
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
        "Apakah Anda yakin ingin menerbitkan konten Membership ini?",
      );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result =
      await publishMembershipInfo(
        content.id,
      );

    if (result.success) {
      setMessage(
        "Konten Membership berhasil diterbitkan.",
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
        "Apakah Anda yakin ingin mengarsipkan konten Membership ini?",
      );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result =
      await archiveMembershipInfo(
        content.id,
      );

    if (result.success) {
      setMessage(
        "Konten Membership berhasil diarsipkan.",
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
          ? "Tambah Membership Content"
          : "Edit Membership Content"}
      </h2>

      <div>
        <label htmlFor="section">
          Section
        </label>

        <select
          id="section"
          name="section"
          defaultValue={
            content?.section ?? "WHY_JOIN"
          }
          disabled={isPending}
        >
          <option value="WHY_JOIN">
            Mengapa Bergabung
          </option>

          <option value="BENEFIT">
            Manfaat
          </option>

          <option value="REQUIREMENT">
            Persyaratan
          </option>

          <option value="HOW_TO_REGISTER">
            Cara Pendaftaran
          </option>

          <option value="FAQ">
            FAQ
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
          id="membership-media-id"
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