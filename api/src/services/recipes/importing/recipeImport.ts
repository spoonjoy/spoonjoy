import { fetch } from '@whatwg-node/fetch'
import * as cheerio from 'cheerio'
import JSZip from 'jszip'
import pluralize from 'pluralize'
import puppeteer from 'puppeteer'
import { Recipe } from 'schema-dts'
import {
  CreateIngredientInput,
  CreateRecipeInput,
  CreateRecipeStepInput,
  QueryResolvers,
} from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { parseIngredients } from 'src/services/ingredients/ingredientParse'

import { CroutonRecipe } from './importedDataTypes'

export const importRecipe: QueryResolvers['importRecipe'] = async ({
  input,
}) => {
  const { source, url, fileUrl } = input

  if (source === 'WEBSITE') {
    if (!url) throw new RedwoodError('No URL provided')
    const recipe = await parseWebsiteData(url)
    return {
      returned: recipe.title,
    }
  } else if (source === 'CROUTON') {
    if (!fileUrl) throw new RedwoodError('No file URL provided')
    const recipes = await parseCroutonData(fileUrl)
    return {
      returned: fileUrl,
    }
  } else {
    throw new RedwoodError('Invalid source')
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

const websiteRecipeToSJRecipeInput = async (
  recipe: Recipe
): Promise<CreateRecipeInput> => {
  const websiteRecipeIngredientsAsSJIngredients = Array.isArray(
    recipe.recipeIngredient
  )
    ? await parseIngredients(recipe.recipeIngredient)
    : []

  const basicRecipeInfo: BasicRecipeInfo = {
    title: recipe.name?.toString() || 'could not find title',
    servings: parseInt(recipe.recipeYield ? toString() : '') || undefined,
    description: recipe.description?.toString() || undefined,
  }

  const basicRecipeStepsInfo: BasicRecipeStepInfo[] = Array.isArray(
    recipe.recipeInstructions
  )
    ? recipe.recipeInstructions?.map((step, idx) => ({
        stepNum: idx + 1,
        stepTitle: step.name || undefined,
        description: step.text || 'no description was provided for this step',
      }))
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
  'title' | 'servings' | 'description'
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
      `Couldn't figure out what steps these recipes belong to: ${JSON.stringify(
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

const getRecipeStructuredDataFromWebsite = async (
  url: string
): Promise<Recipe> => {
  let webPageString: string | null | undefined
  try {
    // first, try to get the website with fetch
    webPageString = await fetch(url).then((res) => res.text())
    // some web pages block fetch, so check for error
    if (
      !webPageString ||
      webPageString.includes('error') ||
      webPageString.includes('Forbidden')
    )
      throw new RedwoodError("Couldn't fetch")
  } catch (error) {
    console.error('Could not get the website using fetch, error:', error)

    // if fetch fails, try to get the website with puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    // await page.goto(url)
    await page.waitForSelector('script[type="application/ld+json"]')
    // const innerText = await page.$eval(
    //   'script[type="application/ld+json"]',
    //   (el) => el.textContent
    // )
    webPageString = await page.evaluate(
      () => document.querySelector('*')?.outerHTML
    )
  }
  if (!webPageString) throw new RedwoodError("Couldn't get web page content")

  const webPageHTML = cheerio.load(webPageString)
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
