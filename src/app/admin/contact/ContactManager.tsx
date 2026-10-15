"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Map,
  Pencil,
  ContactRound,
  RefreshCw,
  Globe,
  Share2,
} from "lucide-react";

import {
  getContactInfo,
  type ContactInfoItem,
} from "@/actions/contact.actions";
import ContactForm from "./ContactForm";

function DetailCard({
    icon: Icon,
    title,
    children,
  }: {
    icon: typeof MapPin;
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-orange-200">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Icon size={20} />
          </span>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="mt-4 wrap-break-word text-sm leading-6 text-gray-600">
          {children}
        </div>
      </div>
    );
  }

export default function ContactManager() {
  const [contact, setContact] = useState<ContactInfoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
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
        setError("");
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

  const socialLinks = contact
    ? [
        {
          label: "Instagram",
          url: contact.socialLinks?.instagram,
          icon: Share2,
        },
        {
          label: "Facebook",
          url: contact.socialLinks?.facebook,
          icon: Share2,
        },
        {
          label: "YouTube",
          url: contact.socialLinks?.youtube,
          icon: Share2,
        },
        {
          label: "TikTok",
          url: contact.socialLinks?.tiktok,
          icon: Share2,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
        <RefreshCw size={26} className="animate-spin text-orange-600" />
        <p className="mt-3 text-sm text-gray-500">
          Memuat informasi kontak...
        </p>
      </div>
    );
  }

  if (error && !contact) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5"
      >
        <p className="font-semibold text-red-800">
          Informasi kontak tidak dapat ditampilkan
        </p>
        <p className="mt-1 text-sm text-red-700">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
          <RefreshCw size={15} />
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-orange-700">
            <ContactRound size={18} />
            MANAJEMEN WEBSITE
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Informasi Kontak
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Kelola alamat, nomor kontak, media sosial, dan lokasi SBW Digital.
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Pencil size={16} />
            Edit Informasi
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

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
          {/* Alamat */}
          <section className="overflow-hidden rounded-2xl border border-orange-100 bg-linear-to-r from-orange-50 via-white to-white p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
                <MapPin size={23} />
              </span>

              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900">
                  Alamat Kantor
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {contact.address || "Belum diisi"}
                </p>

                {contact.mapUrl && (
                  <a
                    href={contact.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
                  >
                    <Map size={16} />
                    Buka lokasi di peta
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Detail kontak */}
          <section>
            <h2 className="mb-3 text-base font-bold text-gray-900">
              Detail Kontak
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard icon={Phone} title="Telepon">
                {contact.phone || "Belum diisi"}
              </DetailCard>

              <DetailCard icon={Mail} title="Email">
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-orange-700"
                  >
                    {contact.email}
                  </a>
                ) : (
                  "Belum diisi"
                )}
              </DetailCard>

              <DetailCard icon={MessageCircle} title="WhatsApp">
                {contact.whatsapp || "Belum diisi"}
              </DetailCard>
            </div>
          </section>

          {/* Media sosial */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Globe size={20} />
              </span>

              <div>
                <h2 className="font-bold text-gray-900">Media Sosial</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tautan akun resmi SBW Digital.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {socialLinks.map(({ label, url, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                    <Icon size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {label}
                    </p>

                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-all text-sm text-orange-700 underline-offset-4 hover:underline"
                      >
                        {url}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        Belum diisi
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lokasi */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <MapPin size={20} />
              </span>
              <div>
                <h2 className="font-bold text-gray-900">Koordinat Lokasi</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Informasi koordinat yang tersimpan.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Latitude</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {contact.latitude || "Belum diisi"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Longitude</p>
                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                  {contact.longitude || "Belum diisi"}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}