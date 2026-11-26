import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/public/ScrollReveal";

function getWhatsAppUrl(value: string | null): string | null {
  if (!value?.trim()) return null;

  const contact = value.trim();

  // Jika database sudah menyimpan URL WhatsApp.
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(contact)) {
    return contact;
  }

  // Normalisasi nomor Indonesia menjadi format internasional.
  let number = contact.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number = `62${number.slice(1)}`;
  }

  if (!number) return null;

  return `https://wa.me/${number}`;
}

function getPhoneUrl(value: string | null): string | null {
  if (!value?.trim()) return null;

  const number = value.trim().replace(/[^\d+]/g, "");

  return number ? `tel:${number}` : null;
}

export default async function MembershipCTA() {
  const contact = await prisma.contactInfo.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      address: true,
      phone: true,
      email: true,
      whatsapp: true,
      mapUrl: true,
    },
  });

  const whatsappUrl = getWhatsAppUrl(contact?.whatsapp ?? null);
  const phoneUrl = getPhoneUrl(contact?.phone ?? null);

  return (
    <section
      id="cta-keanggotaan"
      aria-labelledby="membership-cta-title"
      className="bg-gray-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl bg-white p-4 sm:p-6 lg:p-8">
        <ScrollReveal direction="up">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-linear-to-r from-orange-600 to-orange-500 px-5 py-12 text-center text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            {/* Dekorasi sudut */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 -top-8 size-20 rounded-full bg-orange-400/50"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-orange-400/50"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 -left-8 size-20 rounded-full bg-orange-400/50"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 -right-8 size-20 rounded-full bg-orange-400/50"
            />

            {/* Pola dekoratif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(60deg, transparent 0, transparent 8px, rgba(255,255,255,0.65) 9px, transparent 10px), repeating-linear-gradient(-60deg, transparent 0, transparent 8px, rgba(255,255,255,0.65) 9px, transparent 10px)",
              }}
            />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-orange-700">
                Bergabung dengan SBW
              </span>

              <h2
                id="membership-cta-title"
                className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
              >
                Siap tumbuh dan berdaya bersama SBW?
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-orange-50 sm:text-base">
                Hubungi agen kami untuk mengenal layanan dan menjadi anggota.
                Mudah, tanpa formulir.
              </p>

              {/* Tombol CTA */}
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    <MessageCircle size={17} />
                    Hubungi Kami
                  </a>
                )}

                <a
                  href="#anggota-masuk"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Keanggotaan
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Informasi kontak dari ContactInfo */}
              {(phoneUrl || contact?.email || contact?.address) && (
                <div className="mx-auto mt-7 flex max-w-2xl flex-col items-center gap-2.5 text-xs leading-5 text-orange-50">
                  {phoneUrl && contact?.phone && (
                    <a
                      href={phoneUrl}
                      className="inline-flex items-center gap-2 transition hover:text-white"
                    >
                      <Phone size={14} />
                      <span>{contact.phone}</span>
                    </a>
                  )}

                  {contact?.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-2 transition hover:text-white"
                    >
                      <Mail size={14} />
                      <span>{contact.email}</span>
                    </a>
                  )}

                  {contact?.address && (
                    <a
                      href={contact.mapUrl?.trim() || undefined}
                      target={
                        contact.mapUrl?.trim() ? "_blank" : undefined
                      }
                      rel={
                        contact.mapUrl?.trim()
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex max-w-full items-start justify-center gap-2 transition hover:text-white"
                    >
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{contact.address}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}