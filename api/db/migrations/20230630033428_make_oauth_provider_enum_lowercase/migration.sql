-- Make OAuth provider enum lowercase
UPDATE `OAuth` SET `provider` = LOWER(`provider`);

-- AlterTable
ALTER TABLE `OAuth` MODIFY `provider` ENUM('google', 'apple') NOT NULL;
