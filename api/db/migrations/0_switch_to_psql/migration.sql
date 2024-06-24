
-- $ yarn prisma migrate diff --from-empty --to-schema-datamodel api/db/schema.prisma --script

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "salt" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "webAuthnChallenge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "transports" TEXT,
    "counter" BIGINT NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerUsername" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(140),
    "imageUrl" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dpjmyc4uz/image/upload/v1674541350/clbe7wr180009tkhggghtl1qd.png',
    "servings" VARCHAR(40),
    "chefId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "sourceRecipeId" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepNum" INTEGER NOT NULL,
    "stepTitle" TEXT,
    "description" VARCHAR(1000) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepOutputUse" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "outputStepNum" INTEGER NOT NULL,
    "inputStepNum" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StepOutputUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepNum" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitId" TEXT NOT NULL,
    "ingredientRefId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientRef" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngredientRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cookbook" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cookbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInCookbook" (
    "id" TEXT NOT NULL,
    "cookbookId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeInCookbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingList" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL,
    "shoppingListId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unitId" TEXT,
    "ingredientRefId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_webAuthnChallenge_key" ON "User"("webAuthnChallenge");

-- CreateIndex
CREATE INDEX "UserCredential_userId_idx" ON "UserCredential"("userId");

-- CreateIndex
CREATE INDEX "OAuth_userId_idx" ON "OAuth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_provider_providerUserId_key" ON "OAuth"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth_userId_provider_key" ON "OAuth"("userId", "provider");

-- CreateIndex
CREATE INDEX "Recipe_chefId_idx" ON "Recipe"("chefId");

-- CreateIndex
CREATE INDEX "Recipe_sourceRecipeId_idx" ON "Recipe"("sourceRecipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_chefId_title_deletedAt_key" ON "Recipe"("chefId", "title", "deletedAt");

-- CreateIndex
CREATE INDEX "RecipeStep_recipeId_idx" ON "RecipeStep"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_recipeId_stepNum_key" ON "RecipeStep"("recipeId", "stepNum");

-- CreateIndex
CREATE INDEX "StepOutputUse_recipeId_outputStepNum_inputStepNum_idx" ON "StepOutputUse"("recipeId", "outputStepNum", "inputStepNum");

-- CreateIndex
CREATE INDEX "StepOutputUse_recipeId_outputStepNum_idx" ON "StepOutputUse"("recipeId", "outputStepNum");

-- CreateIndex
CREATE INDEX "StepOutputUse_recipeId_inputStepNum_idx" ON "StepOutputUse"("recipeId", "inputStepNum");

-- CreateIndex
CREATE UNIQUE INDEX "StepOutputUse_recipeId_outputStepNum_inputStepNum_key" ON "StepOutputUse"("recipeId", "outputStepNum", "inputStepNum");

-- CreateIndex
CREATE INDEX "Ingredient_recipeId_stepNum_idx" ON "Ingredient"("recipeId", "stepNum");

-- CreateIndex
CREATE INDEX "Ingredient_recipeId_idx" ON "Ingredient"("recipeId");

-- CreateIndex
CREATE INDEX "Ingredient_unitId_idx" ON "Ingredient"("unitId");

-- CreateIndex
CREATE INDEX "Ingredient_ingredientRefId_idx" ON "Ingredient"("ingredientRefId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientRef_name_key" ON "IngredientRef"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE INDEX "Cookbook_authorId_idx" ON "Cookbook"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Cookbook_authorId_title_key" ON "Cookbook"("authorId", "title");

-- CreateIndex
CREATE INDEX "RecipeInCookbook_cookbookId_idx" ON "RecipeInCookbook"("cookbookId");

-- CreateIndex
CREATE INDEX "RecipeInCookbook_recipeId_idx" ON "RecipeInCookbook"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeInCookbook_addedById_idx" ON "RecipeInCookbook"("addedById");

-- CreateIndex
CREATE INDEX "RecipeInCookbook_cookbookId_recipeId_idx" ON "RecipeInCookbook"("cookbookId", "recipeId");

-- CreateIndex
CREATE INDEX "RecipeInCookbook_addedById_recipeId_idx" ON "RecipeInCookbook"("addedById", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeInCookbook_cookbookId_recipeId_key" ON "RecipeInCookbook"("cookbookId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingList_authorId_key" ON "ShoppingList"("authorId");

-- CreateIndex
CREATE INDEX "ShoppingList_authorId_idx" ON "ShoppingList"("authorId");

-- CreateIndex
CREATE INDEX "ShoppingListItem_shoppingListId_idx" ON "ShoppingListItem"("shoppingListId");

-- CreateIndex
CREATE INDEX "ShoppingListItem_unitId_idx" ON "ShoppingListItem"("unitId");

-- CreateIndex
CREATE INDEX "ShoppingListItem_ingredientRefId_idx" ON "ShoppingListItem"("ingredientRefId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingListItem_shoppingListId_unitId_ingredientRefId_key" ON "ShoppingListItem"("shoppingListId", "unitId", "ingredientRefId");

