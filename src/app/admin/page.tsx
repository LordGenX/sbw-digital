import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Archive,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Image as ImageIcon,
  Layers3,
  Newspaper,
  PencilLine,
  Phone,
  Settings,
  Users,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

const quickLinks = [
  { title: "Berita", description: "Kelola berita terbaru di website.", href: "/admin/news", icon: Newspaper },
  { title: "Agenda", description: "Kelola acara dan agenda kegiatan.", href: "/admin/events", icon: CalendarDays },
  { title: "Layanan", description: "Kelola informasi layanan koperasi.", href: "/admin/services", icon: BriefcaseBusiness },
  { title: "Media", description: "Kelola gambar dan media konten.", href: "/admin/media", icon: ImageIcon },
  { title: "Statistics", description: "Kelola angka ringkasan website publik.", href: "/admin/statistics", icon: Activity },
  { title: "Informasi Kontak", description: "Perbarui informasi kontak website.", href: "/admin/contact", icon: Phone },
  { title: "Hero", description: "Kelola bagian utama halaman depan.", href: "/admin/hero", icon: ImageIcon },
  { title: "About", description: "Kelola profil dan informasi koperasi.", href: "/admin/about", icon: FileText },
  { title: "Membership", description: "Kelola informasi keanggotaan.", href: "/admin/membership", icon: Users },
  { title: "Site Settings", description: "Kelola identitas dasar website.", href: "/admin/site-settings", icon: Settings },
] as const;

type ContentStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

type RecentContent = {
  id: string;
  title: string;
  module: string;
  status: ContentStatus;
  updatedAt: Date;
  href: string;
};

const statusConfig: Record<ContentStatus, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-green-50 text-green-700 ring-green-200" },
  DRAFT: { label: "Draft", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  ARCHIVED: { label: "Archived", className: "bg-gray-100 text-gray-600 ring-gray-200" },
};

function getStatusCount(
  rows: Array<{ status: string; _count: { _all: number } }>,
  status: ContentStatus,
) {
  return rows.find((row) => row.status === status)?._count._all ?? 0;
}

function formatUpdatedAt(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

function formatEventDate(value: Date) {
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "2-digit", timeZone: "Asia/Jakarta" }).format(value),
    month: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "Asia/Jakarta" }).format(value),
    time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(value),
  };
}

export default async function AdminPage() {
  const now = new Date();

  const [
    aboutGroups, serviceGroups, membershipGroups, newsGroups, eventGroups,
    aboutRecent, serviceRecent, membershipRecent, newsRecent, eventRecent,
    upcomingEvents,
  ] = await Promise.all([
    prisma.aboutContent.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.service.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.membershipInfo.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.news.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.event.groupBy({ by: ["status"], _count: { _all: true } }),

    prisma.aboutContent.findMany({
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.service.findMany({
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, name: true, status: true, updatedAt: true },
    }),
    prisma.membershipInfo.findMany({
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.news.findMany({
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
    prisma.event.findMany({
      orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),

    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      take: 3,
      select: { id: true, title: true, location: true, startAt: true, endAt: true },
    }),
  ]);

  const statusTotals = {
    PUBLISHED:
      getStatusCount(aboutGroups, "PUBLISHED") +
      getStatusCount(serviceGroups, "PUBLISHED") +
      getStatusCount(membershipGroups, "PUBLISHED") +
      getStatusCount(newsGroups, "PUBLISHED") +
      getStatusCount(eventGroups, "PUBLISHED"),
    DRAFT:
      getStatusCount(aboutGroups, "DRAFT") +
      getStatusCount(serviceGroups, "DRAFT") +
      getStatusCount(membershipGroups, "DRAFT") +
      getStatusCount(newsGroups, "DRAFT") +
      getStatusCount(eventGroups, "DRAFT"),
    ARCHIVED:
      getStatusCount(aboutGroups, "ARCHIVED") +
      getStatusCount(serviceGroups, "ARCHIVED") +
      getStatusCount(membershipGroups, "ARCHIVED") +
      getStatusCount(newsGroups, "ARCHIVED") +
      getStatusCount(eventGroups, "ARCHIVED"),
  };

  const totalContent = statusTotals.PUBLISHED + statusTotals.DRAFT + statusTotals.ARCHIVED;

  const moduleStats = [
    { name: "About", href: "/admin/about", published: getStatusCount(aboutGroups, "PUBLISHED"), draft: getStatusCount(aboutGroups, "DRAFT"), archived: getStatusCount(aboutGroups, "ARCHIVED") },
    { name: "Service", href: "/admin/services", published: getStatusCount(serviceGroups, "PUBLISHED"), draft: getStatusCount(serviceGroups, "DRAFT"), archived: getStatusCount(serviceGroups, "ARCHIVED") },
    { name: "Membership", href: "/admin/membership", published: getStatusCount(membershipGroups, "PUBLISHED"), draft: getStatusCount(membershipGroups, "DRAFT"), archived: getStatusCount(membershipGroups, "ARCHIVED") },
    { name: "News", href: "/admin/news", published: getStatusCount(newsGroups, "PUBLISHED"), draft: getStatusCount(newsGroups, "DRAFT"), archived: getStatusCount(newsGroups, "ARCHIVED") },
    { name: "Event", href: "/admin/events", published: getStatusCount(eventGroups, "PUBLISHED"), draft: getStatusCount(eventGroups, "DRAFT"), archived: getStatusCount(eventGroups, "ARCHIVED") },
  ];

  const maxModuleTotal = Math.max(
    1,
    ...moduleStats.map((item) => item.published + item.draft + item.archived),
  );

  const recentContent: RecentContent[] = [
    ...aboutRecent.map((item) => ({ id: item.id, title: item.title, module: "About", status: item.status, updatedAt: item.updatedAt, href: "/admin/about" })),
    ...serviceRecent.map((item) => ({ id: item.id, title: item.name, module: "Service", status: item.status, updatedAt: item.updatedAt, href: "/admin/services" })),
    ...membershipRecent.map((item) => ({ id: item.id, title: item.title, module: "Membership", status: item.status, updatedAt: item.updatedAt, href: "/admin/membership" })),
    ...newsRecent.map((item) => ({ id: item.id, title: item.title, module: "News", status: item.status, updatedAt: item.updatedAt, href: "/admin/news" })),
    ...eventRecent.map((item) => ({ id: item.id, title: item.title, module: "Event", status: item.status, updatedAt: item.updatedAt, href: "/admin/events" })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

  const statCards = [
    { label: "Total Konten", value: totalContent, icon: Layers3, iconClass: "bg-orange-50 text-orange-700", note: "5 modul konten" },
    { label: "Published", value: statusTotals.PUBLISHED, icon: CheckCircle2, iconClass: "bg-green-50 text-green-700", note: "Aktif di website" },
    { label: "Draft", value: statusTotals.DRAFT, icon: PencilLine, iconClass: "bg-amber-50 text-amber-700", note: "Menunggu publikasi" },
    { label: "Archived", value: statusTotals.ARCHIVED, icon: Archive, iconClass: "bg-gray-100 text-gray-600", note: "Tidak aktif" },
  ];

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl border border-orange-100 bg-linear-to-r from-orange-50 via-orange-50 to-amber-100/70 px-6 py-7 sm:px-8 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 -z-10 size-72 rounded-full bg-orange-200/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-40 -z-10 size-40 rounded-full bg-amber-200/40 blur-2xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-orange-700 sm:text-sm">SBW DIGITAL</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl">
            Selamat Datang, Administrator!
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Kelola seluruh konten, informasi, dan kegiatan Koperasi Setia Budi Wanita melalui satu panel yang mudah dan terpadu.
          </p>
        </div>
        <div className="absolute bottom-6 right-8 hidden size-14 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-2xl font-bold text-orange-600 shadow-sm lg:flex">S</div>
      </section>

      <section aria-labelledby="dashboard-stats-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 id="dashboard-stats-heading" className="text-base font-bold text-gray-900">Ringkasan Konten</h2>
            <p className="mt-0.5 text-sm text-gray-500">Kondisi konten dari seluruh modul utama.</p>
          </div>
          <span className="hidden text-xs text-gray-400 sm:inline">Data terkini</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-100 hover:shadow-md sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-950 tabular-nums">{card.value.toLocaleString("id-ID")}</p>
                    <p className="mt-1 text-xs text-gray-500">{card.note}</p>
                  </div>
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}>
                    <Icon size={21} strokeWidth={1.9} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Activity size={20} /></span>
              <div>
                <h2 className="font-bold text-gray-900">Distribusi Konten per Modul</h2>
                <p className="mt-0.5 text-xs text-gray-500">Perbandingan status pada lima modul konten.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 sm:pt-1">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-green-500" />Published</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-400" />Draft</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-gray-300" />Archived</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {moduleStats.map((item) => {
              const total = item.published + item.draft + item.archived;
              return (
                <Link key={item.name} href={item.href} className="group grid grid-cols-[88px_1fr_34px] items-center gap-3 rounded-lg py-1 transition hover:bg-orange-50/50 sm:grid-cols-[104px_1fr_40px]">
                  <span className="truncate text-xs font-semibold text-gray-600 group-hover:text-orange-700 sm:text-sm">{item.name}</span>
                  <span className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                    {total > 0 && <>
                      <span className="h-full bg-green-500 transition-all" style={{ width: `${(item.published / maxModuleTotal) * 100}%` }} />
                      <span className="h-full bg-amber-400 transition-all" style={{ width: `${(item.draft / maxModuleTotal) * 100}%` }} />
                      <span className="h-full bg-gray-300 transition-all" style={{ width: `${(item.archived / maxModuleTotal) * 100}%` }} />
                    </>}
                  </span>
                  <span className="text-right text-xs font-semibold tabular-nums text-gray-600">{total}</span>
                </Link>
              );
            })}
          </div>
          <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">Jumlah di samping menunjukkan total record pada setiap modul.</p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><CalendarDays size={20} /></span>
              <div>
                <h2 className="font-bold text-gray-900">Agenda Mendatang</h2>
                <p className="mt-0.5 text-xs text-gray-500">Agenda Published yang akan berlangsung.</p>
              </div>
            </div>
            <Link href="/admin/events" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-orange-700 transition hover:text-orange-800">Lihat semua <ArrowUpRight size={14} /></Link>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="mt-4 divide-y divide-gray-100">
              {upcomingEvents.map((event) => {
                const date = formatEventDate(event.startAt);
                return (
                  <Link key={event.id} href="/admin/events" className="group flex gap-3 py-4 first:pt-1 last:pb-1">
                    <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                      <span className="text-lg font-bold leading-5">{date.day}</span>
                      <span className="text-[11px] font-semibold uppercase">{date.month}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block line-clamp-2 text-sm font-semibold text-gray-900 transition group-hover:text-orange-700">{event.title}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><Clock3 size={13} />{date.time}</span>
                        {event.location && <span className="inline-flex min-w-0 items-center gap-1"><ImageIcon size={13} /><span className="truncate">{event.location}</span></span>}
                      </span>
                    </span>
                    <ArrowRight size={16} className="mt-1 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-600" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 text-center">
              <CalendarDays size={25} className="text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-gray-700">Belum ada agenda mendatang</p>
              <p className="mt-1 text-xs text-gray-500">Agenda Published berikutnya akan muncul di sini.</p>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Clock3 size={20} /></span>
              <div>
                <h2 className="font-bold text-gray-900">Konten Terbaru</h2>
                <p className="mt-0.5 text-xs text-gray-500">Lima konten dengan pembaruan terakhir.</p>
              </div>
            </div>
          </div>
          {recentContent.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-140 text-left text-sm">
                  <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    <tr><th className="px-5 py-3">Judul Konten</th><th className="px-4 py-3">Modul</th><th className="px-4 py-3">Status</th><th className="px-5 py-3">Terakhir Diperbarui</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentContent.map((item) => {
                      const status = statusConfig[item.status];
                      return (
                        <tr key={`${item.module}-${item.id}`} className="transition hover:bg-orange-50/40">
                          <td className="max-w-65 px-5 py-3"><Link href={item.href} className="line-clamp-2 font-semibold text-gray-800 hover:text-orange-700">{item.title}</Link></td>
                          <td className="px-4 py-3"><span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{item.module}</span></td>
                          <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${status.className}`}>{status.label}</span></td>
                          <td className="whitespace-nowrap px-5 py-3 text-xs text-gray-500">{formatUpdatedAt(item.updatedAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-100 px-5 py-3 text-right"><span className="text-xs text-gray-400">Diurutkan berdasarkan waktu pembaruan terbaru</span></div>
            </>
          ) : (
            <div className="flex min-h-44 flex-col items-center justify-center px-5 text-center">
              <FileText size={26} className="text-gray-300" />
              <p className="mt-2 text-sm font-semibold text-gray-700">Belum ada konten</p>
              <p className="mt-1 text-xs text-gray-500">Konten yang dibuat atau diperbarui akan muncul di sini.</p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Zap size={20} /></span>
            <div>
              <h2 className="font-bold text-gray-900">Akses Cepat</h2>
              <p className="mt-0.5 text-xs text-gray-500">Pintasan ke modul pengelolaan.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} title={item.description} className="group flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 transition hover:border-orange-200 hover:bg-orange-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700 transition group-hover:bg-orange-100"><Icon size={16} strokeWidth={1.9} /></span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-700 group-hover:text-orange-700 sm:text-sm">{item.title}</span>
                  <ArrowRight size={14} className="shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-orange-600" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}