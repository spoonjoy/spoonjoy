import { fetch } from '@whatwg-node/fetch'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'
import { Recipe } from 'schema-dts'
import { QueryResolvers } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

export const importRecipe: QueryResolvers['importRecipe'] = async ({ url }) => {
  const recipe = await getRecipeStructuredData(url)

  return {
    returned: (recipe.headline?.valueOf() as string) || 'nothing returned',
  }
}

const getRecipeStructuredData = async (url: string): Recipe => {
  let webPageString: string | null | undefined
  try {
    // first, try to get the website with fetch
    webPageString = await fetch(url).then((res) => res.text())
  } catch (error) {
    console.error('Could not get the website using fetch, error:', error)

    // if fetch fails, try to get the website with puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto(url)
    await page.goto(url, { waitUntil: 'networkidle0' })
    // await page.waitForSelector('script[type="application/ld+json"]')
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
  const recipeLDJSON = JSON.parse(structuredData[0].children[0].data) as Recipe
  return recipeLDJSON
}
