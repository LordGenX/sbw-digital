"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Wallet,
  Building2,
  ShoppingBasket,
  GraduationCap,
  Plane,
  Coffee,
  MapPinned,
  HeartPulse,
} from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

const services = [
  {
    title: "Simpan Pinjam",
    description:
      "Solusi simpanan dan pembiayaan anggota yang aman, mudah, dan dikelola dengan prinsip kekeluargaan.",
    icon: Wallet,
    href: "/layanan",
  },
  {
    title: "Sekretariat dan Umum",
    description:
      "Layanan administrasi, informasi keanggotaan, dan dukungan operasional koperasi secara terpadu.",
    icon: Building2,
    href: "/layanan",
  },
  {
    title: "SBW Mart",
    description:
      "Pusat kebutuhan anggota serta ruang pemasaran produk unggulan UMKM perempuan binaan SBW.",
    icon: ShoppingBasket,
    href: "/layanan",
  },
  {
    title: "Learning Center",
    description:
      "Pelatihan untuk meningkatkan keterampilan usaha, kepemimpinan, dan literasi keuangan anggota.",
    icon: GraduationCap,
    href: "/layanan",
  },
  {
    title: "Tour and Travel",
    description:
      "Layanan perjalanan untuk mendukung kebutuhan wisata dan kegiatan anggota.",
    icon: Plane,
    href: "/layanan",
  },
  {
    title: "Cafe Cahaya Baru",
    description:
      "Tempat menikmati hidangan dan berkumpul bersama dalam suasana yang nyaman.",
    icon: Coffee,
    href: "/layanan",
  },
  {
    title: "Kavling Tanah",
    description:
      "Layanan informasi kavling tanah untuk mendukung kebutuhan dan perencanaan anggota.",
    icon: MapPinned,
    href: "/layanan",
  },
  {
    title: "DPP Griya Sehat",
    description:
      "Layanan kesehatan dan kebugaran untuk mendukung kesejahteraan anggota.",
    icon: HeartPulse,
    href: "/layanan",
  },
];

const ITEMS_PER_PAGE = 4;

export default function ServicesSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const pageCount = Math.ceil(services.length / ITEMS_PER_PAGE);

  function scrollToPage(page: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = carousel.querySelectorAll<HTMLElement>(
      "[data-carousel-slide]",
    );
    const target = slides[page];

    if (!target) return;

    carousel.scrollTo({
      left: target.offsetLeft - carousel.offsetLeft,
      behavior: "smooth",
    });

    setActivePage(page);
  }

  function handleScroll() {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = carousel.querySelectorAll<HTMLElement>(
      "[data-carousel-slide]",
    );

    let closestPage = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(
        slide.offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = index;
      }
    });

    setActivePage(closestPage);
  }

  function previousPage() {
    scrollToPage(Math.max(0, activePage - 1));
  }

  function nextPage() {
    scrollToPage(Math.min(pageCount - 1, activePage + 1));
  }

  return (
    <section
      id="layanan"
      className="overflow-hidden bg-neutral-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <ScrollReveal
          direction="up"
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
        >
          <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
            Layanan Kami
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Unit Usaha &amp; Layanan SBW
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
            Beragam layanan terintegrasi untuk mendukung kebutuhan, usaha,
            dan kesejahteraan setiap anggota.
          </p>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative mx-auto w-full max-w-6xl">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth px-2 pb-4 pt-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
            aria-label="Daftar delapan unit usaha dan layanan SBW"
          >
            {Array.from({ length: pageCount }, (_, pageIndex) => {
              const pageServices = services.slice(
                pageIndex * ITEMS_PER_PAGE,
                (pageIndex + 1) * ITEMS_PER_PAGE,
              );

              return (
                <div
                  key={pageIndex}
                  data-carousel-slide
                  className="w-full shrink-0 snap-start"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {pageServices.map((service, serviceIndex) => {
                      const Icon = service.icon;

                      return (
                        <ScrollReveal
                          key={service.title}
                          direction="up"
                          delay={serviceIndex * 100}
                        >
                          <article className="group flex min-h-40.5 gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-900/5 sm:p-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white">
                              <Icon size={21} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold leading-snug tracking-tight text-neutral-900">
                                {service.title}
                              </h3>

                              <p className="mt-2 text-sm leading-5 text-neutral-500">
                                {service.description}
                              </p>

                              <Link
                                href={service.href}
                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
                              >
                                Selengkapnya
                                <ArrowUpRight
                                  size={15}
                                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </Link>
                            </div>
                          </article>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel edge gradients */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-5 hidden w-8 bg-linear-to-r from-neutral-50/80 to-transparent backdrop-blur-[1px] sm:block"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-5 hidden w-8 bg-linear-to-l from-neutral-50/80 to-transparent backdrop-blur-[1px] sm:block"
          />

          {/* Navigation buttons */}
          <button
            type="button"
            onClick={previousPage}
            disabled={activePage === 0}
            aria-label="Layanan sebelumnya"
            className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-orange-500 bg-white text-orange-600 shadow-sm transition-all hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex lg:-left-6"
          >
            <ArrowLeft size={19} />
          </button>

          <button
            type="button"
            onClick={nextPage}
            disabled={activePage === pageCount - 1}
            aria-label="Layanan berikutnya"
            className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-orange-600 text-white shadow-sm transition-all hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex lg:-right-6"
          >
            <ArrowRight size={19} />
          </button>
        </div>

        {/* Carousel indicators */}
        <ScrollReveal direction="up" delay={100}>
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToPage(index)}
                aria-label={`Tampilkan halaman layanan ${index + 1}`}
                aria-current={activePage === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activePage === index
                    ? "w-7 bg-orange-600"
                    : "w-2.5 bg-neutral-300 hover:bg-orange-300"
                }`}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* View all services */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-9 text-center">
            <Link
              href="/layanan"
              className="group inline-flex items-center gap-2 border-b border-orange-200 pb-1 text-sm font-bold text-orange-600 transition-colors hover:border-orange-600 hover:text-orange-700"
            >
              Pelajari layanan selengkapnya
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}