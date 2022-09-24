/*
  Warnings:

  - You are about to drop the column `ingredeientRefId` on the `Ingredient` table. All the data in the column will be lost.
  - Added the required column `ingredientRefId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_ingredeientRefId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "ingredeientRefId",
ADD COLUMN     "ingredientRefId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_ingredientRefId_fkey" FOREIGN KEY ("ingredientRefId") REFERENCES "IngredientRef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
