/*
  Warnings:

  - You are about to alter the column `title` on the `Cookbook` table. The data in that column could be lost. The data in that column will be cast from `VarChar(75)` to `VarChar(60)`.
  - You are about to alter the column `title` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(75)` to `VarChar(60)`.
  - You are about to alter the column `description` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(140)`.

*/
-- AlterTable
UPDATE Cookbook
SET title = SUBSTRING(title, 1, 60);
ALTER TABLE `Cookbook` MODIFY `title` VARCHAR(60) NOT NULL;

-- AlterTable
UPDATE Recipe
SET title = SUBSTRING(title, 1, 60);
UPDATE Recipe
SET description = SUBSTRING(description, 1, 140);
ALTER TABLE `Recipe` MODIFY `title` VARCHAR(60) NOT NULL,
    MODIFY `description` VARCHAR(140) NULL;
