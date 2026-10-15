"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Globe,
  FileText,
  Pencil,
  RefreshCw,
  Clock3,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  getSiteSettings,
  type SiteSettingsItem,
} from "@/actions/site-settings.actions";

import SiteSettingsForm from "./SiteSettingsForm";

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Globe;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-200 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Icon size={20} />
        </span>

        <h2 className="text-sm font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-4 wrap-break-word text-sm leading-6 text-gray-600">
        {children}
      </div>
    </div>
  );
}

export default function SiteSettingsManager() {
  const [settings, setSettings] =
    useState<SiteSettingsItem | null>(null);
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
          setError(
            "Terjadi kesalahan saat mengambil pengaturan situs.",
          );
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
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle
            size={20}
            className="animate-spin text-orange-600"
          />
          Memuat pengaturan situs...
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-white p-6"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle size={20} />
          </span>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              Pengaturan situs gagal dimuat
            </h2>

            <p className="mt-1 text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <RefreshCw size={16} />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex flex-col gap-4 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Settings size={25} />
            </span>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Site Settings
              </h1>

              <p className="mt-1 text-sm text-orange-50">
                Kelola identitas dasar website SBW Digital.
              </p>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              <Pencil size={16} />
              Edit Pengaturan
            </button>
          )}
        </div>

        <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
          <Globe
            size={19}
            className="mt-0.5 shrink-0 text-orange-600"
          />

          <p className="text-sm leading-6 text-gray-600">
            Atur nama dan deskripsi website yang menjadi identitas
            utama SBW Digital.
          </p>
        </div>
      </div>

      {/* Error ketika data sebelumnya sudah tersedia */}
      {error && settings && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      {editing ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
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
        </div>
      ) : (
        <div className="space-y-5">
          {/* Site identity */}
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={Globe} title="Nama Situs">
              <p className="text-lg font-semibold leading-7 text-gray-900">
                {settings.siteName}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Nama utama website SBW Digital.
              </p>
            </InfoCard>

            <InfoCard icon={FileText} title="Deskripsi Situs">
              <p className="whitespace-pre-line leading-7 text-gray-700">
                {settings.siteDescription ||
                  "Belum ada deskripsi situs."}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Deskripsi singkat mengenai website.
              </p>
            </InfoCard>
          </div>

          {/* Last updated */}
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
              <Clock3 size={19} />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800">
                Informasi Pembaruan
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Terakhir diperbarui{" "}
                {new Date(settings.updatedAt).toLocaleString(
                  "id-ID",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Jakarta",
                  },
                )}{" "}
                WIB.
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                <CheckCircle2 size={14} />
                Data pengaturan tersedia
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}