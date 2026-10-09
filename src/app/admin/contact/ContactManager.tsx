"use client";

import { useEffect, useState } from "react";
import {
  getContactInfo,
  type ContactInfoItem,
} from "@/actions/contact.actions";
import ContactForm from "./ContactForm";

export default function ContactManager() {
  const [contact, setContact] = useState<ContactInfoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
      setLoading(true);
      setError("");

      try {
        const result = await getContactInfo();

        if (cancelled) return;

        if (!result.success) {
          setError(result.error.message);
          return;
        }

        if (!result.data) {
          setError(
            "Data kontak belum tersedia. Pastikan data ContactInfo sudah dimasukkan ke database.",
          );
          return;
        }

        setContact(result.data);
      } catch {
        if (!cancelled) {
          setError("Terjadi kesalahan saat mengambil data kontak.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadContact();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Memuat informasi kontak...
      </div>
    );
  }

  if (error && !contact) {
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

  if (!contact) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Informasi Kontak
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola alamat, nomor kontak, media sosial, dan lokasi SBW Digital.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Edit Informasi
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
          <ContactForm
            key={contact.id}
            contact={contact}
            onCancel={() => setEditing(false)}
            onSuccess={(updatedContact) => {
              setContact(updatedContact);
              setEditing(false);
              setError("");
            }}
          />
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Alamat
              </h2>
              <p className="mt-1 whitespace-pre-line">{contact.address}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Telepon
                </h2>
                <p className="mt-1">{contact.phone || "Belum diisi"}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Email
                </h2>
                <p className="mt-1">{contact.email || "Belum diisi"}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  WhatsApp
                </h2>
                <p className="mt-1">{contact.whatsapp || "Belum diisi"}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  URL Peta
                </h2>
                {contact.mapUrl ? (
                  <a
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-primary underline"
                  >
                    Buka Peta
                  </a>
                ) : (
                  <p className="mt-1">Belum diisi</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Media Sosial
              </h2>

              <div className="mt-2 space-y-2">
                {(
                  [
                    ["Instagram", contact.socialLinks?.instagram],
                    ["Facebook", contact.socialLinks?.facebook],
                    ["YouTube", contact.socialLinks?.youtube],
                    ["TikTok", contact.socialLinks?.tiktok],
                  ] as const
                ).map(([label, url]) => (
                  <div
                    key={label}
                    className="grid gap-1 sm:grid-cols-[120px_1fr]"
                  >
                    <span className="text-sm">{label}</span>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-sm text-primary underline"
                      >
                        {url}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Belum diisi
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Koordinat
              </h2>
              <p className="mt-1">
                {contact.latitude && contact.longitude
                  ? `${contact.latitude}, ${contact.longitude}`
                  : "Belum diisi"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}