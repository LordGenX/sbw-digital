
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Send,
  Archive,
  Layers3,
  ArrowUpDown,
  ImagePlus,
  Pencil,
  Info,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

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

type MembershipUpdateStatus = "DRAFT" | "ARCHIVED";

type MembershipFormProps = {
  content?: MembershipData;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const sectionOptions: {
  value: MembershipData["section"];
  label: string;
  description: string;
}[] = [
  {
    value: "WHY_JOIN",
    label: "Mengapa Bergabung",
    description: "Alasan dan tujuan menjadi anggota koperasi.",
  },
  {
    value: "BENEFIT",
    label: "Manfaat Membership",
    description: "Manfaat yang diperoleh anggota.",
  },
  {
    value: "REQUIREMENT",
    label: "Persyaratan",
    description: "Ketentuan untuk menjadi anggota.",
  },
  {
    value: "HOW_TO_REGISTER",
    label: "Cara Pendaftaran",
    description: "Langkah-langkah pendaftaran anggota.",
  },
  {
    value: "FAQ",
    label: "Pertanyaan Umum (FAQ)",
    description: "Pertanyaan dan jawaban seputar membership.",
  },
];

const inputClassName =
  "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

const labelClassName =
  "block text-sm font-semibold text-gray-800";

export default function MembershipForm({
  content,
  onCancel,
  onSuccess,
}: MembershipFormProps) {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const [mediaId, setMediaId] = useState(
    content?.mediaId ?? "",
  );

  const isCreateMode = !content;

  const selectedSection = sectionOptions.find(
    (section) => section.value === content?.section,
  );

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

    const title = String(formData.get("title") ?? "");

    const contentValue = String(
      formData.get("content") ?? "",
    );

    const selectedMediaId =
      String(formData.get("mediaId") ?? "") || undefined;

    const sortOrder = Number(
      formData.get("sortOrder") ?? 0,
    );

    /*
     * CREATE
     */
    if (isCreateMode) {
      const result = await createMembershipInfo({
        section,
        title,
        content: contentValue,
        mediaId: selectedMediaId,
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
    const statusFromForm = String(
      formData.get("status") ?? "",
    ) as MembershipUpdateStatus;

    const input = {
      section,
      title,
      content: contentValue,
      mediaId: selectedMediaId,
      status:
        content.status === "PUBLISHED"
          ? ("DRAFT" as const)
          : statusFromForm,
      sortOrder,
    };

    const result = await updateMembershipInfo(
      content.id,
      input,
    );

    if (result.success) {
      setMessage("Konten Membership berhasil diperbarui.");

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
    if (!content || content.status !== "DRAFT") {
      return;
    }

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menerbitkan konten Membership ini?",
    );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result = await publishMembershipInfo(content.id);

    if (result.success) {
      setMessage("Konten Membership berhasil diterbitkan.");

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

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin mengarsipkan konten Membership ini?",
    );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage("");

    const result = await archiveMembershipInfo(content.id);

    if (result.success) {
      setMessage("Konten Membership berhasil diarsipkan.");

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
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header form */}
      <div className="border-b border-orange-100 bg-linear-to-br from-orange-50 to-white px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            {isCreateMode ? (
              <Layers3 size={22} />
            ) : (
              <Pencil size={21} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              Pengelolaan Membership
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              {isCreateMode
                ? "Tambah Informasi Membership"
                : "Edit Informasi Membership"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              {isCreateMode
                ? "Lengkapi informasi yang akan disimpan sebagai Draft."
                : "Perbarui informasi membership sesuai kebutuhan."}
            </p>
          </div>

          {!isCreateMode && content && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                content.status === "PUBLISHED"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : content.status === "DRAFT"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-gray-200 bg-gray-100 text-gray-600"
              }`}
            >
              {content.status === "PUBLISHED"
                ? "Published"
                : content.status === "DRAFT"
                  ? "Draft"
                  : "Archived"}
            </span>
          )}
        </div>
      </div>

      {/* Isi form */}
      <div className="space-y-7 p-5 sm:p-7">
        {/* Section */}
        <section className="space-y-2">
          <label htmlFor="section" className={labelClassName}>
            Section
            <span className="ml-1 text-orange-600">*</span>
          </label>

          <select
            id="section"
            name="section"
            required
            defaultValue={content?.section ?? "WHY_JOIN"}
            disabled={isPending}
            className={inputClassName}
          >
            {sectionOptions.map((section) => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </select>

          <p className="text-xs leading-5 text-gray-500">
            {selectedSection?.description ??
              "Pilih kelompok informasi membership yang sesuai."}
          </p>
        </section>

        {/* Judul */}
        <section>
          <label htmlFor="title" className={labelClassName}>
            Judul Konten
            <span className="ml-1 text-orange-600">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={content?.title ?? ""}
            disabled={isPending}
            placeholder="Contoh: Manfaat Menjadi Anggota"
            className={inputClassName}
          />

          <p className="mt-2 text-xs text-gray-500">
            Gunakan judul yang singkat dan mudah dipahami.
          </p>
        </section>

        {/* Konten */}
        <section>
          <label htmlFor="content" className={labelClassName}>
            Isi Konten
            <span className="ml-1 text-orange-600">*</span>
          </label>

          <textarea
            id="content"
            name="content"
            required
            rows={7}
            defaultValue={content?.content ?? ""}
            disabled={isPending}
            placeholder="Tuliskan informasi membership di sini..."
            className={`${inputClassName} min-h-40 resize-y leading-6`}
          />

          <p className="mt-2 text-xs text-gray-500">
            Masukkan informasi yang akan ditampilkan pada website SBW.
          </p>
        </section>

        {/* Media */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ImagePlus size={18} className="text-orange-600" />

            <h3 className="text-sm font-semibold text-gray-800">
              Media Pendukung
            </h3>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              Opsional
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
            <p className="mb-4 text-sm leading-6 text-gray-600">
              Pilih media dari pustaka Media untuk melengkapi informasi
              membership. Media tidak wajib diisi.
            </p>

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

            {mediaId ? (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                />
                <p>
                  Media telah dipilih. Simpan perubahan untuk
                  memperbarui konten.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500">
                <Info size={17} className="mt-0.5 shrink-0" />
                <p>Belum ada media yang dipilih.</p>
              </div>
            )}
          </div>
        </section>

        {/* Status */}
        {!isCreateMode && content && (
          <section>
            <label
              htmlFor="status"
              className={labelClassName}
            >
              Status Konten
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
          </section>
        )}

        {/* Urutan */}
        <section>
          <label
            htmlFor="sortOrder"
            className={labelClassName}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              Urutan Tampilan
            </span>
          </label>

          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            step={1}
            defaultValue={content?.sortOrder ?? 0}
            disabled={isPending}
            className={inputClassName}
          />

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Angka yang lebih kecil menunjukkan urutan yang lebih awal.
          </p>
        </section>

        {/* Pesan operasi */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              message.includes("berhasil")
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.includes("berhasil") ? (
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="wrap-break-word">{message}</p>
          </div>
        )}
      </div>

      {/* Footer tombol */}
      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          {!isCreateMode && content?.status === "DRAFT" && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Publish
            </button>
          )}

          {!isCreateMode && content && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={
                isPending || content.status === "ARCHIVED"
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Archive size={16} />
              Archive
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} />
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Save size={17} />
                {isCreateMode ? "Simpan Draft" : "Simpan Perubahan"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}