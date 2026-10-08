"use client";

import { useState } from "react";

import NewsForm from "./NewsForm";

type NewsMedia = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: bigint;
  altText: string | null;
};

type NewsData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: string | Date | null;
  category: string | null;
  mediaId: string | null;
  media: NewsMedia | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  metaTitle: string | null;
  metaDescription: string | null;
};

type NewsManagerProps = {
  news: NewsData[];
};

export default function NewsManager({
  news,
}: NewsManagerProps) {
  const [editingNews, setEditingNews] =
    useState<NewsData | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  const showForm = isCreating || editingNews !== null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setEditingNews(null);
          setIsCreating(true);
        }}
      >
        + Tambah Berita
      </button>

      {showForm && (
        <>
          <hr />

          <NewsForm
            key={editingNews?.id ?? "new"}
            news={editingNews ?? undefined}
            onCancel={() => {
              setEditingNews(null);
              setIsCreating(false);
            }}
          />

          <hr />
        </>
      )}

      {news.length === 0 ? (
        <p>
          Belum ada berita.
        </p>
      ) : (
        <div>
          {news.map((item) => (
            <article key={item.id}>
              <h2>{item.title}</h2>

              <p>
                Slug: {item.slug}
              </p>

              <p>
                Status: {item.status}
              </p>

              {item.category && (
                <p>
                  Kategori: {item.category}
                </p>
              )}

              {item.publishedAt && (
                <p>
                  Publikasi:{" "}
                  {new Date(
                    item.publishedAt,
                  ).toLocaleString("id-ID")}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingNews(item);
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