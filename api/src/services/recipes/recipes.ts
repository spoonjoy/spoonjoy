import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  CreateRecipeStepInput,
  UpdateRecipeStepInput,
  RequiredResolverFn,
  ResolversTypes,
  ResolversParentTypes,
} from 'types/graphql'

import { validateWith } from '@redwoodjs/api'
import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { requireAuth, requireRecipeAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import {
  mapStepsMutationInputToDbCreateInputNoStepOutputUses,
  mapStepsMutationInputToDbUpdateInput,
} from './recipeUtilities'

export const recipes: QueryResolvers['recipes'] = () => {
  return db.recipe.findMany({
    where: {
      deletedAt: null,
    },
  })
}

export const myRecipes: QueryResolvers['myRecipes'] = () => {
  requireAuth()

  return db.recipe.findMany({
    where: {
      chefId: context.currentUser?.id,
      AND: {
        deletedAt: null,
      },
    },
  })
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
  })
}

// TODO add service validation for all step nums being sequential and starting at 1

const everyStepHasAtLeastOneIngredientOrStepOutput = (
  input: Array<CreateRecipeStepInput | UpdateRecipeStepInput>
) => {
  const errors: Array<Error> = []
  input.forEach((step) => {
    if (!step.ingredients?.length && !step.stepOutputUses?.length) {
      errors.push(
        new Error(
          `Step ${step.stepNum} must use at least one ingredient OR the output of at least one previous step`
        )
      )
    }
  })
  if (errors.length > 0) throw errors
}

export const createRecipe: MutationResolvers['createRecipe'] = async ({
  input,
}) => {
  requireAuth()

  const { title, description, servings, steps } = input
  validateWith(() => {
    everyStepHasAtLeastOneIngredientOrStepOutput(steps)
  })

  // Because steps in a recipe can refer to other steps, we need to first create the recipe so that we can have the recipe ID
  const recipeNoStepOutputUsesDbInput: Prisma.RecipeCreateInput = {
    title,
    description,
    servings,
    chef: {
      connect: {
        id: context.currentUser!.id,
      },
    },
    steps: mapStepsMutationInputToDbCreateInputNoStepOutputUses(steps),
  }

  return await db.$transaction(async (tx) => {
    // 1. Create the recipe
    const newRecipeNoStepOutputUses = await tx.recipe.create({
      data: recipeNoStepOutputUsesDbInput,
    })

    return newRecipeNoStepOutputUses
  })
}

export const updateRecipe: MutationResolvers['updateRecipe'] = async ({
  id,
  input,
}) => {
  await requireRecipeAuth(id)

  const { title, description, servings, steps } = input
  validateWith(() => {
    everyStepHasAtLeastOneIngredientOrStepOutput(steps)
  })

  const dbInput: Prisma.RecipeUpdateInput = {
    title,
    description,
    servings,
    steps: mapStepsMutationInputToDbUpdateInput(steps, id),
  }

  return db.recipe.update({
    where: { id },
    data: dbInput,
  })
}

/** instead of deleting a recipe, this method marks it as deleted */
export const deleteRecipe: MutationResolvers['deleteRecipe'] = async ({
  id,
}) => {
  await requireRecipeAuth(id)

  return db.recipe.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  // return db.recipe.delete({
  //   where: { id },
  // })
}

type RequiredRecipeRelationResolvers = {
  chef: RequiredResolverFn<
    ResolversTypes['User'],
    ResolversParentTypes['Recipe'],
    RedwoodGraphQLContext
  >
  steps: RequiredResolverFn<
    Array<ResolversTypes['RecipeStep']>,
    ResolversParentTypes['Recipe'],
    RedwoodGraphQLContext
  >
}

export const Recipe: RequiredRecipeRelationResolvers = {
  chef: async (_obj, { root }) => {
    const maybeChef = await db.recipe
      .findUnique({ where: { id: root?.id } })
      .chef()
    if (!maybeChef) {
      throw new Error('Could not resolve chef')
    }

    return maybeChef
  },
  steps: async (_obj, { root }) => {
    const maybeSteps = await db.recipe
      .findUnique({ where: { id: root?.id } })
      .steps()
    if (!maybeSteps) {
      throw new Error('Could not resolve steps')
    }

    return maybeSteps
  },
}
