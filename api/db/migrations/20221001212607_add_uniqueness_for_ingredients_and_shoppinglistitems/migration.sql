/*
  Warnings:

  - A unique constraint covering the columns `[recipeStepId,unitId,ingredientRefId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shoppingListId,unitId,ingredientRefId]` on the table `ShoppingListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_recipeStepId_unitId_ingredientRefId_key" ON "Ingredient"("recipeStepId", "unitId", "ingredientRefId");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingListItem_shoppingListId_unitId_ingredientRefId_key" ON "ShoppingListItem"("shoppingListId", "unitId", "ingredientRefId");
