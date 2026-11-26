/*
  Warnings:

  - A unique constraint covering the columns `[section,status,sortOrder]` on the table `MembershipInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MembershipInfo_section_status_sortOrder_idx";

-- CreateIndex
CREATE UNIQUE INDEX "MembershipInfo_section_status_sortOrder_key" ON "MembershipInfo"("section", "status", "sortOrder");
