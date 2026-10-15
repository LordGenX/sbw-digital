"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Globe,
  Save,
  X,
  LoaderCircle,
  ContactRound,
} from "lucide-react";

import type { ContactInfoItem } from "@/actions/contact.actions";
import { updateContactInfo } from "@/actions/contact.actions";

type ContactFormProps = {
  contact: ContactInfoItem;
  onCancel: () => void;
  onSuccess: (contact: ContactInfoItem) => void;
};

type ContactFormData = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  latitude: string;
  longitude: string;
  mapUrl: string;
};

function getFormData(contact: ContactInfoItem): ContactFormData {
  return {
    address: contact.address,
    phone: contact.phone ?? "",
    email: contact.email ?? "",
    whatsapp: contact.whatsapp ?? "",
    instagram: contact.socialLinks?.instagram ?? "",
    facebook: contact.socialLinks?.facebook ?? "",
    youtube: contact.socialLinks?.youtube ?? "",
    tiktok: contact.socialLinks?.tiktok ?? "",
    latitude: contact.latitude ?? "",
    longitude: contact.longitude ?? "",
    mapUrl: contact.mapUrl ?? "",
  };
}

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-medium text-gray-700";

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-start gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <Icon size={20} />
        </span>

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function ContactForm({
  contact,
  onCancel,
  onSuccess,
}: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>(() =>
    getFormData(contact),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof ContactFormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await updateContactInfo(contact.id, {
        address: form.address,
        phone: form.phone,
        email: form.email,
        whatsapp: form.whatsapp,
        socialLinks: {
          instagram: form.instagram,
          facebook: form.facebook,
          youtube: form.youtube,
          tiktok: form.tiktok,
        },
        latitude: form.latitude,
        longitude: form.longitude,
        mapUrl: form.mapUrl,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      onSuccess(result.data);
    } catch {
      setError(
        "Terjadi kesalahan saat menyimpan informasi kontak.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex flex-col gap-4 bg-linear-to-r from-orange-600 to-orange-500 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <ContactRound size={25} />
            </span>

            <div>
              <h2 className="text-lg font-bold">
                Edit Informasi Kontak
              </h2>
              <p className="mt-1 text-sm text-orange-50">
                Perbarui informasi resmi SBW Digital.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium">
            Pengaturan Website
          </span>
        </div>

        <div className="flex items-start gap-2.5 px-5 py-4 sm:px-6">
          <span className="mt-0.5 text-orange-600">
            <Globe size={18} />
          </span>
          <p className="text-sm leading-6 text-gray-600">
            Data yang disimpan digunakan untuk menampilkan alamat,
            informasi komunikasi, media sosial, dan lokasi pada
            website.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      {/* Contact information */}
      <FormSection
        icon={Phone}
        title="Informasi Kontak"
        description="Alamat dan saluran komunikasi resmi."
      >
        <div>
          <label htmlFor="address" className={labelClassName}>
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            required
            rows={4}
            maxLength={5000}
            value={form.address}
            onChange={(event) =>
              handleChange("address", event.target.value)
            }
            className={`${inputClassName} resize-y`}
            placeholder="Masukkan alamat lengkap..."
            disabled={loading}
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Maksimal 5.000 karakter.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClassName}>
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="phone"
                type="tel"
                maxLength={50}
                value={form.phone}
                onChange={(event) =>
                  handleChange("phone", event.target.value)
                }
                className={`${inputClassName} pl-10`}
                placeholder="Contoh: 0341..."
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Alamat Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="email"
                type="email"
                maxLength={150}
                value={form.email}
                onChange={(event) =>
                  handleChange("email", event.target.value)
                }
                className={`${inputClassName} pl-10`}
                placeholder="nama@domain.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="whatsapp" className={labelClassName}>
              Nomor WhatsApp
            </label>
            <div className="relative">
              <MessageCircle
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="whatsapp"
                type="tel"
                maxLength={50}
                value={form.whatsapp}
                onChange={(event) =>
                  handleChange("whatsapp", event.target.value)
                }
                className={`${inputClassName} pl-10`}
                placeholder="Masukkan nomor WhatsApp..."
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Social media */}
      <FormSection
        icon={Share2}
        title="Media Sosial"
        description="Masukkan URL profil resmi media sosial."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {(
            [
              ["instagram", "Instagram"],
              ["facebook", "Facebook"],
              ["youtube", "YouTube"],
              ["tiktok", "TikTok"],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label htmlFor={field} className={labelClassName}>
                {label}
              </label>

              <div className="relative">
                <Share2
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id={field}
                  type="url"
                  value={form[field]}
                  onChange={(event) =>
                    handleChange(field, event.target.value)
                  }
                  className={`${inputClassName} pl-10`}
                  placeholder={`https://...`}
                  disabled={loading}
                />
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      {/* Location */}
      <FormSection
        icon={MapPin}
        title="Lokasi dan Peta"
        description="Koordinat geografis dan tautan peta kantor."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="latitude" className={labelClassName}>
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              value={form.latitude}
              onChange={(event) =>
                handleChange("latitude", event.target.value)
              }
              className={inputClassName}
              placeholder="Contoh: -7.98..."
              disabled={loading}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Rentang nilai: -90 hingga 90.
            </p>
          </div>

          <div>
            <label htmlFor="longitude" className={labelClassName}>
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              value={form.longitude}
              onChange={(event) =>
                handleChange("longitude", event.target.value)
              }
              className={inputClassName}
              placeholder="Contoh: 112.62..."
              disabled={loading}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Rentang nilai: -180 hingga 180.
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="mapUrl" className={labelClassName}>
              URL Peta
            </label>
            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="mapUrl"
                type="url"
                value={form.mapUrl}
                onChange={(event) =>
                  handleChange("mapUrl", event.target.value)
                }
                className={`${inputClassName} pl-10`}
                placeholder="https://maps.google.com/?q=..."
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Actions */}
      <div className="sticky bottom-0 z-10 -mx-1 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white/95 px-1 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={17} />
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save size={17} />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </form>
  );
}