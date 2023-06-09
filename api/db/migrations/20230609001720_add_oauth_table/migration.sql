-- CreateTable
CREATE TABLE `OAuth` (
    `provider` ENUM('GOOGLE') NOT NULL,
    `providerUserId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OAuth_userId_idx`(`userId`),
    UNIQUE INDEX `OAuth_provider_providerUserId_key`(`provider`, `providerUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
