import type { QueryResolvers, RecipeStepRelationResolvers } from 'types/graphql'

import {
  cacheFindMany,
  getIngredientsInStepCacheKey,
  getStepOutputUsesInStepCacheKey,
} from 'src/lib/cache'
import { db } from 'src/lib/db'

import { recipe } from '../recipes/recipes'

export const recipeSteps: QueryResolvers['recipeSteps'] = () => {
  return db.recipeStep.findMany()
}

export const recipeStep: QueryResolvers['recipeStep'] = ({
  recipeId,
  stepNum,
}) => {
  return db.recipeStep.findUnique({
    where: {
      recipeId_stepNum: {
        recipeId,
        stepNum,
      },
    },
  })
}

// export const createRecipeStep: MutationResolvers['createRecipeStep'] = ({
//   input,
// }) => {
//   return db.recipeStep.create({
//     data: input,
//   })
// }

// export const updateRecipeStep: MutationResolvers['updateRecipeStep'] = ({
//   id,
//   input,
// }) => {
//   return db.recipeStep.update({
//     data: input,
//     where: { id },
//   })
// }

// export const deleteRecipeStep: MutationResolvers['deleteRecipeStep'] = ({
//   id,
// }) => {
//   return db.recipeStep.delete({
//     where: { id },
//   })
// }

export const RecipeStep: RecipeStepRelationResolvers = {
  recipe: async (_obj, { root }) => {
    const maybeRecipe = await recipe({ id: root.recipeId })
    if (!maybeRecipe) {
      throw new Error('Could not resolve recipe')
    }

    return maybeRecipe
  },
  ingredients: (_obj, { root }) => {
    return cacheFindMany(
      getIngredientsInStepCacheKey(root.recipeId, root.stepNum),
      db.ingredient,
      {
        conditions: {
          where: {
            recipeId: root.recipeId,
            stepNum: root.stepNum,
          },
        },
      }
    )
  },
  stepOutputUses: (_obj, { root }) => {
    return cacheFindMany(
      getStepOutputUsesInStepCacheKey(root.recipeId, root.stepNum),
      db.stepOutputUse,
      {
        conditions: {
          where: {
            recipeId: root.recipeId,
            inputStepNum: root.stepNum,
          },
        },
      }
    )
  },
}
