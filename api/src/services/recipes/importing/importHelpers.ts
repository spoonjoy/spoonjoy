import type { Prisma } from '@prisma/client'
import * as cheerio from 'cheerio'
import { BulkImportResult, CreateRecipeInput } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { mapStepsMutationInputToDbCreateManyStepOutputUsesInput } from 'src/services/stepOutputUses/stepOutputUsesUtilities'

import {
  createRecipeImage,
  uploadFileToCloudinary,
} from '../recipeImageHandler'
import { mapStepsMutationInputToDbCreateInputNoStepOutputUses } from '../recipeUtilities'

export const stringIsAValidUrl = (s: string) => {
  try {
    // eslint-disable-next-line no-new
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

export const getImageFromHtml = async (
  html: string
): Promise<string | undefined> => {
  try {
    // Parse the HTML using Cheerio
    const $ = cheerio.load(unescapeHtml(html))

    // Try to find a good social media image
    const socialMediaImage = $('meta[property="og:image"]').attr('content')

    // Try to find a good SEO image
    const seoImage = $('meta[name="twitter:image"]').attr('content')

    // Try to find a good header image
    const headerImage = $('header img').attr('src')

    // Filter out any images that don't meet certain criteria
    const isValidImage = (imageUrl: string): boolean => {
      // Add your own criteria here, such as minimum image size or aspect ratio
      return true
    }
    const images = [socialMediaImage, seoImage, headerImage].filter(
      (imageUrl) => imageUrl && isValidImage(imageUrl)
    )

    // Return the first good image, if one was found
    if (images.length > 0) {
      return images[0]
    } else {
      return undefined
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
}

interface PrismaCreatedRecipe {
  title: string
  servings: string | null
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
 */
export const simpleCreateRecipe = async (
  input: CreateRecipeInput,
  customExistingImageUrl: string | undefined = undefined,
  customSourceUrl: string | undefined = undefined,
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
      sourceUrl: customSourceUrl || sourceUrl,
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

        // 2. Create the step output uses
        await tx.stepOutputUse.createMany({
          data: mapStepsMutationInputToDbCreateManyStepOutputUsesInput(
            recipeId,
            steps
          ),
        })

        await tx.recipe.update({
          where: { id: recipeId },
          data: {
            imageUrl: customExistingImageUrl
              ? await uploadFileToCloudinary(customExistingImageUrl, recipeId)
              : existingImage
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
