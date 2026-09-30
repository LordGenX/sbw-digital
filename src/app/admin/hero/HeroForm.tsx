"use client";

import { useState } from "react";

import {
  saveHeroSection,
  updateHeroSection,
} from "@/actions/hero.actions";

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

type HeroFormProps = {
  hero?: HeroData;
  onCancel?: () => void;
};

export default function HeroForm({
  hero,
  onCancel,
}: HeroFormProps) {
  const isEditMode = Boolean(hero);

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    setIsPending(true);
    setMessage("");

    const formData = new FormData(form);

    const input = {
      title: String(formData.get("title") ?? ""),
      description: String(
        formData.get("description") ?? "",
      ),
      videoUrl: String(
        formData.get("videoUrl") ?? "",
      ),
      videoId: String(
        formData.get("videoId") ?? "",
      ),
      ctaText:
        String(formData.get("ctaText") ?? "") ||
        undefined,
      ctaUrl:
        String(formData.get("ctaUrl") ?? "") ||
        undefined,
      isActive:
        formData.get("isActive") === "on",
    };

    let result;

    if (hero) {
      result = await updateHeroSection(
        hero.id,
        input,
      );
    } else {
      result = await saveHeroSection(input);
    }

    if (result.success) {
      setMessage(
        hero
          ? "Hero berhasil diperbarui."
          : "Hero berhasil disimpan.",
      );

      if (!hero) {
        form.reset();
      }
    } else {
      setMessage(
        `${result.error.code}: ${result.error.message}`,
      );
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        {isEditMode
          ? "Edit Hero"
          : "Tambah Hero"}
      </h2>

      <div>
        <label htmlFor="title">
          Judul
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={hero?.title ?? ""}
        />
      </div>

      <div>
        <label htmlFor="description">
          Deskripsi
        </label>

        <textarea
          id="description"
          name="description"
          required
          defaultValue={hero?.description ?? ""}
        />
      </div>

      <div>
        <label htmlFor="videoUrl">
          Video URL
        </label>

        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          required
          defaultValue={hero?.videoUrl ?? ""}
        />
      </div>

      <div>
        <label htmlFor="videoId">
          Video ID
        </label>

        <input
          id="videoId"
          name="videoId"
          type="text"
          required
          maxLength={50}
          defaultValue={hero?.videoId ?? ""}
        />
      </div>

      <div>
        <label htmlFor="ctaText">
          CTA Text
        </label>

        <input
          id="ctaText"
          name="ctaText"
          type="text"
          maxLength={100}
          defaultValue={hero?.ctaText ?? ""}
        />
      </div>

      <div>
        <label htmlFor="ctaUrl">
          CTA URL
        </label>

        <input
          id="ctaUrl"
          name="ctaUrl"
          type="url"
          defaultValue={hero?.ctaUrl ?? ""}
        />
      </div>

      <div>
        <label>
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={hero?.isActive ?? false}
          />

          Aktifkan Hero ini
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
      >
        {isPending
          ? "Menyimpan..."
          : isEditMode
            ? "Simpan Perubahan"
            : "Simpan Hero"}
      </button>

      {isEditMode && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
        >
          Batal
        </button>
      )}

      {message && <p>{message}</p>}
    </form>
  );
}