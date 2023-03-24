import chromium from '@sparticuz/chromium-min'
import { fetch } from '@whatwg-node/fetch'
import puppeteer from 'puppeteer-core'

export const getWebPageUsingFetch = async (url: string) => {
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

export const getWebPageUsingPuppeteer = async (url: string) => {
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
