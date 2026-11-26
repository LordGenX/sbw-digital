import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import AboutSection from "@/components/public/AboutSection";
import MembershipBenefitsSection from "@/components/public/MembershipBenefitsSection";
import NewsEventsSection from "@/components/public/NewsEventsSection";
import SiteFooter from "@/components/public/SiteFooter";

import {
  getPublicHero,
  getPublicStatistics,
  getPublicNews,
  getPublicEvents,
  getPublicContactInfo,
  getPublicSiteSettings,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    hero,
    statistics,
    news,
    events,
    contactInfo,
    siteSettings,
  ] = await Promise.all([
    getPublicHero(),
    getPublicStatistics(),
    getPublicNews(),
    getPublicEvents(),
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <main>
        <HeroSection hero={hero} statistics={statistics} />
        <ServicesSection />
        <AboutSection />
        <MembershipBenefitsSection />
        <NewsEventsSection news={news} events={events} />
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}