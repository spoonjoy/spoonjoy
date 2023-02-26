import chromium from '@sparticuz/chromium'
import { fetch } from '@whatwg-node/fetch'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer-core'
import { Recipe } from 'schema-dts'

import { RedwoodError } from '@redwoodjs/api'

import { logger } from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(
    `${event.httpMethod} ${event.path}: getRecipeStructuredDataFromWebsite function`
  )

  try {
    const { url } = event.queryStringParameters
    const recipe = await getRecipeStructuredDataFromWebsite(url)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: recipe,
      }),
    }
  } catch (error: any) {
    logger.error('Error in getRecipeStructuredDataFromWebsite function:', error)
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

const getRecipeStructuredDataFromWebsite = async (
  url: string
): Promise<Recipe> => {
  let webPageString: string | null | undefined

  // first, try to get the website with fetch
  webPageString = await fetch(url).then((res) => res.text())
  // some web pages block fetch, so check for error
  if (
    !webPageString ||
    webPageString.includes('error') ||
    webPageString.includes('Forbidden')
  ) {
    console.error('Could not get the website using fetch')

    // if fetch fails, try to get the website with puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
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
