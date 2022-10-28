/*
  Warnings:

  - Made the column `description` on table `RecipeStep` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `RecipeStep` MODIFY `description` VARCHAR(191) NOT NULL;
