"use client";

import { type FormEvent, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, Pencil } from "lucide-react";

import {
  updateStatistic,
  type StatisticListItem,
} from "@/actions/statistic.actions";

type StatisticFormProps = {
  statistic: StatisticListItem;
  onCancel: () => void;
  onSuccess?: () => void;
};

type FormState = {
  name: string;
  value: string;
  unit: string;
  description: string;
  sortOrder: string;
};

function createInitialForm(statistic: StatisticListItem): FormState {
  return {
    name: statistic.name,
    value: statistic.value,
    unit: statistic.unit ?? "",
    description: statistic.description ?? "",
    sortOrder: statistic.sortOrder.toString(),
  };
}

export default function StatisticForm({
  statistic,
  onCancel,
  onSuccess,
}: StatisticFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    createInitialForm(statistic),
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const value = Number(form.value);
    const sortOrder = Number(form.sortOrder);

    if (!form.name.trim()) {
      setError("Nama statistik wajib diisi.");
      return;
    }

    if (!form.value.trim() || !Number.isFinite(value)) {
      setError("Nilai statistik harus berupa angka yang valid.");
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 1) {
      setError("Urutan harus berupa bilangan bulat minimal 1.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateStatistic(statistic.id, {
        name: form.name.trim(),
        value,
        unit: form.unit.trim(),
        description: form.description.trim(),
        sortOrder,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onSuccess?.();
      onCancel();
    } catch {
      setError("Terjadi kesalahan saat menyimpan statistik.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70";

  const labelClassName = "text-sm font-semibold text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header form */}
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50 to-white px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
            <Pencil size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-orange-700">
              MANAJEMEN KONTEN
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
              Edit Statistik
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Perbarui data statistik yang ditampilkan pada website publik SBW Digital.
            </p>
          </div>
        </div>
      </div>

      {/* Isi form */}
      <div className="space-y-5 p-5 sm:p-7">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid content-start gap-2">
            <label htmlFor="name" className={labelClassName}>
              Nama Statistik
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              maxLength={100}
              className={inputClassName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid content-start gap-2">
            <label htmlFor="value" className={labelClassName}>
              Nilai
            </label>

            <input
              id="value"
              type="number"
              step="0.01"
              value={form.value}
              onChange={(event) => updateField("value", event.target.value)}
              className={inputClassName}
              disabled={isSubmitting}
              required
            />

            <p className="text-xs text-gray-500">
              Masukkan angka statistik yang ingin ditampilkan.
            </p>
          </div>

          <div className="grid content-start gap-2">
            <label htmlFor="unit" className={labelClassName}>
              Unit
            </label>

            <input
              id="unit"
              type="text"
              value={form.unit}
              onChange={(event) => updateField("unit", event.target.value)}
              maxLength={50}
              placeholder="Contoh: Orang, Tahun, Unit"
              className={inputClassName}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid content-start gap-2">
            <label htmlFor="sortOrder" className={labelClassName}>
              Urutan Tampilan
            </label>

            <input
              id="sortOrder"
              type="number"
              min={1}
              step={1}
              value={form.sortOrder}
              onChange={(event) =>
                updateField("sortOrder", event.target.value)
              }
              className={inputClassName}
              disabled={isSubmitting}
              required
            />

            <p className="text-xs text-gray-500">
              Gunakan bilangan bulat mulai dari 1.
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className={labelClassName}>
            Deskripsi
          </label>

          <textarea
            id="description"
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={4}
            className={`${inputClassName} resize-y`}
            disabled={isSubmitting}
            placeholder="Jelaskan informasi statistik ini..."
          />
        </div>

        {/* Status hanya sebagai informasi */}
        <div className="grid gap-2">
          <span className={labelClassName}>Status Publikasi</span>

          <div className="flex min-h-11 items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5">
            <span className="text-sm text-gray-600">
              Status saat ini
            </span>

            <span
              className={
                statistic.status === "ACTIVE"
                  ? "inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                  : "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600"
              }
            >
              <span
                className={
                  statistic.status === "ACTIVE"
                    ? "size-1.5 rounded-full bg-green-500"
                    : "size-1.5 rounded-full bg-gray-400"
                }
              />
              {statistic.status}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Status ditampilkan sebagai informasi dan tidak diubah melalui form ini.
          </p>
        </div>
      </div>

      {/* Footer tombol */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check size={16} />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}