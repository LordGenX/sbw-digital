
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowUpDown,
  CheckCircle2,
  FileText,
  ImageIcon,
  LoaderCircle,
  Save,
  Settings2,
  X,
} from "lucide-react";

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

type AboutUpdateStatus = "DRAFT" | "ARCHIVED";

type AboutFormProps = {
  content?: AboutData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

const labelClassName =
  "mb-2 block text-sm font-semibold text-gray-800";

const sectionLabels: Record<AboutData["section"], string> = {
  HISTORY: "Sejarah",
  VISION_MISSION: "Visi dan Misi",
  PROFILE: "Profil",
  ORGANIZATION: "Struktur Organisasi",
  ACHIEVEMENT: "Prestasi",
};

const statusLabels: Record<AboutData["status"], string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusStyles: Record<AboutData["status"], string> = {
  DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
  PUBLISHED: "border-green-200 bg-green-50 text-green-700",
  ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
};

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function AboutForm({
  content,
  onCancel,
  onSuccess,
}: AboutFormProps) {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("error");
  const [mediaId, setMediaId] = useState(content?.mediaId ?? "");

  const isCreateMode = !content;

  function showError(text: string) {
    setMessageType("error");
    setMessage(text);
  }

  function showSuccess(text: string) {
    setMessageType("success");
    setMessage(text);
  }

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

    const title = String(formData.get("title") ?? "");
    const contentValue = String(formData.get("content") ?? "");

    const selectedMediaId =
      String(formData.get("mediaId") ?? "") || undefined;

    const sortOrder = Number(formData.get("sortOrder") ?? 0);

    try {
      if (isCreateMode) {
        const result = await createAboutContent({
          section,
          title,
          content: contentValue,
          mediaId: selectedMediaId,
          sortOrder,
        });

        if (!result.success) {
          showError(
            `${result.error.code}: ${result.error.message}`,
          );
          return;
        }

        showSuccess("Konten About berhasil dibuat sebagai Draft.");
        router.refresh();
        onSuccess?.();
        return;
      }

      const statusFromForm = String(
        formData.get("status") ?? "",
      ) as AboutUpdateStatus;

      const input = {
        section,
        title,
        content: contentValue,
        mediaId: selectedMediaId,
        status:
          content.status === "PUBLISHED"
            ? "DRAFT" as const
            : statusFromForm,
        sortOrder,
      };

      const result = await updateAboutContent(content.id, input);

      if (!result.success) {
        showError(
          `${result.error.code}: ${result.error.message}`,
        );
        return;
      }

      showSuccess("Konten About berhasil diperbarui.");
      router.refresh();
      onSuccess?.();
    } catch {
      showError("Terjadi kesalahan saat menyimpan konten About.");
    } finally {
      setIsPending(false);
    }
  }

  async function handlePublish() {
    if (!content || content.status !== "DRAFT" || isPending) {
      return;
    }

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menerbitkan konten ini?",
    );

    if (!confirmed) return;

    setIsPending(true);
    setMessage("");

    try {
      const result = await publishAboutContent(content.id);

      if (!result.success) {
        showError(
          `${result.error.code}: ${result.error.message}`,
        );
        return;
      }

      showSuccess("Konten About berhasil diterbitkan.");
      router.refresh();
      onSuccess?.();
    } catch {
      showError("Terjadi kesalahan saat menerbitkan konten.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleArchive() {
    if (!content || content.status === "ARCHIVED" || isPending) {
      return;
    }

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin mengarsipkan konten ini?",
    );

    if (!confirmed) return;

    setIsPending(true);
    setMessage("");

    try {
      const result = await archiveAboutContent(content.id);

      if (!result.success) {
        showError(
          `${result.error.code}: ${result.error.message}`,
        );
        return;
      }

      showSuccess("Konten About berhasil diarsipkan.");
      router.refresh();
      onSuccess?.();
    } catch {
      showError("Terjadi kesalahan saat mengarsipkan konten.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:px-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <FileText size={25} />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              {isCreateMode ? "Tambah About" : "Edit About"}
            </h2>
            <p className="mt-1 text-sm text-orange-50">
              Kelola informasi Tentang SBW Digital.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <p className="flex items-start gap-2 text-sm leading-6 text-gray-600">
            <Settings2
              size={18}
              className="mt-0.5 shrink-0 text-orange-600"
            />
            Lengkapi informasi konten dengan benar sebelum disimpan.
          </p>

          {content && (
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[content.status]}`}
            >
              {statusLabels[content.status]}
            </span>
          )}
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div
          role={messageType === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            messageType === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <X size={19} className="mt-0.5 shrink-0" />
          )}
          <p className="leading-6">{message}</p>
        </div>
      )}

      {/* Informasi konten */}
      <FormSection
        icon={<FileText size={21} />}
        title="Informasi Konten"
        description="Tentukan kategori, judul, dan isi informasi About."
      >
        <div>
          <label htmlFor="section" className={labelClassName}>
            Section <span className="text-red-500">*</span>
          </label>

          <select
            id="section"
            name="section"
            required
            defaultValue={content?.section ?? "HISTORY"}
            disabled={isPending}
            className={inputClassName}
          >
            {Object.entries(sectionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className={labelClassName}>
            Judul <span className="text-red-500">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={content?.title ?? ""}
            disabled={isPending}
            placeholder="Masukkan judul konten"
            className={inputClassName}
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Maksimal 200 karakter.
          </p>
        </div>

        <div>
          <label htmlFor="content" className={labelClassName}>
            Isi Konten <span className="text-red-500">*</span>
          </label>

          <textarea
            id="content"
            name="content"
            required
            defaultValue={content?.content ?? ""}
            disabled={isPending}
            rows={8}
            placeholder="Tuliskan informasi Tentang SBW..."
            className={`${inputClassName} min-h-44 resize-y leading-6`}
          />
        </div>
      </FormSection>

      {/* Media dan urutan */}
      <FormSection
        icon={<ImageIcon size={21} />}
        title="Media dan Urutan"
        description="Pilih media pendukung dan tentukan urutan tampil konten."
      >
        <div className="space-y-2">
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

        <div>
          <label htmlFor="sortOrder" className={labelClassName}>
            Urutan Tampilan
          </label>

          <div className="relative">
            <ArrowUpDown
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={content?.sortOrder ?? 0}
              disabled={isPending}
              className={`${inputClassName} pl-10`}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Angka yang lebih kecil menunjukkan urutan lebih awal.
          </p>
        </div>
      </FormSection>

      {/* Status */}
      {!isCreateMode && (
        <FormSection
          icon={<Settings2 size={21} />}
          title="Status Konten"
          description="Atur status konten sesuai alur publikasi."
        >
          <div>
            <label htmlFor="status" className={labelClassName}>
              Status
            </label>

            {content.status === "PUBLISHED" ? (
              <>
                <input
                  id="status"
                  type="text"
                  value="Published"
                  disabled
                  readOnly
                  className={inputClassName}
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Konten ini sedang dipublikasikan. Untuk mengubahnya
                  menjadi Draft, gunakan alur pengelolaan status yang
                  tersedia di server.
                </p>
              </>
            ) : (
              <select
                id="status"
                name="status"
                defaultValue={content.status}
                disabled={isPending}
                className={inputClassName}
              >
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            )}
          </div>
        </FormSection>
      )}

      {/* Aksi */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            {isPending
              ? "Memproses..."
              : isCreateMode
                ? "Simpan Draft"
                : "Simpan Perubahan"}
          </button>

          {!isCreateMode && content.status === "DRAFT" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <CheckCircle2 size={17} />
              )}
              Publish
            </button>
          )}

          {!isCreateMode && content.status !== "ARCHIVED" && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Archive size={17} />
              Archive
            </button>
          )}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={17} />
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
