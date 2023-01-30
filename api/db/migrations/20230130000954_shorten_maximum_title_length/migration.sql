/*
  Warnings:

  - You are about to alter the column `title` on the `Cookbook` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(75)`.
  - You are about to alter the column `title` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(75)`.

*/

-- AlterTable
ALTER TABLE `Cookbook` MODIFY `title` VARCHAR(75) NOT NULL;

UPDATE Recipe
SET title = SUBSTRING(title, 1, 75);

-- AlterTable
ALTER TABLE `Recipe` MODIFY `title` VARCHAR(75) NOT NULL;
