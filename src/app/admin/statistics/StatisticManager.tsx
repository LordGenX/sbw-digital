"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChartNoAxesColumn,
  Pencil,
  RefreshCw,
} from "lucide-react";

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

        if (cancelled) return;

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
          setEditingStatistic(null);
          void loadStatistics();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-700">
            <ChartNoAxesColumn size={18} />
            <span>MANAJEMEN KONTEN</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Statistik
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola angka ringkasan yang ditampilkan pada website publik SBW Digital.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStatistics()}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
        >
          <RefreshCw
            size={16}
            className={isLoading ? "animate-spin" : ""}
          />
          Muat ulang
        </button>
      </div>

      {/* Informasi jumlah data */}
      <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
          <ChartNoAxesColumn size={21} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Data Statistik Website
          </p>
          <p className="mt-0.5 text-xs leading-5 text-gray-600">
            Tersedia {statistics.length} data statistik. Gunakan tombol Edit
            untuk memperbarui nilai yang ditampilkan.
          </p>
        </div>
      </div>

      {/* Pesan error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <RefreshCw
            size={24}
            className="mx-auto animate-spin text-orange-600"
          />
          <p className="mt-3 text-sm text-gray-500">
            Memuat data statistik...
          </p>
        </div>
      ) : statistics.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <ChartNoAxesColumn
            size={32}
            className="mx-auto text-gray-400"
          />
          <p className="mt-3 font-semibold text-gray-900">
            Data statistik belum tersedia
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Data akan ditampilkan di sini setelah tersedia.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Daftar Statistik
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Pilih Edit pada data yang ingin diperbarui.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-sm">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/70">
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Nilai
                  </th>
                  <th className="px-5 py-4 text-left font-semibold text-gray-700">
                    Unit
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-700">
                    Urutan
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {statistics.map((statistic) => (
                  <tr
                    key={statistic.id}
                    className="transition-colors hover:bg-orange-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {statistic.name}
                      </div>

                      {statistic.description && (
                        <div className="mt-1 max-w-md text-xs leading-5 text-gray-500">
                          {statistic.description}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold tabular-nums text-gray-900">
                      {statistic.value}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {statistic.unit || "-"}
                    </td>

                    <td className="px-5 py-4 text-center tabular-nums text-gray-600">
                      {statistic.sortOrder}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span
                        className={
                          statistic.status === "ACTIVE"
                            ? "inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                            : "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600"
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
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(statistic)}
                        className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3">
            <p className="text-xs text-gray-500">
              Statistik hanya dapat diedit. Penambahan dan penghapusan data
              tidak tersedia pada modul ini.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}