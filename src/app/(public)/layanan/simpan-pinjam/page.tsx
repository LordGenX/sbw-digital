import SiteFooter from "@/components/public/SiteFooter";
import SimpanPinjamContent from "@/components/public/SimpanPinjamContent";

import {
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function SimpanPinjamPage() {
  const [contactInfo, siteSettings] = await Promise.all([
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <main className="min-h-screen bg-white text-slate-800">
        <SimpanPinjamContent contactInfo={contactInfo} />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}