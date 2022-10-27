-- CreateIndex
CREATE INDEX `Ingredient_recipeId_stepNum_unitId_ingredientRefId_idx` ON `Ingredient`(`recipeId`, `stepNum`, `unitId`, `ingredientRefId`);

-- CreateIndex
CREATE INDEX `Ingredient_recipeId_stepNum_idx` ON `Ingredient`(`recipeId`, `stepNum`);

-- CreateIndex
CREATE INDEX `Ingredient_recipeId_idx` ON `Ingredient`(`recipeId`);

-- CreateIndex
CREATE INDEX `Recipe_chefId_idx` ON `Recipe`(`chefId`);

-- CreateIndex
CREATE INDEX `RecipeStep_recipeId_idx` ON `RecipeStep`(`recipeId`);

-- CreateIndex
CREATE INDEX `ShoppingList_authorId_idx` ON `ShoppingList`(`authorId`);

-- CreateIndex
CREATE INDEX `ShoppingListItem_shoppingListId_idx` ON `ShoppingListItem`(`shoppingListId`);

-- CreateIndex
CREATE INDEX `StepOutputUse_recipeId_outputStepNum_inputStepNum_idx` ON `StepOutputUse`(`recipeId`, `outputStepNum`, `inputStepNum`);

-- CreateIndex
CREATE INDEX `StepOutputUse_recipeId_outputStepNum_idx` ON `StepOutputUse`(`recipeId`, `outputStepNum`);

-- RenameIndex
ALTER TABLE `ShoppingListItem` RENAME INDEX `ShoppingListItem_ingredientRefId_fkey` TO `ShoppingListItem_ingredientRefId_idx`;

-- RenameIndex
ALTER TABLE `ShoppingListItem` RENAME INDEX `ShoppingListItem_unitId_fkey` TO `ShoppingListItem_unitId_idx`;

-- RenameIndex
ALTER TABLE `StepOutputUse` RENAME INDEX `StepOutputUse_recipeId_inputStepNum_fkey` TO `StepOutputUse_recipeId_inputStepNum_idx`;
