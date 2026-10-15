-- Business constraint:
-- Only one HeroSection can be active at a time.
CREATE UNIQUE INDEX "HeroSection_one_active_idx"
ON "HeroSection" ("isActive")
WHERE "isActive" = true;


-- Business constraint:
-- ContactInfo is a singleton table.
CREATE UNIQUE INDEX "ContactInfo_singleton_idx"
ON "ContactInfo" ((true));


-- Business constraint:
-- SiteSettings is a singleton table.
CREATE UNIQUE INDEX "SiteSettings_singleton_idx"
ON "SiteSettings" ((true));