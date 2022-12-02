-- AlterTable
ALTER TABLE `Recipe` MODIFY `description` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `RecipeStep` MODIFY `description` VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE INDEX `Ingredient_unitId_idx` ON `Ingredient`(`unitId`);

-- CreateIndex
CREATE INDEX `Ingredient_ingredientRefId_idx` ON `Ingredient`(`ingredientRefId`);

-- CreateIndex
CREATE INDEX `UserCredential_userId_idx` ON `UserCredential`(`userId`);
