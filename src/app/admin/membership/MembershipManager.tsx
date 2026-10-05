"use client";

import { useState } from "react";

import MembershipForm from "./MembershipForm";

type MembershipData = {
  id: string;
  section:
    | "WHY_JOIN"
    | "BENEFIT"
    | "REQUIREMENT"
    | "HOW_TO_REGISTER"
    | "FAQ";
  title: string;
  content: string;
  mediaId: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

type MembershipManagerProps = {
  contents: MembershipData[];
};

export default function MembershipManager({
  contents,
}: MembershipManagerProps) {
  const [editingContent, setEditingContent] =
    useState<MembershipData | null>(null);

  return (
    <>
      <MembershipForm
        key={editingContent?.id ?? "new"}
        content={editingContent ?? undefined}
        onCancel={() => setEditingContent(null)}
      />

      <hr />

      {contents.length === 0 ? (
        <p>Belum ada konten informasi keanggotaan.</p>
      ) : (
        <div>
          {contents.map((content) => (
            <article key={content.id}>
              <h2>{content.title}</h2>

              <p>
                Section:{" "}
                {content.section}
              </p>

              <p>
                Status:{" "}
                {content.status}
              </p>

              <p>
                Urutan:{" "}
                {content.sortOrder}
              </p>

              <button
                type="button"
                onClick={() =>
                  setEditingContent(content)
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