import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  CreateRecipeStepInput,
  UpdateRecipeStepInput,
  RequiredResolverFn,
  ResolversTypes,
  ResolversParentTypes,
  RecipeRelationResolvers,
} from 'types/graphql'

import { validateWith } from '@redwoodjs/api'
import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server/dist/functions/types'

import { requireAuth, requireRecipeAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { mapStepsMutationInputToDbCreateManyStepOutputUsesInput } from '../stepOutputUses/stepOutputUsesUtilities'

import { createRecipeImage } from './recipeImageHandler'
import {
  mapStepsMutationInputToDbCreateInputNoStepOutputUses,
  mapStepsMutationInputToDbUpdateInputNoStepOutputUses,
} from './recipeUtilities'

export const recipes: QueryResolvers['recipes'] = () => {
  return db.recipe.findMany({
    where: {
      deletedAt: null,
    },
  })
}

export const usersRecipes: QueryResolvers['usersRecipes'] = ({ username }) => {
  return db.recipe.findMany({
    where: {
      chef: { username },
      AND: {
        deletedAt: null,
      },
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

const stepNumIsSequentialAndOneIndexed = (
  step: CreateRecipeStepInput | UpdateRecipeStepInput,
  stepIdx: number
) => {
  if (step.stepNum != stepIdx + 1) {
    return new Error(
      `Step ${stepIdx + 1} has the incorrect stepNum ${
        step.stepNum
      }. Step numbers must be sequential and start at 1`
    )
  }
}

const stepHasAtLeastOneIngredientOrStepOutput = (
  step: CreateRecipeStepInput | UpdateRecipeStepInput
) => {
  if (!step.ingredients?.length && !step.stepOutputUses?.length) {
    return new Error(
      `Step ${step.stepNum} must use at least one ingredient OR the output of at least one previous step`
    )
  }
}

const stepOutputUsesAreValid = (
  step: CreateRecipeStepInput | UpdateRecipeStepInput
) => {
  const errors: Array<Error> = []
  step.stepOutputUses?.length &&
    step.stepOutputUses.forEach((stepOutputUse) => {
      const { outputOfStepNum } = stepOutputUse || {
        outputOfStepNum: undefined,
      }
      // a step can't use the output of a step that didn't come before it
      if (outputOfStepNum && outputOfStepNum >= step.stepNum) {
        errors.push(
          new Error(
            `Step ${step.stepNum} is using the output of step ${outputOfStepNum}. Steps can only use the outputs of previous steps`
          )
        )
      }
    })
  return errors
}

const stepValidations = (
  input: Array<CreateRecipeStepInput | UpdateRecipeStepInput>
) => {
  const errors: Array<Error> = []
  input.forEach((step, stepIdx) => {
    const stepNumError = stepNumIsSequentialAndOneIndexed(step, stepIdx)
    if (stepNumError) errors.push(stepNumError)
    const stepIngOrOutputError = stepHasAtLeastOneIngredientOrStepOutput(step)
    if (stepIngOrOutputError) errors.push(stepIngOrOutputError)
    const stepOutputUseErrors = stepOutputUsesAreValid(step)
    if (stepOutputUseErrors.length) errors.push(...stepOutputUseErrors)
  })
  if (errors.length) throw errors
}

export const createRecipe: MutationResolvers['createRecipe'] = async ({
  input,
}) => {
  requireAuth()

  const { title, description, servings, steps } = input
  validateWith(() => {
    stepValidations(steps)
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

    const recipeId = newRecipeNoStepOutputUses.id

    // 2. Create the step output uses
    await tx.stepOutputUse.createMany({
      data: mapStepsMutationInputToDbCreateManyStepOutputUsesInput(
        recipeId,
        steps
      ),
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
    stepValidations(steps)
  })

  const recipeNoStepOutputUsesDbInput: Prisma.RecipeUpdateInput = {
    title,
    description,
    servings,
    steps: mapStepsMutationInputToDbUpdateInputNoStepOutputUses(steps, id),
  }

  return await db.$transaction(async (tx) => {
    // 1. Create the recipe
    const updatedRecipeNoStepOutputUses = await tx.recipe.update({
      where: { id },
      data: recipeNoStepOutputUsesDbInput,
    })

    const recipeId = updatedRecipeNoStepOutputUses.id

    // 2. Delete any existing step output uses. Doing it this way because it's the easiest way to figure out which should be deleted :)
    await tx.stepOutputUse.deleteMany({ where: { recipeId: recipeId } })

    // 3. Create the step output uses
    await tx.stepOutputUse.createMany({
      data: mapStepsMutationInputToDbCreateManyStepOutputUsesInput(
        recipeId,
        steps
      ),
    })

    return updatedRecipeNoStepOutputUses
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

type RequiredRecipeRelationResolvers = RecipeRelationResolvers & {
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

  imageUrl: async (_obj, { root }) => {
    const maybeRecipe = await db.recipe.findUnique({
      where: { id: root?.id },
    })
    if (!maybeRecipe) {
      throw new Error('Could not resolve recipe')
    }
    const { title, description } = maybeRecipe

    return await createRecipeImage(title, description)
  },
}
