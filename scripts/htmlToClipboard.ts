import { fetch } from '@whatwg-node/fetch'
import { JSDOM } from 'jsdom'

export default async ({ args }) => {
  async function fetchHtml(url: string): Promise<void> {
    if (!url) {
      console.error('Please provide a URL')
      return
    }

    try {
      const { default: clipboardy } = await import('clipboardy')
      const webPageString = await fetch(url, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        },
      }).then((res) => res.text())

      const dom = new JSDOM(webPageString)
      const { document } = dom.window

      // Remove non-essential elements
      const elementsToRemove = [
        ...document.querySelectorAll(
          'head, style, script, img, svg, link, meta, noscript, [id*="comment"], [class*="comment"]'
        ),
      ]
      for (const el of elementsToRemove) {
        el.remove()
      }

      // Remove empty tags and tag attributes
      const allElements = [...document.getElementsByTagName('*')]
      for (const el of allElements) {
        if (el.textContent.trim() === '') {
          el.remove()
        } else {
          for (const attr of el.attributes) {
            el.removeAttribute(attr.name)
          }
        }
      }

      const cleanedHtml = document.body.innerHTML
      clipboardy.writeSync(cleanedHtml)
      console.log('Cleaned HTML content copied to clipboard!')
    } catch (error) {
      console.error(error)
    }
  }

  fetchHtml(
    'https://wholeandheavenlyoven.com/2021/01/11/avocado-smoked-salmon-salad-with-dijon-honey-vinaigrette/'
  )
}
