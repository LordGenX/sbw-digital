"use client";

import { useEffect, useState } from "react";
import {
  getSiteSettings,
  type SiteSettingsItem,
} from "@/actions/site-settings.actions";
import SiteSettingsForm from "./SiteSettingsForm";

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      setLoading(true);
      setError("");

      try {
        const result = await getSiteSettings();

        if (cancelled) return;

        if (!result.success) {
          setError(result.error.message);
          return;
        }

        if (!result.data) {
          setError(
            "Pengaturan situs belum tersedia. Pastikan data SiteSettings sudah dimasukkan ke database.",
          );
          return;
        }

        setSettings(result.data);
      } catch {
        if (!cancelled) {
          setError("Terjadi kesalahan saat mengambil pengaturan situs.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Memuat pengaturan situs...
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/10 p-4"
      >
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Site Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola identitas dasar website SBW Digital.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Edit Pengaturan
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-card p-4 sm:p-6">
        {editing ? (
          <SiteSettingsForm
            key={settings.id}
            settings={settings}
            onCancel={() => setEditing(false)}
            onSuccess={(updatedSettings) => {
              setSettings(updatedSettings);
              setEditing(false);
              setError("");
            }}
          />
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Nama Situs
              </h2>
              <p className="mt-1 text-base font-semibold">
                {settings.siteName}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Deskripsi Situs
              </h2>
              <p className="mt-1 whitespace-pre-line text-sm">
                {settings.siteDescription || "Belum ada deskripsi."}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Terakhir diperbarui:{" "}
                {new Date(settings.updatedAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                })}
            </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}