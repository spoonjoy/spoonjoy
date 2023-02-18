import { fetch } from '@whatwg-node/fetch'
import * as cheerio from 'cheerio'
import JSZip from 'jszip'
import puppeteer from 'puppeteer'
import { Recipe } from 'schema-dts'
import { CreateRecipeInput, QueryResolvers } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { CroutonRecipe } from './importedDataTypes'

export const importRecipe: QueryResolvers['importRecipe'] = async ({
  input,
}) => {
  const { source, url, fileUrl } = input

  if (source === 'WEBSITE') {
    if (!url) throw new RedwoodError('No URL provided')
    const recipe = await getRecipeStructuredDataFromWebsite(url)
    return {
      returned: recipe.name?.toString() || 'No name',
    }
  } else if (source === 'CROUTON') {
    if (!fileUrl) throw new RedwoodError('No file URL provided')
    const recipe = await parseCroutonData(fileUrl)
    return {
      returned: fileUrl,
    }
  } else {
    throw new RedwoodError('Invalid source')
  }
}

const parseCroutonData = async (fileUrl: string) => {
  const jsons = await getJsonsFromZipFileUrl<CroutonRecipe>(fileUrl)
  console.log(jsons)
}

const croutonRecipesToSJRecipeInputs = (
  croutonRecipes: CroutonRecipe[]
): CreateRecipeInput[] => {
  const sjRecipeInputs = croutonRecipes.map((croutonRecipe) => {
    const croutonRecipeIngredientsAsStrings = croutonRecipe.ingredients.map(
      (ing) => {
        return `${ing.quantity.amount} ${ing.quantity.quantityType} ${ing.ingredient.name}`
      }
    )

    const sjRecipeInput: CreateRecipeInput = {
      title: croutonRecipe.name,
      servings: croutonRecipe.serves,
      description: croutonRecipe.notes,
    }
    return sjRecipeInput
  })
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
