CREATE UNIQUE INDEX "about_achievement_published_sort_order_unique"
ON "AboutContent" ("sortOrder")
WHERE "section" = 'ACHIEVEMENT'
  AND "status" = 'PUBLISHED';