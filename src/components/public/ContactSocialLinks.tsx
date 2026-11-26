import ScrollReveal from "@/components/public/ScrollReveal";

type ContactSocialLinksProps = {
  contactInfo: {
    socialLinks: unknown;
  } | null;
};

type SocialLink = {
  platform: string;
  url: string;
};

function getSocialLinks(value: unknown): SocialLink[] {
  if (!value) return [];

  // Mendukung format object:
  // { instagram: "https://...", facebook: "https://..." }
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value)
      .filter(
        ([, url]) =>
          typeof url === "string" && url.trim().length > 0,
      )
      .map(([platform, url]) => ({
        platform,
        url: url as string,
      }));
  }

  // Mendukung format array:
  // [{ platform: "Instagram", url: "https://..." }]
  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" &&
          item !== null &&
          !Array.isArray(item),
      )
      .map((item) => ({
        platform:
          typeof item.platform === "string"
            ? item.platform
            : typeof item.name === "string"
              ? item.name
              : "Media Sosial",
        url:
          typeof item.url === "string"
            ? item.url
            : typeof item.href === "string"
              ? item.href
              : "",
      }))
      .filter((item) => item.url.trim().length > 0);
  }

  return [];
}

function getPlatformLabel(platform: string) {
  const normalized = platform.toLowerCase().replace(/[_-]/g, " ");

  const labels: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
    twitter: "X / Twitter",
    x: "X",
    website: "Website",
  };

  return labels[normalized] ?? platform;
}

export default function ContactSocialLinks({
  contactInfo,
}: ContactSocialLinksProps) {
  const socialLinks = getSocialLinks(contactInfo?.socialLinks);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <section className="bg-orange-50/60 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Ikuti Kami
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Media Sosial
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Temukan informasi, kegiatan, dan kabar terbaru SBW
              melalui kanal media sosial kami.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((social, index) => (
            <ScrollReveal
              key={`${social.platform}-${social.url}`}
              delay={index * 80}
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Kunjungi ${getPlatformLabel(social.platform)}`}
                className="group flex min-w-40 items-center gap-3 rounded-xl border border-orange-100 bg-white px-5 py-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg font-bold text-orange-700 transition group-hover:bg-orange-500 group-hover:text-white"
                >
                  {getPlatformLabel(social.platform)
                    .slice(0, 1)
                    .toUpperCase()}
                </span>

                <span className="font-semibold text-slate-800 transition group-hover:text-orange-700">
                  {getPlatformLabel(social.platform)}
                </span>

                <span
                  aria-hidden="true"
                  className="ml-auto text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-600"
                >
                  ↗
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}