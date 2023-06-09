/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `OAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OAuth_userId_provider_key` ON `OAuth`(`userId`, `provider`);
