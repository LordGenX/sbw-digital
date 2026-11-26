"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import ScrollReveal from "@/components/public/ScrollReveal";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  HandCoins,
  Image as ImageIcon,
  Maximize2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  UsersRound,
  X,
} from "lucide-react";

type AboutOrganizationData = {
  title: string;
  content: string;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
} | null;

type AboutOrganizationProps = {
  data: AboutOrganizationData;
};

type NodeProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  primary?: boolean;
  className?: string;
};

function OrganizationNode({
  title,
  subtitle,
  icon,
  primary = false,
  className = "",
}: NodeProps) {
  return (
    <div
      className={`relative z-10 flex min-h-18 items-center gap-3 rounded-2xl border px-3 py-3 shadow-sm sm:min-h-20.5 sm:px-5 ${
        primary
          ? "border-orange-500 bg-linear-to-r from-orange-500 to-orange-600 text-white"
          : "border-orange-200 bg-linear-to-r from-orange-50 to-white text-neutral-900"
      } ${className}`}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12 ${
          primary
            ? "bg-white/20 text-white"
            : "bg-orange-500 text-white"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-xs font-bold leading-5 sm:text-sm">
          {title}
        </h3>

        {subtitle && (
          <p
            className={`mt-0.5 text-[10px] leading-4 sm:text-xs ${
              primary ? "text-orange-50" : "text-neutral-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

const units = [
  { title: "UNIT", icon: <ShoppingCart size={21} /> },
  { title: "UNIT", icon: <HandCoins size={21} /> },
  { title: "UNIT", icon: <FileText size={21} /> },
  { title: "UNIT", icon: <BookOpen size={21} /> },
];

function LegendLine({
  type,
  label,
}: {
  type: "authority" | "coordination" | "supervision" | "service";
  label: string;
}) {
  const lineStyle: Record<typeof type, string> = {
    authority: "border-orange-500",
    coordination: "border-dotted border-neutral-500",
    supervision: "border-dashed border-neutral-600",
    service: "border-dashed border-orange-500",
  };

  return (
    <div className="flex items-center gap-3 text-xs leading-5 text-neutral-500">
      <span className="relative flex w-11 shrink-0 items-center">
        <span className={`block w-full border-t-2 ${lineStyle[type]}`} />

        {type === "authority" && (
          <ArrowRight
            size={13}
            className="absolute -right-1 text-orange-500"
          />
        )}
      </span>

      <span>{label}</span>
    </div>
  );
}

export default function AboutOrganization({
  data,
}: AboutOrganizationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const title = data?.title || "Struktur Organisasi SBW";

  const description =
    data?.content?.trim() ||
    "Struktur organisasi Koperasi Konsumen Setia Budi Wanita menggambarkan hubungan wewenang, koordinasi, kepengawasan, dan pelayanan dalam menjalankan kegiatan koperasi.";

  const imageUrl = data?.media?.fileUrl;
  const imageAlt =
    data?.media?.altText || "Bagan lengkap struktur organisasi SBW";

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }

      if (event.key === "+" || event.key === "=") {
        setZoom((current) => Math.min(3, current + 0.25));
      }

      if (event.key === "-") {
        setZoom((current) => Math.max(0.5, current - 0.25));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const modal =
    isModalOpen && imageUrl && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-neutral-950/80 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Bagan lengkap struktur organisasi"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <div className="flex h-[90dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header modal */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-neutral-900 sm:text-base">
                    Bagan Lengkap Struktur Organisasi
                  </h3>

                  <p className="mt-0.5 text-xs text-neutral-500">
                    Perbesar gambar untuk membaca detail.
                  </p>
                </div>

                {/* Kontrol zoom */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((current) =>
                        Math.max(0.5, current - 0.25)
                      )
                    }
                    disabled={zoom <= 0.5}
                    aria-label="Perkecil gambar"
                    className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-12 text-center text-xs font-medium text-neutral-600">
                    {Math.round(zoom * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setZoom((current) =>
                        Math.min(3, current + 0.25)
                      )
                    }
                    disabled={zoom >= 3}
                    aria-label="Perbesar gambar"
                    className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40"
                  >
                    <Plus size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    aria-label="Reset zoom"
                    className="ml-1 hidden size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 sm:flex"
                  >
                    <Maximize2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Tutup bagan"
                    className="ml-1 flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              {/* Area gambar yang bisa di-scroll */}
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-neutral-100 p-3 sm:p-5">
                <div
                  className="relative mx-auto"
                  style={{
                    width: `${zoom * 100}%`,
                    maxWidth: zoom <= 1 ? "100%" : "none",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={1800}
                    height={1200}
                    unoptimized
                    className="block h-auto w-full rounded-lg bg-white object-contain shadow-sm"
                    priority
                  />
                </div>
              </div>

              {/* Footer modal */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500 sm:px-5">
                <span>Tekan Esc untuk menutup.</span>
                <span>Zoom: 50%–300%</span>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <section
        id="struktur-organisasi"
        className="relative isolate overflow-hidden bg-[#FFFCF8] px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        {/* Dekorasi latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full border-35 border-orange-100/60"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-64 rounded-full border-30 border-orange-100/50"
        />

        <div className="mx-auto max-w-360">
          {/* Heading */}
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-orange-600 sm:text-xs">
                Struktur Organisasi
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                {title}
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                {description}
              </p>
            </div>
          </ScrollReveal>

          {/* Bagan, legenda, dan tombol */}
          <ScrollReveal direction="up" delay={150}>
            <div className="mx-auto mt-10 max-w-330 rounded-3xl border border-neutral-200/80 bg-white/90 p-4 shadow-[0_12px_50px_rgba(15,23,42,0.06)] sm:mt-12 sm:p-6 lg:p-8">
              <div className="overflow-x-auto pb-3">
                <div className="relative mx-auto min-w-170 max-w-275">
                  <div className="relative aspect-1.5/1 min-h-117.5 w-full sm:min-h-145">
                    {/* Garis hubungan organisasi */}
                    <svg
                      viewBox="0 0 1000 650"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
                      aria-hidden="true"
                    >
                      <defs>
                        <marker
                          id="org-arrow-orange"
                          markerWidth="7"
                          markerHeight="7"
                          refX="5"
                          refY="3.5"
                          orient="auto"
                          markerUnits="userSpaceOnUse"
                        >
                          <path
                            d="M0,0 L7,3.5 L0,7 Z"
                            fill="#EA580C"
                          />
                        </marker>
                      </defs>

                      {/* Rapat Anggota ke Pengurus dan Pengawas */}
                      <path
                        d="M500 92 V130 H250 V145"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      <path
                        d="M500 130 H750 V145"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      {/* Koordinasi Pengurus dan Pengawas */}
                      <path
                        d="M390 190 H610"
                        fill="none"
                        stroke="#64748B"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Pengurus ke PPL */}
                      <path
                        d="M250 220 V280"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      {/* Pengurus ke Manajemen Usaha */}
                      <path
                        d="M250 226 V248 H680 V280"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      {/* Koordinasi PPL dengan Manajemen Usaha */}
                      <path
                        d="M365 320 H535"
                        fill="none"
                        stroke="#64748B"
                        strokeWidth="2"
                        strokeDasharray="2 4"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Manajemen Usaha ke empat unit */}
                      <path
                        d="M680 356 V410 H570 V444"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      <path
                        d="M680 410 V444"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      <path
                        d="M680 410 H790 V444"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      <path
                        d="M680 410 H900 V444"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      {/* Garis pelayanan PPL ke Anggota */}
                      <path
                        d="M250 320 H100 V585 H500"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        strokeDasharray="8 4 2 4"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Wewenang langsung Rapat Anggota ke Anggota */}
                      <path
                        d="M500 70 V555"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />

                      {/* Garis wewenang Anggota kembali ke Rapat Anggota */}
                      <path
                        d="M390 605 H35 V48 H327"
                        fill="none"
                        stroke="#EA580C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        markerEnd="url(#org-arrow-orange)"
                      />
                    </svg>

                    {/* Rapat Anggota */}
                    <div className="absolute left-1/2 top-[1%] z-10 w-[34%] -translate-x-1/2">
                      <OrganizationNode
                        title="RAPAT ANGGOTA"
                        subtitle="Pemegang Kekuasaan Tertinggi"
                        primary
                        icon={<UsersRound size={23} />}
                        className="min-h-15.5 sm:min-h-19.5"
                      />
                    </div>

                    {/* Pengurus */}
                    <div className="absolute left-[25%] top-[23%] z-10 w-[30%] -translate-x-1/2">
                      <OrganizationNode
                        title="PENGURUS"
                        subtitle="Susunan pengurus koperasi"
                        icon={<UsersRound size={22} />}
                      />
                    </div>

                    {/* Pengawas */}
                    <div className="absolute left-[75%] top-[23%] z-10 w-[30%] -translate-x-1/2">
                      <OrganizationNode
                        title="PENGAWAS"
                        subtitle="Pengawasan koperasi"
                        icon={<ShieldCheck size={22} />}
                      />
                    </div>

                    {/* PPL */}
                    <div className="absolute left-[25%] top-[44%] z-10 w-[23%] -translate-x-1/2">
                      <OrganizationNode
                        title="PPL"
                        subtitle="Sesuai bagan organisasi"
                        icon={<FileText size={22} />}
                      />
                    </div>

                    {/* Manajemen Usaha */}
                    <div className="absolute left-[68%] top-[44%] z-10 w-[30%] -translate-x-1/2">
                      <OrganizationNode
                        title="MANAJEMEN USAHA"
                        icon={<BriefcaseBusiness size={22} />}
                      />
                    </div>

                    {/* Empat unit pada bagan asli */}
                    {units.map((unit, index) => {
                      const positions = [57, 68, 79, 90];

                      return (
                        <div
                          key={index}
                          className="absolute top-[69%] z-10 w-[10%] -translate-x-1/2"
                          style={{ left: `${positions[index]}%` }}
                        >
                          <div className="flex min-h-13.75 flex-col items-center justify-center gap-1 rounded-xl border border-orange-200 bg-linear-to-b from-orange-50 to-white px-2 py-2 text-center shadow-sm sm:min-h-16.25">
                            <span className="text-orange-600">
                              {unit.icon}
                            </span>

                            <span className="text-[10px] font-bold text-neutral-900 sm:text-xs">
                              {unit.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Anggota */}
                    <div className="absolute left-1/2 top-[86%] z-10 w-[36%] -translate-x-1/2">
                      <OrganizationNode
                        title="ANGGOTA"
                        subtitle="Pemilik dan bagian utama koperasi"
                        primary
                        icon={<UsersRound size={24} />}
                        className="min-h-16.25 sm:min-h-19"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-center text-[10px] text-neutral-400 sm:hidden">
                Geser bagan ke samping untuk melihat seluruh struktur.
              </p>

              {/* Legenda */}
              <div className="mt-5 flex justify-end">
                <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-xs font-bold text-neutral-900 sm:text-sm">
                    Keterangan Garis
                  </h3>

                  <div className="space-y-2.5">
                    <LegendLine
                      type="authority"
                      label="Garis Wewenang dan Tanggung Jawab Pengurus"
                    />

                    <LegendLine
                      type="coordination"
                      label="Garis Koordinasi"
                    />

                    <LegendLine
                      type="supervision"
                      label="Garis Kepengawasan"
                    />

                    <LegendLine
                      type="service"
                      label="Garis Pelayanan"
                    />
                  </div>
                </div>
              </div>

              {/* Tombol lihat bagan penuh */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setIsModalOpen(true);
                  }}
                  disabled={!imageUrl}
                  title={
                    imageUrl
                      ? "Lihat bagan lengkap"
                      : "Pilih gambar bagan di Admin Dashboard"
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7"
                >
                  <ImageIcon size={19} />
                  Lihat Bagan Penuh
                  <ArrowRight size={18} />
                </button>
              </div>

              {!imageUrl && (
                <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
                  Gambar bagan lengkap belum dipilih di Admin Dashboard.
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Modal dirender di document.body melalui React Portal */}
      {modal}
    </>
  );
}