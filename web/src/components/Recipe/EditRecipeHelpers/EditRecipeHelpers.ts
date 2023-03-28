import {
  EditRecipeById,
  UpdateIngredientInput,
  UpdateRecipeStepInput,
} from 'types/graphql'

import { FormUpdateRecipe } from '../RecipeForm'

export const recipeQueryResponseToFormUpdateRecipe = (
  recipe: EditRecipeById['recipe']
): FormUpdateRecipe => {
  if (!recipe) {
    throw new Error('No recipe was passed in!')
  }
  const recipeFormValues: FormUpdateRecipe = {
    recipeId: recipe.id,
    title: recipe.title,
    description: recipe.description || undefined,
    servings: recipe.servings || undefined,
    steps: recipe.steps.map((step): UpdateRecipeStepInput => {
      if (!step) {
        throw new Error('The step seems to be missing!')
      }
      return {
        recipeId: recipe.id,
        stepNum: step.stepNum,
        stepTitle: step.stepTitle,
        description: step.description || '',
        ingredients: step.ingredients.map(
          (ingredient): UpdateIngredientInput => {
            if (!ingredient) {
              throw new Error('The ingredient seems to be missing!')
            }
            return {
              id: ingredient.id,
              quantity: ingredient.quantity,
              unitName: ingredient.unit.name,
              ingredientName: ingredient.ingredientRef.name,
            }
          }
        ),
        stepOutputUses: step.stepOutputUses.map((stepOutputUse) => {
          if (!stepOutputUse) {
            throw new Error('The step output use seems to be missing!')
          }
          return {
            outputOfStepNum: stepOutputUse.outputOfStep.stepNum,
          }
        }),
      }
    }),
  }
  return recipeFormValues
}
