import Fraction from 'fraction.js'
import parse from 'html-react-parser'
import ReactDOMServer from 'react-dom/server'

export const numberToPrettyFraction = (
  number: number
): string | JSX.Element | JSX.Element[] => {
  const fractionStr = new Fraction(number).toFraction(true)
  const htmlStr = fractionStr.replace(
    /\b(\d+)\/(\d+)/g,
    '<sup>$1</sup>&frasl;<sub>$2</sub>'
  )
  return parse(htmlStr)
}

export const multiplyNumbersInString = (
  input: string,
  multiplier: number
): string | JSX.Element | JSX.Element[] => {
  const regex = /(\d+\.?\d*|\.\d+)/g
  const htmlStr = input.replace(regex, (match) => {
    const number = parseFloat(match) * multiplier
    const prettyFraction = numberToPrettyFraction(number)
    return typeof prettyFraction === 'string'
      ? prettyFraction
      : ReactDOMServer.renderToStaticMarkup(prettyFraction as JSX.Element)
  })

  return parse(htmlStr)
}
