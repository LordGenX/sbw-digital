import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Coffee,
  HandCoins,
  HeartPulse,
  MapPinned,
  Plane,
  ShoppingBag,
} from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  media: {
    fileUrl: string;
    altText: string | null;
  } | null;
};

type ServicesListProps = {
  services: ServiceItem[];
};

const serviceIcons = [
  HandCoins,
  ShoppingBag,
  Building2,
  BookOpen,
  Plane,
  Coffee,
  MapPinned,
  HeartPulse,
];

export default function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <section
        id="daftar-layanan"
        className="bg-[#FFFCF8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-orange-200 bg-white px-6 py-14 text-center">
          <BriefcaseBusiness className="mx-auto h-10 w-10 text-orange-500" />

          <h2 className="mt-5 text-2xl font-bold text-neutral-900">
            Layanan sedang dipersiapkan
          </h2>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Informasi layanan SBW akan ditampilkan di halaman ini setelah
            tersedia.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="daftar-layanan"
      className="scroll-mt-24 bg-[#FFFCF8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section introduction */}
        <ScrollReveal direction="up" className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
            Unit Usaha dan Layanan
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Kenali Layanan SBW
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:mt-5 sm:text-base sm:leading-8">
            Kenali berbagai unit usaha dan layanan Koperasi Konsumen Setia
            Budi Wanita yang mendukung kebutuhan anggota dan pengembangan
            usaha koperasi.
          </p>
        </ScrollReveal>

        {/* Service introductions */}
        <div className="space-y-14 sm:space-y-20 lg:space-y-24">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const imageOnRight = index % 2 === 1;

            return (
              <article
                key={service.id}
                id={`layanan-${service.slug}`}
                className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Service visual */}
                <ScrollReveal
                  direction={imageOnRight ? "right" : "left"}
                  delay={50}
                  className={`relative ${
                    imageOnRight ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="absolute -inset-2 rounded-[1.75rem] bg-linear-to-br from-orange-100 via-amber-50 to-orange-50 sm:-inset-3 sm:rounded-[2rem]" />

                  <div className="relative aspect-5/4 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 sm:rounded-3xl">
                    {service.media?.fileUrl ? (
                      <Image
                        src={service.media.fileUrl}
                        alt={service.media.altText || service.name}
                        fill
                        unoptimized
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 via-orange-100 to-amber-100 p-6 text-center sm:p-8">
                        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-orange-200/70" />
                        <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full border border-orange-200/70" />

                        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white bg-white/90 text-orange-600 shadow-sm sm:h-24 sm:w-24">
                          <Icon
                            className="h-10 w-10 sm:h-12 sm:w-12"
                            strokeWidth={1.4}
                          />
                        </div>

                        <p className="relative mt-5 max-w-xs text-lg font-semibold text-orange-900 sm:text-xl">
                          {service.name}
                        </p>

                        <span className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700/80">
                          Koperasi SBW
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Service number */}
                  <div className="absolute -bottom-3 right-4 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-100 bg-white text-sm font-bold text-orange-700 shadow-sm sm:-bottom-4 sm:right-7 sm:h-14 sm:w-14 sm:text-base">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </ScrollReveal>

                {/* Service information */}
                <div
                  className={`flex min-w-0 flex-col justify-center ${
                    imageOnRight ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <ScrollReveal direction="up" delay={100}>
                    <div className="flex items-center gap-3">
                      <span className="h-0.5 w-8 shrink-0 rounded-full bg-orange-500" />

                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
                        Layanan SBW
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:mt-5 sm:text-3xl lg:text-4xl">
                      {service.name}
                    </h3>
                  </ScrollReveal>

                  {service.shortDescription && (
                    <ScrollReveal direction="up" delay={180}>
                      <p className="mt-4 max-w-xl text-base font-medium leading-7 text-neutral-800 sm:text-lg sm:leading-8">
                        {service.shortDescription}
                      </p>
                    </ScrollReveal>
                  )}

                  {service.description && (
                    <ScrollReveal direction="up" delay={260}>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600 sm:mt-4 sm:text-base sm:leading-8">
                        {service.description}
                      </p>
                    </ScrollReveal>
                  )}

                  {/* Service footer and action */}
                  <ScrollReveal direction="up" delay={340}>
                    <div className="mt-6 flex flex-col items-start gap-4 border-t border-orange-100 pt-5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                      <div className="flex items-center gap-2.5 text-sm text-neutral-600">
                        <Icon
                          className="h-5 w-5 shrink-0 text-orange-600"
                          strokeWidth={1.7}
                        />

                        <span>Koperasi Konsumen SBW</span>
                      </div>

                      <Link
                        href={`/layanan/${service.slug}`}
                        aria-label={`Lihat detail layanan ${service.name}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                      >
                        Lihat Detail Layanan
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}