-- AlterTable
ALTER TABLE `Recipe` ADD COLUMN `sourceRecipeId` VARCHAR(191) NULL,
    ADD COLUMN `sourceUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Recipe_sourceRecipeId_idx` ON `Recipe`(`sourceRecipeId`);
