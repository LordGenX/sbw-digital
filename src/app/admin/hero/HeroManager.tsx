"use client";

import { useState } from "react";

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

export default function HeroManager({
  heroes,
}: HeroManagerProps) {
  const [editingHero, setEditingHero] =
    useState<HeroData | null>(null);

  console.log("Editing Hero:", editingHero);

  return (
    <>
      <HeroForm
        key={editingHero?.id ?? "new"}
        hero={editingHero ?? undefined}
        onCancel={() => setEditingHero(null)}
      />

      <hr />

      {heroes.length === 0 ? (
        <p>Belum ada data Hero.</p>
      ) : (
        <div>
          {heroes.map((hero) => (
            <article key={hero.id}>
              <h2>{hero.title}</h2>

              <p>{hero.description}</p>

              <p>
                Status:{" "}
                {hero.isActive
                  ? "Aktif"
                  : "Tidak Aktif"}
              </p>

              <p>
                Video ID: {hero.videoId}
              </p>

              <button
                type="button"
                onClick={() =>
                  setEditingHero(hero)
                }
              >
                Edit
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}