"use client";

import { useState } from "react";
import type { SiteSettingsItem } from "@/actions/site-settings.actions";
import { updateSiteSettings } from "@/actions/site-settings.actions";

type SiteSettingsFormProps = {
  settings: SiteSettingsItem;
  onCancel: () => void;
  onSuccess: (settings: SiteSettingsItem) => void;
};

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      setError("Terjadi kesalahan saat menyimpan pengaturan situs.");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const labelClassName = "mb-1.5 block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Edit Pengaturan Situs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ubah nama dan deskripsi umum website SBW Digital.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="siteName" className={labelClassName}>
          Nama Situs <span className="text-destructive">*</span>
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
        <p className="mt-1 text-xs text-muted-foreground">
          Maksimal 150 karakter.
        </p>
      </div>

      <div>
        <label htmlFor="siteDescription" className={labelClassName}>
          Deskripsi Situs
        </label>
        <textarea
          id="siteDescription"
          name="siteDescription"
          rows={5}
          maxLength={5000}
          value={siteDescription}
          onChange={(event) => {
            setSiteDescription(event.target.value);
            setError("");
          }}
          className={inputClassName}
          disabled={loading}
          placeholder="Masukkan deskripsi umum website"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Opsional, maksimal 5000 karakter.
        </p>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}