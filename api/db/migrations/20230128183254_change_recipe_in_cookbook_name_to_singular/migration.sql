-- RenameIndex
ALTER TABLE `RecipeInCookbook` RENAME INDEX `RecipesInCookbooks_addedById_idx` TO `RecipeInCookbook_addedById_idx`;

-- RenameIndex
ALTER TABLE `RecipeInCookbook` RENAME INDEX `RecipesInCookbooks_cookbookId_idx` TO `RecipeInCookbook_cookbookId_idx`;

-- RenameIndex
ALTER TABLE `RecipeInCookbook` RENAME INDEX `RecipesInCookbooks_cookbookId_recipeId_idx` TO `RecipeInCookbook_cookbookId_recipeId_idx`;

-- RenameIndex
ALTER TABLE `RecipeInCookbook` RENAME INDEX `RecipesInCookbooks_cookbookId_recipeId_key` TO `RecipeInCookbook_cookbookId_recipeId_key`;

-- RenameIndex
ALTER TABLE `RecipeInCookbook` RENAME INDEX `RecipesInCookbooks_recipeId_idx` TO `RecipeInCookbook_recipeId_idx`;
