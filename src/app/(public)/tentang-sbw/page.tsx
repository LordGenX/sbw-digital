import SiteFooter from "@/components/public/SiteFooter";
import AboutHero from "@/components/public/AboutHero";
import VisionMission from "@/components/public/AboutVisionMission";
import AboutOrganization from "@/components/public/AboutOrganization";
import AboutAchievement from "@/components/public/AboutAchievement";

import {
  getPublicAboutHistory,
  getPublicAboutVisionMission,
  getPublicContactInfo,
  getPublicSiteSettings,
  getPublicAboutOrganization,
  getPublicAboutAchievements,
  getPublicAboutAchievementsCount,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function TentangSBWPage() {
  const [
    history,
    contactInfo,
    siteSettings,
    visionMission,
    organization,
    achievements,
    achievementCount,
  ] = await Promise.all([
    getPublicAboutHistory(),
    getPublicContactInfo(),
    getPublicSiteSettings(),
    getPublicAboutVisionMission(),
    getPublicAboutOrganization(),
    getPublicAboutAchievements(),
    getPublicAboutAchievementsCount(),
  ]);

  return (
    <>
      <main>
        <AboutHero history={history} />
        <VisionMission data={visionMission} />
        <AboutOrganization data={organization} />
        <AboutAchievement data={achievements} totalCount={achievementCount}/>
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}