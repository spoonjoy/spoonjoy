import Fraction from 'fraction.js'
import parse from 'html-react-parser'

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
