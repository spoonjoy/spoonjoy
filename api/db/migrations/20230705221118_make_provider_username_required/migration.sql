/*
  Warnings:

  - Made the column `username` on table `OAuth` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `OAuth` MODIFY `username` VARCHAR(191) NOT NULL;
