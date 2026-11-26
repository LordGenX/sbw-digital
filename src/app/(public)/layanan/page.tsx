import SiteFooter from "@/components/public/SiteFooter";
import ServicesHero from "@/components/public/ServicesHero";
import ServicesList from "@/components/public/ServicesList";
import ServicesCTA from "@/components/public/ServicesCTA";
import {
  getPublicContactInfo,
  getPublicSiteSettings,
  getPublicServices,
} from "@/lib/public-data/homepage";

export const dynamic = "force-dynamic";

export default async function LayananPage() {
  const [services, contactInfo, siteSettings] = await Promise.all([
    getPublicServices(),
    getPublicContactInfo(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <main className="min-h-screen bg-[#FFFCF8]">
        <ServicesHero />
        <ServicesList services={services} />
        <ServicesCTA phone={contactInfo?.phone} email={contactInfo?.email} address={contactInfo?.address}/>
      </main>

      <SiteFooter
        contactInfo={contactInfo}
        siteSettings={siteSettings}
      />
    </>
  );
}