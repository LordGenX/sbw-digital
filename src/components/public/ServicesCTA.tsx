import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

type ServicesCTAProps = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};

export default function ServicesCTA({
  phone,
  email,
  address,
}: ServicesCTAProps) {
  const whatsappNumber = phone?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : null;

  return (
    <section className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-linear-to-br from-orange-600 via-orange-500 to-orange-500 px-5 py-12 text-center shadow-sm sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        {/* Decorative corner circles */}
        <div
          aria-hidden="true"
          className="absolute -left-12 -top-12 -z-10 h-28 w-28 rounded-full bg-orange-400/60 sm:h-36 sm:w-36"
        />
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-12 -z-10 h-28 w-28 rounded-full bg-orange-400/60 sm:h-36 sm:w-36"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 -z-10 h-28 w-28 rounded-full bg-orange-400/60 sm:h-36 sm:w-36"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -right-12 -z-10 h-28 w-28 rounded-full bg-orange-400/60 sm:h-36 sm:w-36"
        />

        {/* Geometric background pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-75 -translate-x-1/2 -translate-y-1/2 opacity-20 sm:w-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(70deg, transparent 0px, transparent 11px, rgba(255,255,255,0.6) 12px, transparent 13px), repeating-linear-gradient(110deg, transparent 0px, transparent 11px, rgba(255,255,255,0.6) 12px, transparent 13px)",
          }}
        />

        {/* CTA content with scroll reveal */}
        <ScrollReveal
          direction="up"
          delay={100}
          className="relative mx-auto max-w-4xl"
        >
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-700 shadow-sm">
            Bergabung dengan SBW
          </span>

          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            Siap tumbuh dan berdaya bersama SBW?
          </h2>

          <p className="mx-auto mt-4 max-w-4xl text-sm leading-7 text-white/90 sm:text-base">
            Hubungi agen kami untuk mengenal layanan dan menjadi anggota.
            Mudah, tanpa formulir.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi Kami
              </a>
            ) : (
              <Link
                href="/kontak"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
              >
                <MessageCircle className="h-4 w-4" />
                Hubungi Kami
              </Link>
            )}

            <Link
              href="/keanggotaan"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
            >
              Lihat Keanggotaan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Contact information */}
          <div className="mt-7 flex flex-col items-center gap-2.5 text-xs leading-5 text-white/95 sm:text-sm">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>{phone}</span>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{email}</span>
              </a>
            )}

            {address && (
              <a
                href="https://maps.app.goo.gl/qt4jE5sejkAeH2kCA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {address}
                </span>
              </a>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}