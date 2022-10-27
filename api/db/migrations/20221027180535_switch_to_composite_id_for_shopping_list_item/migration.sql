/*
  Warnings:

  - The primary key for the `ShoppingListItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ShoppingListItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ShoppingListItem_shoppingListId_unitId_ingredientRefId_key";

-- AlterTable
ALTER TABLE "ShoppingListItem" DROP CONSTRAINT "ShoppingListItem_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ShoppingListItem_pkey" PRIMARY KEY ("shoppingListId", "unitId", "ingredientRefId");
