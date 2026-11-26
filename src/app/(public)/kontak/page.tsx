import SiteFooter from "@/components/public/SiteFooter";

import ContactHero from "@/components/public/ContactHero";
import ContactInformation from "@/components/public/ContactInformation";
import ContactSocialLinks from "@/components/public/ContactSocialLinks";
import ContactMap from "@/components/public/ContactMap";

import {
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const [contactInfo, siteSettings] = await Promise.all([
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <main className="min-h-screen bg-white text-slate-800">
        <ContactHero />

        <ContactInformation contactInfo={contactInfo} />

        <ContactSocialLinks contactInfo={contactInfo} />

        <ContactMap contactInfo={contactInfo} />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}