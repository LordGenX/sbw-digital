import SiteFooter from "@/components/public/SiteFooter";
import MembershipHero from "@/components/public/MembershipHero";
import MembershipRequirements from "@/components/public/MembershipRequirements";
import MembershipGroupLeadership from "@/components/public/MembershipGroupLeadership";
import MembershipCTA from "@/components/public/MembershipCTA";

import {
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function KeanggotaanPage() {
  const [contactInfo, siteSettings] = await Promise.all([
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <main>
        <MembershipHero />
        <MembershipRequirements />
        <MembershipGroupLeadership />
        <MembershipCTA />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}