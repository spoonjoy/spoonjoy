import { fetch } from '@whatwg-node/fetch'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import { Recipe } from 'schema-dts'
import { QueryResolvers } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

export const importRecipe: QueryResolvers['importRecipe'] = async ({ url }) => {
  const recipe = await getRecipeStructuredData(url)

  return {
    returned: recipe.name?.toString() || 'No name',
  }
}

const getRecipeStructuredData = async (url: string): Promise<Recipe> => {
  let webPageString: string | null | undefined
  try {
    // first, try to get the website with fetch
    webPageString = await fetch(url).then((res) => res.text())
    if (!webPageString || webPageString.includes('error'))
      throw new RedwoodError("Couldn't fetch")
  } catch (error) {
    console.error('Could not get the website using fetch, error:', error)

    // if fetch fails, try to get the website with puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto(url, { waitUntil: 'networkidle0' })
    await page.goto(url)
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
