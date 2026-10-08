"use client";

import { FormEvent, useState } from "react";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-white p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">Edit Statistik</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Perbarui data statistik yang ditampilkan pada website publik.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nama
          </label>

          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            maxLength={100}
            className="rounded-md border px-3 py-2"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="value" className="text-sm font-medium">
            Nilai
          </label>

          <input
            id="value"
            type="number"
            step="0.01"
            value={form.value}
            onChange={(event) => updateField("value", event.target.value)}
            className="rounded-md border px-3 py-2"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="unit" className="text-sm font-medium">
            Unit
          </label>

          <input
            id="unit"
            type="text"
            value={form.unit}
            onChange={(event) => updateField("unit", event.target.value)}
            maxLength={50}
            className="rounded-md border px-3 py-2"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>

          <textarea
            id="description"
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            rows={4}
            className="rounded-md border px-3 py-2"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="sortOrder" className="text-sm font-medium">
            Urutan
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
            className="rounded-md border px-3 py-2"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Status</span>

          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            {statistic.status}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}