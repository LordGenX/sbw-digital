"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Pencil,
  ArrowLeft,
  Layers3,
  ImageIcon,
} from "lucide-react";

import ServiceForm from "./ServiceForm";

type ServiceMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

type ServiceData = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  mediaId: string | null;
  media: ServiceMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
};

type ServiceManagerProps = {
  services: ServiceData[];
};

export default function ServiceManager({
  services,
}: ServiceManagerProps) {
  const [editingService, setEditingService] =
    useState<ServiceData | null>(null);

  const router = useRouter();

  function handleEdit(service: ServiceData) {
    setEditingService(service);
  }

  function handleCancel() {
    setEditingService(null);
  }

  function handleSuccess() {
    setEditingService(null);
    router.refresh();
  }

  if (editingService) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          <ArrowLeft size={17} />
          Kembali ke Daftar Layanan
        </button>

        <ServiceForm
          key={editingService.id}
          service={editingService}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex items-center gap-4 bg-linear-to-r from-orange-600 to-orange-500 px-5 py-6 text-white sm:px-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <BriefcaseBusiness size={25} />
          </span>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Manajemen Layanan
            </h1>
            <p className="mt-1 text-sm text-orange-50">
              Kelola informasi layanan SBW Digital.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Layers3 size={19} />
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Daftar Layanan
            </p>
            <p className="text-xs text-gray-500">
              {services.length} layanan tersedia
            </p>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {services.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <BriefcaseBusiness size={28} />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Belum Ada Data Layanan
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Data layanan belum tersedia untuk ditampilkan.
          </p>
        </section>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <BriefcaseBusiness size={20} />
                </span>

                <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  Urutan {service.sortOrder}
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col p-5">
                {service.media ? (
                  <div className="mb-4 flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                      <ImageIcon size={18} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Media layanan
                      </p>
                      <p className="truncate text-sm font-medium text-gray-700">
                        {service.media.fileName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-3 text-sm text-gray-400">
                    <ImageIcon size={17} />
                    Belum ada media
                  </div>
                )}

                <h2 className="wrap-break-word text-base font-bold leading-6 text-gray-900">
                  {service.name}
                </h2>

                <p className="mt-1 break-all text-xs text-gray-400">
                  /{service.slug}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Deskripsi Singkat
                  </p>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-4 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="text-xs font-semibold text-gray-400">
                    Informasi Layanan
                  </p>
                  <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleEdit(service)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  <Pencil size={16} />
                  Edit Layanan
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}