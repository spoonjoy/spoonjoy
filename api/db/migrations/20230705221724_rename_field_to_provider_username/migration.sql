/*
  Warnings:

  - You are about to drop the column `username` on the `OAuth` table. All the data in the column will be lost.
  - Added the required column `providerUsername` to the `OAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OAuth` DROP COLUMN `username`,
    ADD COLUMN `providerUsername` VARCHAR(191) NOT NULL;
