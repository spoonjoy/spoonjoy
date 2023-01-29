/*
  Warnings:

  - You are about to alter the column `description` on the `Recipe` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Recipe` MODIFY `description` VARCHAR(191) NULL;
