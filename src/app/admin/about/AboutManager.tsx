"use client";

import { useState } from "react";

import AboutForm from "./AboutForm";

type AboutData = {
  id: string;
  section:
    | "HISTORY"
    | "VISION_MISSION"
    | "PROFILE"
    | "ORGANIZATION"
    | "ACHIEVEMENT";
  title: string;
  content: string;
  mediaId: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type AboutManagerProps = {
  contents: AboutData[];
};

export default function AboutManager({
  contents,
}: AboutManagerProps) {
  const [editingContent, setEditingContent] =
    useState<AboutData | null>(null);

  const [isCreating, setIsCreating] =
    useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            setEditingContent(null);
            setIsCreating(true);
          }}
        >
          + Tambah About
        </button>
      </div>

      <hr />

      {isCreating && (
        <AboutForm
          key="create"
          onCancel={() => setIsCreating(false)}
          onSuccess={() => setIsCreating(false)}
        />
      )}

      {editingContent && !isCreating && (
        <AboutForm
          key={editingContent.id}
          content={editingContent}
          onCancel={() => setEditingContent(null)}
          onSuccess={() => setEditingContent(null)}
        />
      )}

      {!isCreating && !editingContent && (
        <section>
          <h2>About Content</h2>

          <p>
            Pilih konten About untuk mengeditnya.
          </p>
        </section>
      )}

      <hr />

      {contents.length === 0 ? (
        <p>
          Belum ada konten Tentang SBW.
        </p>
      ) : (
        <div>
          {contents.map((content) => (
            <article key={content.id}>
              <h2>{content.title}</h2>

              <p>
                Section: {content.section}
              </p>

              <p>
                Status: {content.status}
              </p>

              <p>
                Urutan: {content.sortOrder}
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingContent(content);
                }}
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