-- CreateTable
CREATE TABLE `Cookbook` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    INDEX `Cookbook_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipesInCookbooks` (
    `cookbookId` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,
    `addedById` VARCHAR(191) NOT NULL,

    INDEX `RecipesInCookbooks_cookbookId_idx`(`cookbookId`),
    INDEX `RecipesInCookbooks_recipeId_idx`(`recipeId`),
    INDEX `RecipesInCookbooks_addedById_idx`(`addedById`),
    PRIMARY KEY (`cookbookId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
