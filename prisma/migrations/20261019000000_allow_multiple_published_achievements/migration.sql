DROP INDEX IF EXISTS "about_content_one_published_per_section";

CREATE UNIQUE INDEX "about_content_one_published_per_section"
ON "AboutContent" ("section")
WHERE "status" = 'PUBLISHED'
  AND "section" <> 'ACHIEVEMENT';