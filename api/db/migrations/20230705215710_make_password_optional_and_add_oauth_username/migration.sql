-- AlterTable
ALTER TABLE `OAuth` ADD COLUMN `username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `hashedPassword` VARCHAR(191) NULL,
    MODIFY `salt` VARCHAR(191) NULL;
