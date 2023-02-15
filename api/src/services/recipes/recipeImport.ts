import puppeteer from 'puppeteer'
import { QueryResolvers } from 'types/graphql'

export const importRecipe: QueryResolvers['importRecipe'] = async ({ url }) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url)

  await page.waitForSelector('script[type="application/ld+json"]')

  await page.setViewport({ width: 1080, height: 1024 })

  const innerText = await page.$eval(
    'script[type="application/ld+json"]',
    (el) => el.textContent
  )

  // const data =
  //   (await page.evaluate(() => document.querySelector('*')?.outerHTML)) || ''

  await browser.close()

  return { returned: innerText }
}
