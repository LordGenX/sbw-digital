"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Tentang SBW", href: "/tentang-sbw" },
  { label: "Layanan", href: "/layanan" },
  { label: "Keanggotaan", href: "/keanggotaan" },
  { label: "Berita & Agenda", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];

type SiteHeaderProps = {
  siteName?: string;
};

export default function SiteHeader({
  siteName = "SBW Coop",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Referensi navigasi desktop
  const navRef = useRef<HTMLElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  // Motion Value untuk garis aktif
  const indicatorX = useMotionValue(0);
  const indicatorWidth = useMotionValue(0);

  // Status pengukuran awal
  const hasMeasured = useRef(false);
  const previousPath = useRef(pathname);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href === "/berita") {
      return pathname === "/berita" || pathname.startsWith("/agenda");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setMenuOpen(false);

  // Mengatur posisi dan lebar garis navbar
  useEffect(() => {
    const nav = navRef.current;
    const activeLink = activeLinkRef.current;

    if (!nav || !activeLink) return;

    const updateIndicator = (shouldAnimate: boolean) => {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const left = linkRect.left - navRect.left;
      const width = linkRect.width;

      if (shouldAnimate && !shouldReduceMotion) {
        animate(indicatorX, left, {
          type: "spring",
          stiffness: 380,
          damping: 32,
        });

        animate(indicatorWidth, width, {
          type: "spring",
          stiffness: 380,
          damping: 32,
        });
      } else {
        indicatorX.set(left);
        indicatorWidth.set(width);
      }
    };

    const pathChanged = previousPath.current !== pathname;
    const shouldAnimate = hasMeasured.current && pathChanged;

    updateIndicator(shouldAnimate);

    hasMeasured.current = true;
    previousPath.current = pathname;

    // Sinkronisasi jika ukuran navigasi berubah
    const resizeObserver = new ResizeObserver(() => {
      updateIndicator(false);
    });

    resizeObserver.observe(nav);
    resizeObserver.observe(activeLink);

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    pathname,
    indicatorX,
    indicatorWidth,
    shouldReduceMotion,
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-21 w-full max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10 xl:px-12">

        {/* Logo */}
        <Link
          href="/"
          aria-label={`${siteName} - Beranda`}
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative h-12 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Image
              src="/images/logo-sbw.jpeg"
              alt="Logo Koperasi Konsumen Setia Budi Wanita"
              className="h-full w-full object-contain"
              width={56}
              height={56}
            />
          </div>

          <div>
            <span className="font-hero block text-lg font-extrabold leading-tight tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-orange-700">
              {siteName}
            </span>
            <span className="mt-1 block text-xs leading-tight text-slate-500">
              Koperasi Setia Budi Wanita
            </span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav
          ref={navRef}
          aria-label="Navigasi utama"
          className="relative hidden items-center gap-4 lg:flex xl:gap-6 2xl:gap-8"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                ref={active ? activeLinkRef : undefined}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative z-10 inline-flex items-center whitespace-nowrap py-3 text-sm font-semibold tracking-wide transition-colors duration-300 ease-out xl:text-base ${
                  active
                    ? "text-orange-600"
                    : "text-slate-700 hover:text-orange-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Garis aktif horizontal */}
          <motion.span
            className="pointer-events-none absolute bottom-1 left-0 h-0.5 rounded-full bg-orange-600"
            style={{
              x: indicatorX,
              width: indicatorWidth,
            }}
          />
        </nav>

        {/* CTA Desktop */}
        <Link
          href="/keanggotaan"
          className="hidden shrink-0 items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/20 active:translate-y-0 md:inline-flex xl:px-6 xl:text-base"
        >
          Bergabung Sekarang
        </Link>

        {/* Tombol Menu Mobile */}
        <button
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 text-slate-700 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{
                opacity: 0,
                rotate: shouldReduceMotion ? 0 : -45,
                scale: shouldReduceMotion ? 1 : 0.85,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: shouldReduceMotion ? 0 : 45,
                scale: shouldReduceMotion ? 1 : 0.85,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: "easeOut",
              }}
              className="flex items-center justify-center"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Navigasi Mobile */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
              y: shouldReduceMotion ? 0 : -6,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: shouldReduceMotion ? 0 : -6,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-0 right-0 top-full overflow-hidden border-t border-orange-100 bg-white shadow-xl lg:hidden"
          >
            <nav
              aria-label="Navigasi mobile"
              className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 px-5 py-4 sm:px-8"
            >
              {navigation.map((item, index) => {
                const active = isActive(item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={{
                      opacity: 0,
                      y: shouldReduceMotion ? 0 : 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                      delay: shouldReduceMotion ? 0 : index * 0.04,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenu}
                      className={`relative flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                        active
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                      }`}
                    >
                      {item.label}

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  delay: shouldReduceMotion ? 0 : navigation.length * 0.04,
                }}
              >
                <Link
                  href="/keanggotaan"
                  onClick={closeMenu}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3.5 text-base font-bold text-white transition-colors duration-300 hover:bg-orange-700 active:scale-[0.98]"
                >
                  Bergabung Sekarang
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}