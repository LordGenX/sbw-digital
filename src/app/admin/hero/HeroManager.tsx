
"use client";

import { useState } from "react";
import {
  ImageIcon,
  Plus,
  Pencil,
  Video,
  ExternalLink,
  CheckCircle2,
  CircleX,
  ArrowLeft,
  Layers3,
} from "lucide-react";
import { useRouter } from "next/navigation";

import HeroForm from "./HeroForm";

type HeroData = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  ctaText: string | null;
  ctaUrl: string | null;
  isActive: boolean;
};

type HeroManagerProps = {
  heroes: HeroData[];
};

export default function HeroManager({ heroes }: HeroManagerProps) {
  const [editingHero, setEditingHero] = useState<HeroData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const activeHeroes = heroes.filter((hero) => hero.isActive);
  const inactiveHeroes = heroes.filter((hero) => !hero.isActive);

  function handleAdd() {
    setEditingHero(null);
    setShowForm(true);
  }

  function handleEdit(hero: HeroData) {
    setEditingHero(hero);
    setShowForm(true);
  }

  function handleCancel() {
    setEditingHero(null);
    setShowForm(false);
  }

  function handleSuccess() {
    handleCancel();
    router.refresh();
  }

  if (showForm) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Kembali ke Daftar Hero
        </button>

        <HeroForm
          key={editingHero?.id ?? "new"}
          hero={editingHero ?? undefined}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex flex-col gap-4 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <ImageIcon size={25} />
            </span>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Manajemen Hero
              </h1>
              <p className="mt-1 text-sm text-orange-50">
                Kelola banner utama website SBW Digital.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50"
          >
            <Plus size={18} />
            Tambah Hero
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
          <span className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Layers3 size={18} />
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Daftar Hero
            </p>
            <p className="text-xs text-gray-500">
              {heroes.length} data Hero tersimpan
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {heroes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <ImageIcon size={28} />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Belum ada data Hero
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Tambahkan Hero untuk mengelola banner utama yang ditampilkan
            pada website SBW Digital.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
          >
            <Plus size={17} />
            Tambah Hero Pertama
          </button>
        </div>
      ) : (
        <>
          {/* Hero Aktif */}
          <section className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Hero Aktif
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Hero yang sedang digunakan pada halaman utama website.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <CheckCircle2 size={14} />
                {activeHeroes.length} Hero aktif
              </span>
            </div>

            {activeHeroes.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activeHeroes.map((hero) => (
                  <article
                    key={hero.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-green-100 bg-green-50/70 p-4">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-white text-green-700">
                        <ImageIcon size={20} />
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={14} />
                        Aktif
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        {hero.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-500">
                        {hero.description}
                      </p>

                      <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-3.5">
                        <div className="flex items-start gap-2.5">
                          <Video
                            size={16}
                            className="mt-0.5 shrink-0 text-orange-600"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">Video ID</p>
                            <p className="mt-0.5 break-all text-sm font-medium text-gray-700">
                              {hero.videoId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <ExternalLink
                            size={16}
                            className="mt-0.5 shrink-0 text-orange-600"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400">
                              Tombol CTA
                            </p>
                            <p className="mt-0.5 wrap-break-word text-sm font-medium text-gray-700">
                              {hero.ctaText || "Tidak menggunakan CTA"}
                            </p>
                            {hero.ctaUrl && (
                              <p className="mt-1 break-all text-xs text-gray-500">
                                {hero.ctaUrl}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEdit(hero)}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                      >
                        <Pencil size={16} />
                        Edit Hero Aktif
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
                <CircleX className="mx-auto text-gray-400" size={26} />
                <p className="mt-3 text-sm font-semibold text-gray-700">
                  Belum ada Hero aktif
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Edit salah satu Hero yang tidak aktif untuk mengaktifkannya.
                </p>
              </div>
            )}
          </section>

          {/* Hero Tidak Aktif */}
          <section className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Hero Tidak Aktif
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Daftar Hero yang tidak sedang ditampilkan pada halaman utama.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                <CircleX size={14} />
                {inactiveHeroes.length} Hero tidak aktif
              </span>
            </div>

            {inactiveHeroes.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-190 text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-5 py-4 font-semibold text-gray-600">
                          Hero
                        </th>
                        <th className="px-5 py-4 font-semibold text-gray-600">
                          Video ID
                        </th>
                        <th className="px-5 py-4 font-semibold text-gray-600">
                          Tombol CTA
                        </th>
                        <th className="px-5 py-4 font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-5 py-4 text-right font-semibold text-gray-600">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {inactiveHeroes.map((hero) => (
                        <tr
                          key={hero.id}
                          className="transition hover:bg-orange-50/40"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800">
                              {hero.title}
                            </p>
                            <p className="mt-1 max-w-xs whitespace-pre-line text-xs leading-5 text-gray-500">
                              {hero.description || "Tidak ada deskripsi"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span className="block max-w-40 break-all text-gray-600">
                              {hero.videoId || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-700">
                              {hero.ctaText || "-"}
                            </p>
                            {hero.ctaUrl && (
                              <p className="mt-1 max-w-40 break-all text-xs text-gray-500">
                                {hero.ctaUrl}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                              <CircleX size={13} />
                              Tidak Aktif
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleEdit(hero)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
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
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
                <Layers3 className="mx-auto text-gray-400" size={26} />
                <p className="mt-3 text-sm font-semibold text-gray-700">
                  Tidak ada Hero tidak aktif
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Semua Hero yang tersimpan saat ini berstatus aktif.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
