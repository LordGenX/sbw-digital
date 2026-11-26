ALTER TABLE "MembershipInfo"
ADD COLUMN "contentKey" VARCHAR(100) NOT NULL DEFAULT 'DEFAULT';

DROP INDEX IF EXISTS "membership_info_one_published_per_section";

CREATE UNIQUE INDEX "membership_info_one_published_per_section"
ON "MembershipInfo" ("section", "contentKey")
WHERE "status" = 'PUBLISHED';