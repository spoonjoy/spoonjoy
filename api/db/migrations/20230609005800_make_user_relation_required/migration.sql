/*
  Warnings:

  - Made the column `userId` on table `OAuth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `OAuth` MODIFY `userId` VARCHAR(191) NOT NULL;
