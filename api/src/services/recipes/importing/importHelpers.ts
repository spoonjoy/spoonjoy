import type { Prisma } from '@prisma/client'
import { BulkImportResult, CreateRecipeInput } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { db } from 'src/lib/db'

import {
  createRecipeImage,
  uploadFileToCloudinary,
} from '../recipeImageHandler'
import { mapStepsMutationInputToDbCreateInputNoStepOutputUses } from '../recipeUtilities'

export const stringIsAValidUrl = (s: string) => {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

export const truncateString = (
  str: string | undefined | null,
  maxLength: number
): string | undefined => {
  if (!str) return undefined
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

export const unescapeHtml = (html: string) => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  const regex = /&(amp|lt|gt|quot|#39);/g
  return html.replace(
    regex,
    (match, entity) => entities[`&${entity};`] || match
  )
}

interface PrismaCreatedRecipe {
  title: string
  servings: number | null
  description: string | null
  sourceUrl: string | null
  id: string
  imageUrl: string
  createdAt: Date
  chefId: string
  deletedAt: Date | null
  sourceRecipeId: string | null
}

/**
 * create the recipe - not doing it using the createRecipe resolver because:
 * - I don't want to create a recipe image if the recipe already exists
 * - I don't want to apply all the validations that the createRecipe resolver does
 * - There's no stepOutputUses in an imported recipe, so I don't need to create those
 */
export const simpleCreateRecipe = async (
  input: CreateRecipeInput,
  addToCookbookName = 'imported'
): Promise<PrismaCreatedRecipe | RedwoodError> => {
  try {
    // If nobody's logged in, create the recipe for the chef-rj user
    const createForUsername = context.currentUser?.username || 'chef-rj'

    const { title, description, servings, steps, existingImage, sourceUrl } =
      input

    // substrings should match the schema

    const recipeDbInput: Prisma.RecipeCreateInput = {
      title: truncateString(title, 60) as string,
      description: truncateString(description, 140),
      servings,
      sourceUrl: sourceUrl,
      chef: {
        connect: {
          username: createForUsername,
        },
      },
      steps: mapStepsMutationInputToDbCreateInputNoStepOutputUses(steps),
    }

    const newRecipe = await db.$transaction(
      async (tx) => {
        // 1. Create the recipe
        const newRecipe = await tx.recipe.create({
          data: recipeDbInput,
        })

        const recipeId = newRecipe.id

        await tx.recipe.update({
          where: { id: recipeId },
          data: {
            imageUrl: existingImage
              ? await uploadFileToCloudinary(existingImage, recipeId)
              : await createRecipeImage(title, description, recipeId),
          },
        })

        // if logged in, add to cookbook
        if (context.currentUser) {
          await tx.recipeInCookbook.create({
            data: {
              cookbook: {
                connectOrCreate: {
                  where: {
                    authorId_title: {
                      authorId: context.currentUser.id,
                      title: addToCookbookName,
                    },
                  },
                  create: {
                    authorId: context.currentUser.id,
                    title: addToCookbookName,
                  },
                },
              },
              recipe: {
                connect: {
                  id: recipeId,
                },
              },
              addedBy: {
                connect: {
                  id: context.currentUser.id,
                },
              },
            },
          })
        }

        return newRecipe
      },
      { timeout: 15000 }
    )

    return newRecipe
  } catch (e) {
    console.error('Error creating recipe', e)
    if (e instanceof Error) {
      return e as RedwoodError
    } else {
      return new RedwoodError(`Error creating recipe: ${e}`)
    }
  }
}

export const createRecipesAndAddToCookbook = async (
  recipes: CreateRecipeInput[],
  addToCookbookName = 'imported'
): Promise<BulkImportResult> => {
  if (!context.currentUser?.id) {
    throw new RedwoodError('You must be logged in to bulk import recipes')
  }

  const cookbook = await db.cookbook.upsert({
    where: {
      authorId_title: {
        authorId: context.currentUser.id,
        title: addToCookbookName,
      },
    },
    update: {},
    create: {
      authorId: context.currentUser.id,
      title: addToCookbookName,
    },
  })

  const results = await Promise.all(
    recipes.map((recipe) => simpleCreateRecipe(recipe, addToCookbookName))
  )

  const createdRecipes: PrismaCreatedRecipe[] = []
  const errors: RedwoodError[] = []

  for (const result of results) {
    if (result instanceof RedwoodError) {
      errors.push(result)
    } else {
      createdRecipes.push(result)
    }
  }

  return {
    cookbookId: cookbook.id,
    failedCount: errors.length,
    importCount: createdRecipes.length,
  }
}
