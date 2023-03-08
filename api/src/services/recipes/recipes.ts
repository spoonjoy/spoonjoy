import type { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  CreateRecipeStepInput,
  UpdateRecipeStepInput,
  RecipeRelationResolvers,
  UpdateRecipeInput,
} from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth, requireRecipeAuth } from 'src/lib/auth'
import {
  cache,
  cacheFindMany,
  deleteCacheKey,
  getRecipeCacheKey,
  getRecipeInMyCookbooksCacheKey,
  getRecipesCacheKey,
  getRecipesStepsCacheKey,
  getUsersRecipesCacheKey,
} from 'src/lib/cache'
import { db } from 'src/lib/db'

import { mapStepsMutationInputToDbCreateManyStepOutputUsesInput } from '../stepOutputUses/stepOutputUsesUtilities'
import { user } from '../users/users'

import { createRecipeImage } from './recipeImageHandler'
import {
  mapStepsMutationInputToDbCreateInputNoStepOutputUses,
  mapStepsMutationInputToDbUpdateInputNoStepOutputUses,
} from './recipeUtilities'

export const recipes: QueryResolvers['recipes'] = () => {
  return cacheFindMany(getRecipesCacheKey(), db.recipe, {
    conditions: {
      where: {
        deletedAt: null,
      },
    },
  })
}

export const usersRecipes: QueryResolvers['usersRecipes'] = async ({
  username,
}) => {
  // we need to do this manually instead of using cacheFindMany because we need to not filter based on deletedAt
  const latest = await db.recipe.findFirst({
    where: {
      chef: { username },
    },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, updatedAt: true },
  })
  return cache(
    getUsersRecipesCacheKey(username, latest?.id, latest?.updatedAt),
    () => {
      return db.recipe.findMany({
        where: {
          chef: { username },
          AND: {
            deletedAt: null,
          },
        },
        orderBy: { title: 'asc' },
      })
    }
  )
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return cache(getRecipeCacheKey(id), () => {
    return db.recipe.findUnique({
      where: { id },
    })
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

  return await db.$transaction(
    async (tx) => {
      // 1. Create the recipe
      const newRecipeNoStepOutputUses = await tx.recipe.create({
        data: recipeNoStepOutputUsesDbInput,
      })

      const recipeId = newRecipeNoStepOutputUses.id

      await tx.recipe.update({
        where: { id: recipeId },
        data: {
          imageUrl: await createRecipeImage(title, description, recipeId),
        },
      })

      // 2. Create the step output uses
      await tx.stepOutputUse.createMany({
        data: mapStepsMutationInputToDbCreateManyStepOutputUsesInput(
          recipeId,
          steps
        ),
      })

      return newRecipeNoStepOutputUses
    },
    { timeout: 15000 }
  )
}

/**
 * Only update the recipe image if:
 * - The title has changed, OR
 * - The description has been changed AND to something that exists (aka, don't change if the description was simply removed)
 */
const shouldUpdateRecipeImage = async (
  recipeId: string,
  input: UpdateRecipeInput
) => {
  const recipeOldInfo = await db.recipe.findUnique({
    where: { id: recipeId },
  })

  if (
    input.title != recipeOldInfo?.title
    //  || (input.description && input.description !== recipeOldInfo.description)
  ) {
    return true
  } else {
    return false
  }
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
    // imageUrl: (await shouldUpdateRecipeImage(id, input))
    //   ? await createRecipeImage(title, description, id)
    //   : undefined,
    steps: mapStepsMutationInputToDbUpdateInputNoStepOutputUses(steps, id),
  }

  const updatedRecipe = await db.$transaction(async (tx) => {
    // 1. Update the recipe
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

  await deleteCacheKey(getRecipeCacheKey(id))
  return updatedRecipe
}

/** instead of deleting a recipe, this method marks it as deleted */
export const deleteRecipe: MutationResolvers['deleteRecipe'] = async ({
  id,
}) => {
  await requireRecipeAuth(id)

  await db.recipeInCookbook.deleteMany({ where: { recipeId: id } })

  return db.recipe.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  // return db.recipe.delete({
  //   where: { id },
  // })
}

export const Recipe: RecipeRelationResolvers = {
  chef: async (_obj, { root }) => {
    const maybeChef = await user({ id: root.chefId })

    if (!maybeChef) {
      throw new Error('Could not resolve chef')
    }

    return maybeChef
  },
  steps: async (_obj, { root }) => {
    // steps doesn't have its own resolver for this
    const maybeSteps = cacheFindMany(
      getRecipesStepsCacheKey(root.id),
      db.recipeStep,
      {
        conditions: {
          where: { recipeId: root.id },
        },
      }
    )

    if (!maybeSteps) {
      throw new Error('Could not resolve steps')
    }

    return maybeSteps
  },
  inMyCookbooks: async (_obj, { root }) => {
    const { currentUser } = context
    if (!currentUser) {
      return null
    }

    // steps doesn't have its own resolver for this
    return cacheFindMany(
      getRecipeInMyCookbooksCacheKey(currentUser.username, root.id),
      db.recipeInCookbook,
      {
        conditions: { where: { addedById: currentUser.id, recipeId: root.id } },
      }
    )
  },
}
