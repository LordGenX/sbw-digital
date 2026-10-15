"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  FileText,
  Save,
  X,
  LoaderCircle,
  AlertCircle,
  Type,
} from "lucide-react";

import type { SiteSettingsItem } from "@/actions/site-settings.actions";
import { updateSiteSettings } from "@/actions/site-settings.actions";

type SiteSettingsFormProps = {
  settings: SiteSettingsItem;
  onCancel: () => void;
  onSuccess: (settings: SiteSettingsItem) => void;
};

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-medium text-gray-700";

export default function SiteSettingsForm({
  settings,
  onCancel,
  onSuccess,
}: SiteSettingsFormProps) {
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteDescription, setSiteDescription] = useState(
    settings.siteDescription ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await updateSiteSettings(settings.id, {
        siteName,
        siteDescription,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onSuccess(result.data);
    } catch {
      setError(
        "Terjadi kesalahan saat menyimpan pengaturan situs.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex items-center gap-3 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:px-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Settings size={25} />
          </span>

          <div>
            <h2 className="text-lg font-bold">
              Edit Pengaturan Situs
            </h2>
            <p className="mt-1 text-sm text-orange-50">
              Perbarui identitas utama website SBW Digital.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
          <Globe
            size={19}
            className="mt-0.5 shrink-0 text-orange-600"
          />
          <p className="text-sm leading-6 text-gray-600">
            Perubahan akan diterapkan setelah pengaturan berhasil
            disimpan.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <p>{error}</p>
        </div>
      )}

      {/* Site name */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <Type size={20} />
          </span>

          <div>
            <h3 className="font-semibold text-gray-900">
              Identitas Website
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Nama utama yang mewakili website.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <label htmlFor="siteName" className={labelClassName}>
            Nama Situs <span className="text-red-500">*</span>
          </label>

          <input
            id="siteName"
            name="siteName"
            type="text"
            required
            maxLength={150}
            value={siteName}
            onChange={(event) => {
              setSiteName(event.target.value);
              setError("");
            }}
            className={inputClassName}
            disabled={loading}
            placeholder="Masukkan nama situs"
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              Nama yang digunakan untuk identitas website.
            </p>
            <span className="shrink-0 text-xs tabular-nums text-gray-400">
              {siteName.length}/150
            </span>
          </div>
        </div>
      </section>

      {/* Site description */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <FileText size={20} />
          </span>

          <div>
            <h3 className="font-semibold text-gray-900">
              Deskripsi Website
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Penjelasan singkat tentang SBW Digital.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <label
            htmlFor="siteDescription"
            className={labelClassName}
          >
            Deskripsi Situs
          </label>

          <textarea
            id="siteDescription"
            name="siteDescription"
            rows={6}
            maxLength={5000}
            value={siteDescription}
            onChange={(event) => {
              setSiteDescription(event.target.value);
              setError("");
            }}
            className={`${inputClassName} resize-y`}
            disabled={loading}
            placeholder="Tuliskan deskripsi umum website SBW Digital..."
          />

          <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-xs leading-5 text-gray-400">
              Opsional. Gunakan deskripsi yang jelas dan ringkas.
            </p>
            <span className="shrink-0 text-xs tabular-nums text-gray-400">
              {siteDescription.length}/5000
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white/95 px-1 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={17} />
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
              Menyimpan...
            </>
          ) : (
            <>
              <Save size={17} />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}