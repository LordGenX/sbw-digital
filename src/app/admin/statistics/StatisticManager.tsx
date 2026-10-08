"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getStatistics,
  type StatisticListItem,
} from "@/actions/statistic.actions";

import StatisticForm from "./StatisticForm";

export default function StatisticManager() {
  const [statistics, setStatistics] = useState<StatisticListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingStatistic, setEditingStatistic] =
    useState<StatisticListItem | null>(null);

  const loadStatistics = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getStatistics();

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      setStatistics(result.data);
    } catch {
      setError("Gagal memuat data statistik.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStatistics() {
      try {
        const result = await getStatistics();

        if (cancelled) {
          return;
        }

        if (!result.success) {
          setError(result.error.message);
          return;
        }

        setStatistics(result.data);
      } catch {
        if (!cancelled) {
          setError("Gagal memuat data statistik.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleEdit(statistic: StatisticListItem) {
    setEditingStatistic(statistic);
  }

  function handleCancel() {
    setEditingStatistic(null);
  }

  if (editingStatistic) {
    return (
      <StatisticForm
        key={editingStatistic.id}
        statistic={editingStatistic}
        onCancel={handleCancel}
        onSuccess={() => {
          void loadStatistics();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Statistik</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Kelola angka ringkasan yang ditampilkan pada website publik.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-muted-foreground">
          Memuat data statistik...
        </div>
      ) : statistics.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Data statistik belum tersedia.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-medium">
                  Nama
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Nilai
                </th>

                <th className="px-4 py-3 text-left font-medium">
                  Unit
                </th>

                <th className="px-4 py-3 text-center font-medium">
                  Urutan
                </th>

                <th className="px-4 py-3 text-center font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {statistics.map((statistic) => (
                <tr
                  key={statistic.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {statistic.name}
                    </div>

                    {statistic.description && (
                      <div className="mt-1 max-w-md text-xs text-muted-foreground">
                        {statistic.description}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {statistic.value}
                  </td>

                  <td className="px-4 py-3">
                    {statistic.unit || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {statistic.sortOrder}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={
                        statistic.status === "ACTIVE"
                          ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                      }
                    >
                      {statistic.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleEdit(statistic)}
                      className="rounded-md border px-3 py-1.5 text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}