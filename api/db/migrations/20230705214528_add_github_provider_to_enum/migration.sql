-- AlterTable
ALTER TABLE `OAuth` MODIFY `provider` ENUM('google', 'github', 'apple') NOT NULL;
