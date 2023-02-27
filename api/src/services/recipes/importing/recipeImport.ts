import type { Prisma } from '@prisma/client'
import chromium from '@sparticuz/chromium-min'
import { fetch } from '@whatwg-node/fetch'
import * as cheerio from 'cheerio'
import JSZip from 'jszip'
import pluralize from 'pluralize'
import puppeteer from 'puppeteer-core'
import { Recipe } from 'schema-dts'
import {
  CreateIngredientInput,
  CreateRecipeInput,
  CreateRecipeStepInput,
  MutationResolvers,
} from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { parseIngredients } from 'src/services/ingredients/ingredientParse'

import {
  createRecipeImage,
  uploadImageToCloudinary,
} from '../recipeImageHandler'
import { mapStepsMutationInputToDbCreateInputNoStepOutputUses } from '../recipeUtilities'

import { CroutonRecipe } from './importedDataTypes'
import {
  stringIsAValidUrl,
  truncateString,
  unescapeHtml,
} from './importHelpers'

/**
 * create the recipe - not doing it using the createRecipe resolver because:
 * - I don't want to create a recipe image if the recipe already exists
 * - I don't want to apply all the validations that the createRecipe resolver does
 * - There's no stepOutputUses in an imported recipe, so I don't need to create those
 */
const simpleCreateRecipe = async (input: CreateRecipeInput, url?: string) => {
  // If nobody's logged in, create the recipe for the chef-rj user
  const createForUsername = context.currentUser?.username || 'chef-rj'

  const { title, description, servings, steps, existingImageUrl } = input

  // substrings should match the schema

  const recipeDbInput: Prisma.RecipeCreateInput = {
    title: truncateString(title, 60) as string,
    description: truncateString(description, 140),
    servings,
    sourceUrl: url,
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
          imageUrl: existingImageUrl
            ? await uploadImageToCloudinary(existingImageUrl, recipeId)
            : await createRecipeImage(title, description, recipeId),
        },
      })

      // if logged in, add to 'imported' cookbook
      if (context.currentUser) {
        const IMPORT_COOKBOOK_NAME = 'imported'
        await tx.recipeInCookbook.create({
          data: {
            cookbook: {
              connectOrCreate: {
                where: {
                  authorId_title: {
                    authorId: context.currentUser.id,
                    title: IMPORT_COOKBOOK_NAME,
                  },
                },
                create: {
                  authorId: context.currentUser.id,
                  title: IMPORT_COOKBOOK_NAME,
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
}

export const importRecipeFromWebsite: MutationResolvers['importRecipeFromWebsite'] =
  async ({ url }) => {
    const recipe = await parseWebsiteData(url)

    const newRecipe = await simpleCreateRecipe(recipe, url)

    return {
      recipeId: newRecipe.id,
    }
  }

export const importRecipesFromCrouton: MutationResolvers['importRecipesFromCrouton'] =
  async ({ fileUrl }) => {
    const recipes = await parseCroutonData(fileUrl)
    return {
      returned: fileUrl,
    }
  }

const parseCroutonData = async (fileUrl: string) => {
  const jsons = await getJsonsFromZipFileUrl<CroutonRecipe>(fileUrl)
  const sjRecipeInputs = await Promise.all(
    croutonRecipesToSJRecipeInputs(jsons)
  )
  return sjRecipeInputs
}

const parseWebsiteData = async (url: string) => {
  const recipeStructuredData = await getRecipeStructuredDataFromWebsite(url)
  const sjRecipeInput = await websiteRecipeToSJRecipeInput(recipeStructuredData)
  return sjRecipeInput
}

/**
 * Known formats:
 * - recipe.image is string
 * - recipe.image is array of strings
 * - recipe.image if object with url property
 * - recipe.image is array of objects with url property
 */
const getImageFromLDJson = (recipe: Recipe): string | undefined => {
  let potentialImage: string | undefined
  if (!recipe.image) return undefined
  if (typeof recipe.image === 'string') return recipe.image
  if (Array.isArray(recipe.image)) {
    const firstImage = recipe.image[0]
    // not sure if it'll be a string or an object
    potentialImage = firstImage
      ? ((firstImage.url || firstImage) as string)
      : undefined
  } else {
    potentialImage = recipe.image.url ? (recipe.image.url as string) : undefined
  }
  return potentialImage && stringIsAValidUrl(potentialImage)
    ? potentialImage
    : undefined
}

const websiteRecipeToSJRecipeInput = async (
  recipe: Recipe
): Promise<CreateRecipeInput> => {
  const websiteRecipeIngredientsAsSJIngredients = Array.isArray(
    recipe.recipeIngredient
  )
    ? await parseIngredients(recipe.recipeIngredient)
    : []

  const existingImageUrl = getImageFromLDJson(recipe)

  const basicRecipeInfo: BasicRecipeInfo = {
    title: recipe.name?.toString() || 'could not find title',
    servings: parseInt(recipe.recipeYield ? toString() : '') || undefined,
    description: recipe.description?.toString() || undefined,
    existingImageUrl,
  }

  const basicRecipeStepsInfo: BasicRecipeStepInfo[] = Array.isArray(
    recipe.recipeInstructions
  )
    ? recipe.recipeInstructions?.map((step, idx) => ({
        stepNum: idx + 1,
        stepTitle:
          step.name !== step.text ? truncateString(step.name, 191) : undefined,
        description:
          truncateString(step.text, 1000) ||
          'no description was provided for this step',
      }))
    : recipe.recipeInstructions
    ? [{ stepNum: 1, description: recipe.recipeInstructions as string }] // it might just be a string
    : []

  const recipeStepsWithIngredients = addIngredientsToSteps(
    basicRecipeStepsInfo,
    websiteRecipeIngredientsAsSJIngredients
  )

  return {
    ...basicRecipeInfo,
    steps: recipeStepsWithIngredients,
  } as CreateRecipeInput
}

const croutonRecipesToSJRecipeInputs = (
  croutonRecipes: CroutonRecipe[]
): Promise<CreateRecipeInput>[] => {
  const sjRecipeInputs = croutonRecipes.map(async (croutonRecipe) => {
    const croutonRecipeIngredientsAsStrings = croutonRecipe.ingredients.map(
      (ing) => {
        return `${ing.quantity.amount} ${ing.quantity.quantityType} ${ing.ingredient.name}`
      }
    )

    const croutonRecipeIngredientsAsSJIngredients = await parseIngredients(
      croutonRecipeIngredientsAsStrings
    )

    const basicRecipeInfo: BasicRecipeInfo = {
      title: croutonRecipe.name,
      servings: croutonRecipe.serves,
      description: croutonRecipe.notes,
    }

    const basicRecipeStepsInfo: BasicRecipeStepInfo[] = croutonRecipe.steps.map(
      (croutonStep) => ({
        stepNum: croutonStep.order + 1,
        description: croutonStep.step,
        // TODO: generate step title
      })
    )

    const recipeStepsWithIngredients = addIngredientsToSteps(
      basicRecipeStepsInfo,
      croutonRecipeIngredientsAsSJIngredients
    )

    return {
      ...basicRecipeInfo,
      steps: recipeStepsWithIngredients,
    } as CreateRecipeInput
  })
  return sjRecipeInputs
}

type BasicRecipeInfo = Pick<
  CreateRecipeInput,
  'title' | 'servings' | 'description' | 'existingImageUrl'
>
type BasicRecipeStepInfo = Pick<
  CreateRecipeStepInput,
  'stepNum' | 'stepTitle' | 'description'
>

const addIngredientsToSteps = (
  steps: BasicRecipeStepInfo[],
  ingredients: CreateIngredientInput[]
): CreateRecipeStepInput[] => {
  // we'll remove ingredients as we use them
  let remainingIngredients = [...ingredients]
  // for each step, check if it uses any ingredients
  const stepsWithIngredients = steps.map((step) => {
    // for each ingredient, check if it's used in the step
    const usedIngs: CreateIngredientInput[] = []
    remainingIngredients = remainingIngredients.filter((ingredient) => {
      const isUsed = step.description
        .toLowerCase()
        .includes(pluralize.singular(ingredient.ingredientName.toLowerCase()))
      if (isUsed) {
        usedIngs.push(ingredient)
      }
      return !isUsed
    })
    return {
      ...step,
      ingredients: usedIngs,
    }
  })
  if (remainingIngredients.length > 0) {
    console.warn(
      `Couldn't figure out what steps these ingredients belong to: ${JSON.stringify(
        remainingIngredients
      )}`
    )
    stepsWithIngredients[0].ingredients = [
      ...stepsWithIngredients[0].ingredients,
      ...remainingIngredients,
    ]
  }
  return stepsWithIngredients
}

const getJsonsFromZipFileUrl = async <T>(fileUrl: string) => {
  const response = await fetch(fileUrl)
  const croutons = await JSZip.loadAsync(await response.arrayBuffer())
  const jsonPromises = Object.values(croutons.files).map(async (file) => {
    const fileContent = await file.async('string')
    const contentAsJson = JSON.parse(fileContent) as T
    return contentAsJson
  })

  return await Promise.all(jsonPromises)
}

const getWebPageUsingFetch = async (url: string) => {
  const webPageString = await fetch(url, {
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    },
  }).then((res) => res.text())
  return webPageString
}

const getWebPageUsingPuppeteer = async (url: string) => {
  // if fetch fails, try to get the website with puppeteer
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      'https://sj-misc.s3.amazonaws.com/chromium-v111.0.0-pack.tar'
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  // await page.goto(url)
  await page.waitForSelector('script[type="application/ld+json"]')
  // const innerText = await page.$eval(
  //   'script[type="application/ld+json"]',
  //   (el) => el.textContent
  // )
  const webPageString = await page.evaluate(
    () => document.querySelector('*')?.outerHTML
  )

  return webPageString
}

const getRecipeStructuredDataFromWebsite = async (
  url: string
): Promise<Recipe> => {
  // first, try to get the website with fetch
  const webPageString = await getWebPageUsingFetch(url)

  const webPageHTML = cheerio.load(unescapeHtml(webPageString))
  const structuredData = webPageHTML('script[type="application/ld+json"]')

  const firstRecipeElement = structuredData
    .filter((i, el) => {
      const scriptContent = webPageHTML(el).html()
      const scriptJson = JSON.parse(scriptContent || '{}')

      let type: string | string[] | undefined
      // if scriptJson is an array, get the first element
      if (Array.isArray(scriptJson)) {
        type = scriptJson[0]['@type'] as string | string[] | undefined
      } else {
        type = scriptJson['@type'] as string | string[] | undefined
      }
      return (type && (type === 'Recipe' || type.includes('Recipe'))) || false
    })
    .get()[0]

  if (!firstRecipeElement) throw new RedwoodError("Couldn't find recipe")

  const scriptString = webPageHTML(firstRecipeElement).html() || ''

  const recipeLDJSON = JSON.parse(scriptString)

  return Array.isArray(recipeLDJSON) ? recipeLDJSON[0] : recipeLDJSON
}
