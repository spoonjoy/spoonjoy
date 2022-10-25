import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  RecipeRelationResolvers,
  CreateRecipeStepInput,
  UpdateRecipeStepInput,
} from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth, requireRecipeAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import {
  mapStepsMutationInputToDbCreateInput,
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

export const createRecipe: MutationResolvers['createRecipe'] = ({ input }) => {
  requireAuth()

  const { title, description, servings, steps } = input
  validateWith(() => {
    everyStepHasAtLeastOneIngredientOrStepOutput(steps)
  })

  const dbInput: Prisma.RecipeCreateInput = {
    title,
    description,
    servings,
    chef: {
      connect: {
        id: context.currentUser!.id,
      },
    },
    steps: mapStepsMutationInputToDbCreateInput(steps),
  }

  return db.recipe.create({
    data: dbInput,
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

export const Recipe: RecipeRelationResolvers = {
  chef: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).chef()
  },
  steps: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).steps()
  },
}
