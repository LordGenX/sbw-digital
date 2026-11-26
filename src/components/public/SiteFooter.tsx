
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter,
  FaLinkedinIn,
  FaGlobe,
} from "react-icons/fa6";

type ContactInfo = {
  address: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  socialLinks: unknown;
  mapUrl: string | null;
};

type SiteSettings = {
  siteName: string;
  siteDescription: string | null;
};

type SiteFooterProps = {
  contactInfo: ContactInfo | null;
  siteSettings: SiteSettings | null;
};

type SocialLink = {
  label: string;
  url: string;
};

const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang SBW", href: "/tentang-sbw" },
  { label: "Layanan", href: "/layanan" },
  { label: "Keanggotaan", href: "/keanggotaan" },
  { label: "Berita & Kegiatan", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];

const serviceLinks = [
  { label: "Simpan Pinjam", href: "/layanan" },
  { label: "SBW Mart", href: "/layanan" },
  { label: "Sekretariat dan Umum", href: "/layanan" },
  { label: "Learning Center", href: "/layanan" },
  { label: "Tour and Travel", href: "/layanan" },
  { label: "Cafe Cahaya Baru", href: "/layanan" },
  { label: "Kavling Tanah", href: "/layanan" },
  { label: "DPP Griya Sehat", href: "/layanan" },
];

function normalizeSocialName(label: string) {
  return label.toLowerCase().replace(/[^a-z]/g, "");
}

function getSocialLinks(value: unknown): SocialLink[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" &&
        /^https?:\/\//i.test(entry[1]),
    )
    .map(([label, url]) => ({ label, url }));
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function normalizeWhatsApp(phone: string) {
  let number = phone.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number = `62${number.slice(1)}`;
  } else if (number.startsWith("8")) {
    number = `62${number}`;
  }

  return number;
}

function ContactIcon({
  type,
}: {
  type: "location" | "phone" | "email" | "clock";
}) {
  const paths = {
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.06 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.76 2.03Z" />
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  };

  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        {paths[type]}
      </svg>
    </span>
  );
}

function FooterLinkList({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-xs leading-5 text-neutral-400 transition-colors duration-200 hover:text-orange-400"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Komponen ikon brand terpisah agar tipe komponennya stabil.
function SocialBrandIcon({ label }: { label: string }) {
  const normalized = normalizeSocialName(label);

  switch (normalized) {
    case "facebook":
      return <FaFacebookF size={17} aria-hidden="true" />;
    case "instagram":
      return <FaInstagram size={17} aria-hidden="true" />;
    case "tiktok":
      return <FaTiktok size={17} aria-hidden="true" />;
    case "youtube":
      return <FaYoutube size={17} aria-hidden="true" />;
    case "whatsapp":
      return <FaWhatsapp size={17} aria-hidden="true" />;
    case "twitter":
    case "x":
      return <FaXTwitter size={17} aria-hidden="true" />;
    case "linkedin":
      return <FaLinkedinIn size={17} aria-hidden="true" />;
    case "website":
    case "web":
      return <FaGlobe size={17} aria-hidden="true" />;
    default:
      return null;
  }
}

function SocialIconButton({ label, url }: SocialLink) {
  const normalized = normalizeSocialName(label);

  const supportedSocials = [
    "facebook",
    "instagram",
    "tiktok",
    "youtube",
    "whatsapp",
    "twitter",
    "x",
    "linkedin",
    "website",
    "web",
  ];

  if (!supportedSocials.includes(normalized)) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1C1C]"
    >
      <SocialBrandIcon label={label} />
    </a>
  );
}

export default function SiteFooter({
  contactInfo,
  siteSettings,
}: SiteFooterProps) {
  const siteName = siteSettings?.siteName || "SBW Coop";

  const description =
    siteSettings?.siteDescription ||
    "Koperasi perempuan yang mendukung kemandirian ekonomi, pendidikan, dan kesejahteraan keluarga melalui layanan terintegrasi.";

  const socialLinks = getSocialLinks(contactInfo?.socialLinks);

  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="mx-auto w-full max-w-360 px-5 py-9 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_1.1fr_1.35fr] lg:gap-8">
          {/* Identitas dan media sosial */}
          <div>
            <Link
              href="/"
              aria-label={`${siteName} - Beranda`}
              className="mb-4 inline-flex items-center gap-3"
            >
              <Image
                src="/images/logo-sbw.jpeg"
                alt="Logo SBW"
                className="h-11 w-11 shrink-0 rounded-full bg-white object-contain"
                width={44}
                height={44}
              />

              <span>
                <span className="block text-sm font-bold leading-5 text-white">
                  {siteName}
                </span>
                <span className="block text-[11px] leading-5 text-neutral-400">
                  Koperasi Setia Budi Wanita
                </span>
              </span>
            </Link>

            <p className="mb-5 max-w-xs text-xs leading-6 text-neutral-400">
              {description}
            </p>

            {socialLinks.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2.5"
                aria-label="Media sosial"
              >
                {socialLinks.map((social) => (
                  <SocialIconButton
                    key={social.label}
                    label={social.label}
                    url={social.url}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tautan cepat */}
          <nav aria-label="Tautan cepat">
            <h2 className="mb-5 text-sm font-semibold text-white">
              Tautan Cepat
            </h2>
            <FooterLinkList links={quickLinks} />
          </nav>

          {/* Unit layanan */}
          <nav aria-label="Unit layanan">
            <h2 className="mb-5 text-sm font-semibold text-white">
              Unit Layanan
            </h2>
            <FooterLinkList links={serviceLinks} />
          </nav>

          {/* Kontak dan jam kerja */}
          <div>
            <h2 className="mb-5 text-sm font-semibold text-white">
              Kontak
            </h2>

            <ul className="space-y-3.5">
              {contactInfo?.address && (
                <li className="flex items-start gap-2.5">
                  <ContactIcon type="location" />

                  {contactInfo.mapUrl &&
                  /^https?:\/\//i.test(contactInfo.mapUrl) ? (
                    <a
                      href={contactInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-1 text-xs leading-5 text-neutral-400 transition-colors hover:text-orange-400"
                    >
                      {contactInfo.address}
                    </a>
                  ) : (
                    <span className="pt-1 text-xs leading-5 text-neutral-400">
                      {contactInfo.address}
                    </span>
                  )}
                </li>
              )}

              {contactInfo?.phone && (
                <li className="flex items-start gap-2.5">
                  <ContactIcon type="phone" />
                  <a
                    href={`tel:${normalizePhone(contactInfo.phone)}`}
                    className="pt-1 text-xs leading-5 text-neutral-400 transition-colors hover:text-orange-400"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
              )}

              {contactInfo?.email && (
                <li className="flex items-start gap-2.5">
                  <ContactIcon type="email" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="break-all pt-1 text-xs leading-5 text-neutral-400 transition-colors hover:text-orange-400"
                  >
                    {contactInfo.email}
                  </a>
                </li>
              )}

              {contactInfo?.whatsapp && (
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                    <FaWhatsapp size={15} aria-hidden="true" />
                  </span>
                  <a
                    href={`https://wa.me/${normalizeWhatsApp(contactInfo.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-1 text-xs leading-5 text-neutral-400 transition-colors hover:text-orange-400"
                  >
                    Hubungi melalui WhatsApp
                  </a>
                </li>
              )}

              <li className="flex items-start gap-2.5">
                <ContactIcon type="clock" />
                <div className="pt-1 text-xs leading-5 text-neutral-400">
                  <p>Senin–Jumat, 08.00–16.00 WIB</p>
                </div>
              </li>

              {!contactInfo && (
                <li className="text-xs leading-5 text-neutral-400">
                  Informasi kontak belum tersedia.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-7 border-t border-white/10 pt-4 sm:mt-8">
          <p className="text-[11px] leading-5 text-neutral-500">
            © {new Date().getFullYear()} Setia Budi Wanita. Seluruh hak cipta
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}