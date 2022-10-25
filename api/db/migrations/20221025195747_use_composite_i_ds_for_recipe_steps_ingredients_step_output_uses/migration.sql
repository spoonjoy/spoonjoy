/*
  Warnings:

  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `recipeStepId` on the `Ingredient` table. All the data in the column will be lost.
  - The primary key for the `RecipeStep` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RecipeStep` table. All the data in the column will be lost.
  - The primary key for the `StepOutputUse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StepOutputUse` table. All the data in the column will be lost.
  - You are about to drop the column `inputOfStepId` on the `StepOutputUse` table. All the data in the column will be lost.
  - You are about to drop the column `outputOfStepId` on the `StepOutputUse` table. All the data in the column will be lost.
  - Added the required column `recipeId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stepNum` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputStepNum` to the `StepOutputUse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputStepNum` to the `StepOutputUse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `StepOutputUse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_recipeStepId_fkey";

-- DropForeignKey
ALTER TABLE "StepOutputUse" DROP CONSTRAINT "StepOutputUse_inputOfStepId_fkey";

-- DropForeignKey
ALTER TABLE "StepOutputUse" DROP CONSTRAINT "StepOutputUse_outputOfStepId_fkey";

-- DropIndex
DROP INDEX "Ingredient_recipeStepId_unitId_ingredientRefId_key";

-- DropIndex
DROP INDEX "RecipeStep_recipeId_stepNum_key";

-- DropIndex
DROP INDEX "StepOutputUse_outputOfStepId_inputOfStepId_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_pkey",
DROP COLUMN "id",
DROP COLUMN "recipeStepId",
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD COLUMN     "stepNum" INTEGER NOT NULL,
ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("recipeId", "stepNum", "unitId", "ingredientRefId");

-- AlterTable
ALTER TABLE "RecipeStep" DROP CONSTRAINT "RecipeStep_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("recipeId", "stepNum");

-- AlterTable
ALTER TABLE "StepOutputUse" DROP CONSTRAINT "StepOutputUse_pkey",
DROP COLUMN "id",
DROP COLUMN "inputOfStepId",
DROP COLUMN "outputOfStepId",
ADD COLUMN     "inputStepNum" INTEGER NOT NULL,
ADD COLUMN     "outputStepNum" INTEGER NOT NULL,
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD CONSTRAINT "StepOutputUse_pkey" PRIMARY KEY ("recipeId", "outputStepNum", "inputStepNum");

-- AddForeignKey
ALTER TABLE "StepOutputUse" ADD CONSTRAINT "StepOutputUse_recipeId_outputStepNum_fkey" FOREIGN KEY ("recipeId", "outputStepNum") REFERENCES "RecipeStep"("recipeId", "stepNum") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepOutputUse" ADD CONSTRAINT "StepOutputUse_recipeId_inputStepNum_fkey" FOREIGN KEY ("recipeId", "inputStepNum") REFERENCES "RecipeStep"("recipeId", "stepNum") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_stepNum_fkey" FOREIGN KEY ("recipeId", "stepNum") REFERENCES "RecipeStep"("recipeId", "stepNum") ON DELETE CASCADE ON UPDATE CASCADE;
