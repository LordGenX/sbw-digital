"use client";

import { useState } from "react";

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

  return (
    <>
      <ServiceForm
        key={editingService?.id ?? "empty"}
        service={editingService ?? undefined}
        onCancel={() => setEditingService(null)}
      />

      <hr />

      {services.length === 0 ? (
        <p>Belum ada data layanan.</p>
      ) : (
        <div>
          {services.map((service) => (
            <article key={service.id}>
              <h2>{service.name}</h2>

              <p>
                Slug: {service.slug}
              </p>

              <p>
                {service.shortDescription}
              </p>

              <p>
                Status:{" "}
                {service.status}
              </p>

              <p>
                Urutan:{" "}
                {service.sortOrder}
              </p>

              <button
                type="button"
                onClick={() =>
                  setEditingService(service)
                }
              >
                Edit
              </button>

              <hr />
            </article>
          ))}
        </div>
      )}
    </>
  );
}