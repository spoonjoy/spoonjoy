export const stringIsAValidUrl = (s: string) => {
  try {
    new URL(s)
    return true
  } catch (err) {
    return false
  }
}

export const truncateString = (
  str: string | undefined | null,
  maxLength: number
): string | undefined => {
  if (!str) return undefined
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

export const unescapeHtml = (html: string) => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  const regex = /&(amp|lt|gt|quot|#39);/g
  return html.replace(
    regex,
    (match, entity) => entities[`&${entity};`] || match
  )
}
