"use client";

import { useState } from "react";

import MembershipForm from "./MembershipForm";

type MembershipMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  altText: string | null;
};

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
  media: MembershipMedia | null;
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

  const [isCreating, setIsCreating] = useState(false);

  const showForm =
    isCreating || editingContent !== null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setEditingContent(null);
          setIsCreating(true);
        }}
      >
        + Tambah Membership
      </button>

      {showForm && (
        <>
          <hr />

          <MembershipForm
            key={editingContent?.id ?? "new"}
            content={editingContent ?? undefined}
            onCancel={() => {
              setEditingContent(null);
              setIsCreating(false);
            }}
          />

          <hr />
        </>
      )}

      {contents.length === 0 ? (
        <p>
          Belum ada informasi membership.
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