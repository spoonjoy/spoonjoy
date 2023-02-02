/*
  Warnings:

  - A unique constraint covering the columns `[authorId,title]` on the table `Cookbook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cookbook_authorId_title_key` ON `Cookbook`(`authorId`, `title`);
