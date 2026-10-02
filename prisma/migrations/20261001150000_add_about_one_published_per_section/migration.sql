CREATE UNIQUE INDEX "about_content_one_published_per_section"
ON "AboutContent" ("section")
WHERE "status" = 'PUBLISHED';