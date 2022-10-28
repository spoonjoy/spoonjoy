import type {
  QueryResolvers,
  // MutationResolvers,
  // RecipeStepRelationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
  Maybe,
  RecipeStepRelationResolvers,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { db } from 'src/lib/db'

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

type RequiredRecipeStepRelationResolvers = RecipeStepRelationResolvers & {
  recipe: RequiredResolverFn<
    ResolversTypes['Recipe'],
    ResolversParentTypes['RecipeStep'],
    RedwoodGraphQLContext
  >
  ingredients: NonNullable<RecipeStepRelationResolvers['ingredients']>
  stepOutputUses: NonNullable<RecipeStepRelationResolvers['stepOutputUses']>
}

export const RecipeStep: RequiredRecipeStepRelationResolvers = {
  recipe: async (_obj, { root }) => {
    const maybeRecipe = await db.recipeStep
      .findUnique({
        where: {
          recipeId_stepNum: {
            recipeId: root.recipeId,
            stepNum: root.stepNum,
          },
        },
      })
      .recipe()
    if (!maybeRecipe) {
      throw new Error('Could not resolve recipe')
    }

    return maybeRecipe
  },
  ingredients: async (_obj, { root }) => {
    const maybeIngredients = await db.recipeStep
      .findUnique({
        where: {
          recipeId_stepNum: {
            recipeId: root.recipeId,
            stepNum: root.stepNum,
          },
        },
      })
      .ingredients()

    return maybeIngredients
  },
  stepOutputUses: async (_obj, { root }) => {
    const maybeStepOutputUses = await db.recipeStep
      .findUnique({
        where: {
          recipeId_stepNum: {
            recipeId: root.recipeId,
            stepNum: root.stepNum,
          },
        },
      })
      .usingSteps()

    return maybeStepOutputUses
  },
}
