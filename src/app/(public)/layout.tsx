import type { ReactNode } from "react";

import SiteHeader from "@/components/public/SiteHeader";
import PageTransition from "@/components/public/PageTransition";

import { getPublicSiteSettings } from "@/lib/public-data/homepage";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getPublicSiteSettings();

  return (
    <>
      <SiteHeader
        siteName={siteSettings?.siteName ?? "SBW Coop"}
      />

      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}