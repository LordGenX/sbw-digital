CREATE UNIQUE INDEX "membership_info_one_published_per_section"
ON "MembershipInfo" ("section")
WHERE "status" = 'PUBLISHED';