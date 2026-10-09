"use client";

import { useState } from "react";
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
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(
    field: keyof ContactFormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccessMessage("");

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
      setSuccessMessage("Informasi kontak berhasil diperbarui.");
    } catch {
      setError("Terjadi kesalahan saat menyimpan informasi kontak.");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const labelClassName = "mb-1.5 block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Informasi Kontak</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Perbarui informasi kontak yang ditampilkan pada website.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm"
        >
          {successMessage}
        </div>
      )}

      <div>
        <label htmlFor="address" className={labelClassName}>
          Alamat <span className="text-destructive">*</span>
        </label>
        <textarea
          id="address"
          required
          rows={3}
          maxLength={5000}
          value={form.address}
          onChange={(event) => handleChange("address", event.target.value)}
          className={inputClassName}
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="tel"
            maxLength={50}
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            className={inputClassName}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            maxLength={150}
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className={inputClassName}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClassName}>
            Nomor WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            maxLength={50}
            value={form.whatsapp}
            onChange={(event) => handleChange("whatsapp", event.target.value)}
            className={inputClassName}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">Media Sosial</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Isi dengan URL profil resmi masing-masing media sosial.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
              <input
                id={field}
                type="url"
                value={form[field]}
                onChange={(event) => handleChange(field, event.target.value)}
                className={inputClassName}
                disabled={loading}
                placeholder={`https://${label.toLowerCase()}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">Lokasi dan Peta</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Koordinat bersifat opsional. Latitude antara -90 dan 90, longitude
            antara -180 dan 180.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
              onChange={(event) => handleChange("latitude", event.target.value)}
              className={inputClassName}
              disabled={loading}
            />
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
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="mapUrl" className={labelClassName}>
              URL Peta
            </label>
            <input
              id="mapUrl"
              type="url"
              value={form.mapUrl}
              onChange={(event) => handleChange("mapUrl", event.target.value)}
              className={inputClassName}
              disabled={loading}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}