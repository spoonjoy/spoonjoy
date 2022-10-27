-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `salt` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiresAt` DATETIME(3) NULL,
    `webAuthnChallenge` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_webAuthnChallenge_key`(`webAuthnChallenge`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCredential` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `publicKey` LONGBLOB NOT NULL,
    `transports` VARCHAR(191) NULL,
    `counter` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `servings` INTEGER NULL,
    `chefId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    INDEX `Recipe_chefId_idx`(`chefId`),
    UNIQUE INDEX `Recipe_chefId_title_deletedAt_key`(`chefId`, `title`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecipeStep` (
    `id` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,
    `stepNum` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,

    INDEX `RecipeStep_recipeId_idx`(`recipeId`),
    UNIQUE INDEX `RecipeStep_recipeId_stepNum_key`(`recipeId`, `stepNum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StepOutputUse` (
    `id` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,
    `outputStepNum` INTEGER NOT NULL,
    `inputStepNum` INTEGER NOT NULL,

    INDEX `StepOutputUse_recipeId_outputStepNum_inputStepNum_idx`(`recipeId`, `outputStepNum`, `inputStepNum`),
    INDEX `StepOutputUse_recipeId_outputStepNum_idx`(`recipeId`, `outputStepNum`),
    INDEX `StepOutputUse_recipeId_inputStepNum_idx`(`recipeId`, `inputStepNum`),
    UNIQUE INDEX `StepOutputUse_recipeId_outputStepNum_inputStepNum_key`(`recipeId`, `outputStepNum`, `inputStepNum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingredient` (
    `id` VARCHAR(191) NOT NULL,
    `recipeId` VARCHAR(191) NOT NULL,
    `stepNum` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `ingredientRefId` VARCHAR(191) NOT NULL,

    INDEX `Ingredient_recipeId_stepNum_unitId_ingredientRefId_idx`(`recipeId`, `stepNum`, `unitId`, `ingredientRefId`),
    INDEX `Ingredient_recipeId_stepNum_idx`(`recipeId`, `stepNum`),
    INDEX `Ingredient_recipeId_idx`(`recipeId`),
    UNIQUE INDEX `Ingredient_recipeId_stepNum_unitId_ingredientRefId_key`(`recipeId`, `stepNum`, `unitId`, `ingredientRefId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IngredientRef` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IngredientRef_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Unit_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShoppingList` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShoppingList_authorId_key`(`authorId`),
    INDEX `ShoppingList_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShoppingListItem` (
    `id` VARCHAR(191) NOT NULL,
    `shoppingListId` VARCHAR(191) NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unitId` VARCHAR(191) NOT NULL,
    `ingredientRefId` VARCHAR(191) NOT NULL,

    INDEX `ShoppingListItem_shoppingListId_idx`(`shoppingListId`),
    INDEX `ShoppingListItem_unitId_idx`(`unitId`),
    INDEX `ShoppingListItem_ingredientRefId_idx`(`ingredientRefId`),
    UNIQUE INDEX `ShoppingListItem_shoppingListId_unitId_ingredientRefId_key`(`shoppingListId`, `unitId`, `ingredientRefId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
