/*
  Warnings:

  - A unique constraint covering the columns `[chefId,title,deletedAt]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Recipe_chefId_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_chefId_title_deletedAt_key" ON "Recipe"("chefId", "title", "deletedAt");
