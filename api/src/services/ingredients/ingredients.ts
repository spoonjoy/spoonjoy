import type {
  QueryResolvers,
  // MutationResolvers,
  RequiredResolverFn,
  ResolversParentTypes,
  ResolversTypes,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { db } from 'src/lib/db'

import { recipeStep } from '../recipeSteps/recipeSteps'

export const ingredients: QueryResolvers['ingredients'] = () => {
  return db.ingredient.findMany()
}

export const ingredient: QueryResolvers['ingredient'] = ({ id }) => {
  return db.ingredient.findUnique({
    where: {
      id,
    },
  })
}

// export const createIngredient: MutationResolvers['createIngredient'] = ({
//   input,
// }) => {
//   return db.ingredient.create({
//     data: input,
//   })
// }

// export const updateIngredient: MutationResolvers['updateIngredient'] = ({
//   id,
//   input,
// }) => {
//   return db.ingredient.update({
//     data: input,
//     where: { id },
//   })
// }

// export const deleteIngredient: MutationResolvers['deleteIngredient'] = ({
//   id,
// }) => {
//   return db.ingredient.delete({
//     where: { id },
//   })
// }

type RequiredIngredientRelationResolvers = {
  recipeStep: RequiredResolverFn<
    ResolversTypes['RecipeStep'],
    ResolversParentTypes['Ingredient'],
    RedwoodGraphQLContext
  >
  unit: RequiredResolverFn<
    ResolversTypes['Unit'],
    ResolversParentTypes['Ingredient'],
    RedwoodGraphQLContext
  >
  ingredientRef: RequiredResolverFn<
    ResolversTypes['IngredientRef'],
    ResolversParentTypes['Ingredient'],
    RedwoodGraphQLContext
  >
}

export const Ingredient: RequiredIngredientRelationResolvers = {
  recipeStep: async (_obj, { root }) => {
    const maybeRecipeStep = await recipeStep({
      recipeId: root.recipeId,
      stepNum: root.stepNum,
    })
    if (!maybeRecipeStep) {
      throw new Error('Could not resolve recipeStep')
    }

    return maybeRecipeStep
  },
  unit: async (_obj, { root }) => {
    const maybeUnit = await db.unit.findUnique({
      where: {
        id: root.unitId,
      },
    })

    if (!maybeUnit) {
      throw new Error('Could not resolve unit')
    }

    return maybeUnit
  },
  ingredientRef: async (_obj, { root }) => {
    const maybeIngredientRef = await db.ingredientRef.findUnique({
      where: {
        id: root.ingredientRefId,
      },
    })

    if (!maybeIngredientRef) {
      throw new Error('Could not resolve ingredientRef')
    }

    return maybeIngredientRef
  },
}
