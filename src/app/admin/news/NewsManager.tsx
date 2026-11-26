"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Archive, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, Eye, FilePenLine, FileText, Image as ImageIcon,
  Newspaper, Pencil, Plus, Search, Tag, X,
} from "lucide-react";
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

type NewsManagerProps = { news: NewsData[] };
type NewsStatus = NewsData["status"];
const PAGE_SIZE = 5;

const tabs = [
  { value: "PUBLISHED", label: "Published", Icon: CheckCircle2 },
  { value: "DRAFT", label: "Draft", Icon: FilePenLine },
  { value: "ARCHIVED", label: "Archived", Icon: Archive },
] as const;

function formatDate(date: string | Date | null) {
  if (!date) return "Belum dijadwalkan";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Tanggal tidak valid";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function StatusBadge({ status }: { status: NewsStatus }) {
  const styles: Record<NewsStatus, string> = {
    PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    DRAFT: "border-amber-200 bg-amber-50 text-amber-700",
    ARCHIVED: "border-gray-200 bg-gray-100 text-gray-600",
  };
  const labels: Record<NewsStatus, string> = {
    PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function NewsThumbnail({ item, large = false }: { item: NewsData; large?: boolean }) {
  const image = item.media?.mimeType.startsWith("image/") ? item.media : null;
  const dimensions = large ? "h-52 w-full sm:h-64" : "h-12 w-16";
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${dimensions}`}>
      {image ? (
        <Image
          src={image.fileUrl}
          alt={image.altText || image.fileName}
          fill
          sizes={large ? "(max-width: 640px) 100vw, 640px" : "64px"}
          unoptimized
          className={large ? "object-contain" : "object-cover"}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          {item.media ? <FileText size={large ? 32 : 20} /> : <ImageIcon size={large ? 32 : 20} />}
        </div>
      )}
    </div>
  );
}

function DetailModal({ item, onClose, onEdit }: {
  item: NewsData;
  onClose: () => void;
  onEdit: (item: NewsData) => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="news-detail-title"
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 id="news-detail-title" className="text-lg font-bold text-gray-900">Detail Berita</h2>
            <p className="mt-1 text-sm text-gray-500">Pratinjau informasi berita yang tersimpan</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup detail"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-orange-500">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <NewsThumbnail item={item} large />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            {item.category && <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{item.category}</span>}
          </div>
          <div>
            <h3 className="text-xl font-bold leading-snug text-gray-900">{item.title}</h3>
            <p className="mt-2 break-all text-xs text-gray-500">Slug: {item.slug}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays size={16} /> {formatDate(item.publishedAt)}
            </p>
          </div>
          {item.excerpt && <div><h4 className="mb-2 text-sm font-semibold text-gray-800">Ringkasan</h4><p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">{item.excerpt}</p></div>}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-800">Isi Berita</h4>
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
              {item.content || "Belum ada isi berita."}
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 text-sm">
            <h4 className="font-semibold text-gray-800">Media</h4>
            {item.media ? (
              <a href={item.media.fileUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 block break-all text-orange-700 hover:underline">
                {item.media.fileName} — buka media
              </a>
            ) : <p className="mt-2 text-gray-500">Belum ada media.</p>}
          </div>
          <div className="rounded-xl border border-gray-100 p-4 text-sm">
            <h4 className="font-semibold text-gray-800">Informasi SEO</h4>
            <p className="mt-2 text-gray-600"><span className="font-medium">Meta title:</span> {item.metaTitle || "—"}</p>
            <p className="mt-2 whitespace-pre-wrap text-gray-600"><span className="font-medium">Meta description:</span> {item.metaDescription || "—"}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">Tutup</button>
          <button type="button" onClick={() => onEdit(item)} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"><Pencil size={16} /> Edit Berita</button>
        </div>
      </section>
    </div>
  );
}

export default function NewsManager({ news }: NewsManagerProps) {
  const [editingNews, setEditingNews] = useState<NewsData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<NewsStatus>("PUBLISHED");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const [viewingNews, setViewingNews] = useState<NewsData | null>(null);
  const showForm = isCreating || editingNews !== null;

  const counts = useMemo(() => ({
    PUBLISHED: news.filter((item) => item.status === "PUBLISHED").length,
    DRAFT: news.filter((item) => item.status === "DRAFT").length,
    ARCHIVED: news.filter((item) => item.status === "ARCHIVED").length,
  }), [news]);

  const categories = useMemo(() => Array.from(new Set(
    news.filter((item) => item.status === activeTab).map((item) => item.category?.trim()).filter((value): value is string => Boolean(value))
  )).sort((a, b) => a.localeCompare(b, "id")), [news, activeTab]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    return news.filter((item) => {
      if (item.status !== activeTab) return false;
      if (category !== "ALL" && item.category?.trim() !== category) return false;
      if (!query) return true;
      return [item.title, item.excerpt, item.content, item.slug]
        .some((value) => value?.toLocaleLowerCase("id").includes(query));
    }).sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0)
        || a.title.localeCompare(b.title, "id");
    });
  }, [news, activeTab, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const first = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(first, first + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((number) => number === 1 || number === totalPages || Math.abs(number - currentPage) <= 1);

  function handleCreate() { setEditingNews(null); setViewingNews(null); setIsCreating(true); }
  function handleEdit(item: NewsData) { setIsCreating(false); setViewingNews(null); setEditingNews(item); }
  function handleCancel() { setEditingNews(null); setIsCreating(false); }
  function changeTab(value: NewsStatus) { setActiveTab(value); setSearch(""); setCategory("ALL"); setPage(1); }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <header className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Newspaper size={24} /></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Konten Berita</h1>
                <p className="mt-1 text-sm text-gray-500">Kelola artikel, informasi, dan kegiatan terbaru SBW.</p>
                <p className="mt-2 text-sm font-medium text-gray-700">{news.length} konten terdaftar</p>
              </div>
            </div>
            <button type="button" onClick={handleCreate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
              <Plus size={18} /> Tambah Berita
            </button>
          </header>

          <div className="flex gap-5 overflow-x-auto border-b border-gray-200 sm:gap-8" role="tablist" aria-label="Status berita">
            {tabs.map(({ value, label, Icon }) => (
              <button key={value} type="button" role="tab" aria-selected={activeTab === value}
                onClick={() => changeTab(value)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-sm font-semibold transition ${activeTab === value ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                <Icon size={17} /> {label}
                <span className={`rounded-full border px-2 py-0.5 text-xs ${activeTab === value ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>{counts[value]}</span>
              </button>
            ))}
          </div>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-11 items-center justify-center rounded-xl ${activeTab === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : activeTab === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                  {activeTab === "PUBLISHED" ? <CheckCircle2 size={23} /> : activeTab === "DRAFT" ? <FilePenLine size={23} /> : <Archive size={23} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Berita {tabs.find((tab) => tab.value === activeTab)?.label}</h2>
                  <p className="text-sm text-gray-500">{activeTab === "PUBLISHED" ? "Berita yang ditampilkan pada website." : activeTab === "DRAFT" ? "Berita yang masih dalam proses penyuntingan." : "Berita yang telah diarsipkan."}</p>
                </div>
              </div>
              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{filtered.length} berita ditemukan</span>
            </div>

            <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:p-5 md:flex-row">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari berita</span>
                <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Cari judul atau isi berita..." className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="relative w-full md:w-64">
                <span className="sr-only">Filter kategori</span>
                <Tag size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                  <option value="ALL">Semua Kategori</option>
                  {categories.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
                <ChevronDown size={17} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </label>
            </div>

            {visible.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-237.5 text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600">
                    <tr>
                      <th className="w-14 px-4 py-4 text-center">No.</th>
                      <th className="w-24 px-4 py-4">Thumbnail</th>
                      <th className="px-4 py-4">Judul Berita</th>
                      <th className="w-40 px-4 py-4">Kategori</th>
                      <th className="w-44 px-4 py-4">Tanggal Publikasi</th>
                      <th className="w-28 px-4 py-4">Status</th>
                      <th className="w-44 px-4 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map((item, index) => (
                      <tr key={item.id} className="hover:bg-orange-50/30">
                        <td className="px-4 py-4 text-center text-gray-500">{first + index + 1}</td>
                        <td className="px-4 py-4"><NewsThumbnail item={item} /></td>
                        <td className="max-w-sm px-4 py-4">
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="mt-1 line-clamp-1 text-xs text-gray-500">{item.excerpt || item.slug}</p>
                        </td>
                        <td className="px-4 py-4">{item.category ? <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">{item.category}</span> : <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-4 text-gray-600"><span className="inline-flex items-center gap-2"><CalendarDays size={15} className="shrink-0 text-gray-400" />{formatDate(item.publishedAt)}</span></td>
                        <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                        <td className="px-4 py-4"><div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setViewingNews(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Eye size={15} /> Lihat</button>
                          <button type="button" onClick={() => handleEdit(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50"><Pencil size={15} /> Edit</button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Search size={25} /></div>
                <h3 className="mt-4 font-semibold text-gray-900">{search || category !== "ALL" ? "Berita tidak ditemukan" : "Belum ada berita pada status ini"}</h3>
                <p className="mt-1 text-sm text-gray-500">{search || category !== "ALL" ? "Coba kata kunci atau kategori lain." : "Belum ada data untuk ditampilkan."}</p>
                {(search || category !== "ALL") && <button type="button" onClick={() => { setSearch(""); setCategory("ALL"); setPage(1); }} className="mt-4 text-sm font-semibold text-orange-700 hover:underline">Reset pencarian dan filter</button>}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">Menampilkan <strong className="text-gray-800">{first + 1}–{Math.min(first + PAGE_SIZE, filtered.length)}</strong> dari <strong className="text-gray-800">{filtered.length}</strong> berita</p>
                <nav aria-label="Pagination berita" className="flex flex-wrap items-center gap-1.5">
                  <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Halaman sebelumnya" className="flex size-9 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40"><ChevronLeft size={18} /></button>
                  {pageNumbers.map((number, index) => (
                    <span key={number} className="inline-flex items-center gap-1.5">
                      {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="px-1 text-gray-400">…</span>}
                      <button type="button" aria-label={`Halaman ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => setPage(number)} className={`flex size-9 items-center justify-center rounded-lg border text-sm font-semibold ${number === currentPage ? "border-orange-600 bg-orange-600 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{number}</button>
                    </span>
                  ))}
                  <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="Halaman berikutnya" className="flex size-9 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40"><ChevronRight size={18} /></button>
                </nav>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-5 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">{editingNews ? "Edit Berita" : "Tambah Berita"}</h2>
            <p className="mt-1 text-sm text-gray-500">{editingNews ? "Perbarui informasi berita yang dipilih." : "Isi informasi untuk membuat berita baru."}</p>
          </div>
          <NewsForm key={editingNews?.id ?? "new"} news={editingNews ?? undefined} onCancel={handleCancel} />
        </section>
      )}
      {viewingNews && <DetailModal item={viewingNews} onClose={() => setViewingNews(null)} onEdit={handleEdit} />}
    </div>
  );
}