import { minify } from 'html-minifier'
import { JSDOM } from 'jsdom'

import { RedwoodError } from '@redwoodjs/api'

import { getWebPageUsingFetch } from './getWebpage'

export const fetchAndCleanHtml = async (
  url: string
): Promise<string | null> => {
  try {
    const webPageString = await getWebPageUsingFetch(url)

    const minifiedHtml = minifyAndExtractContent(webPageString)

    return minifiedHtml
  } catch (error) {
    throw new RedwoodError(error)
  }
}

function minifyAndExtractContent(html: string): string | null {
  // Find the important part of the page
  const dom = new JSDOM(html)
  const { document: doc } = dom.window
  let importantPart: HTMLElement | Element | null = null

  const recipeTag = doc.querySelector('wprm-recipe')
  if (recipeTag) {
    importantPart = recipeTag.parentElement
  } else {
    const articleTag = doc.querySelector('article')
    if (articleTag) {
      importantPart = articleTag
    } else {
      const recipeSection = doc.querySelector('.o-Recipe')
      if (recipeSection) {
        importantPart = recipeSection
      }
    }
  }

  if (!importantPart) {
    return null
  }

  // remove unnecessary elements
  const forFoodNetwork = ', [class*="o-RatingsAndReviews"]'
  const forAllRecipes = ', [class*="article-header"], [class*="feedback-list"]'
  const elementsToRemove = [
    ...importantPart.querySelectorAll(
      'head, style, script, img, svg, link, meta, noscript, [id*="comment"], [class*="comment"]' +
        forFoodNetwork +
        forAllRecipes
    ),
  ]
  for (const element of elementsToRemove) {
    element.remove()
  }

  // Remove unnecessary attributes from every tag in the important part
  for (const element of importantPart.querySelectorAll('*')) {
    element.removeAttribute('class')
    element.removeAttribute('style')
    element.removeAttribute('data-settings')
    // Add items not supported by minify
  }

  // // Minify the HTML code
  const minifiedHtml = minify(importantPart.innerHTML, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    continueOnParseError: true,
    decodeEntities: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true, // this breaks the HTML
    removeOptionalTags: true,
  })

  // Return the minified content of the important part
  return minifiedHtml
}
