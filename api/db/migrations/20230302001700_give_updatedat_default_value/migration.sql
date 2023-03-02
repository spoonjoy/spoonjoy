/*
  Warnings:

  - Made the column `updatedAt` on table `Cookbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Ingredient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `RecipeInCookbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `RecipeStep` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ShoppingList` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ShoppingListItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

-- Handle existing null values
UPDATE `Cookbook` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `Ingredient` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `Recipe` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `RecipeInCookbook` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `RecipeStep` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `ShoppingList` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `ShoppingListItem` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;
UPDATE `User` SET `updatedAt` = CURRENT_TIMESTAMP(3) WHERE `updatedAt` IS NULL;

-- AlterTable
ALTER TABLE `Cookbook` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Ingredient` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Recipe` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `RecipeInCookbook` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `RecipeStep` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ShoppingList` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ShoppingListItem` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
