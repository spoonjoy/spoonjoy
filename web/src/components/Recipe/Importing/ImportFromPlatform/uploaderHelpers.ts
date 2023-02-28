import JSZip from 'jszip'

export const splitJSZipIntoGroups = async (zip: JSZip): Promise<JSZip[]> => {
  const entries = Object.entries(zip.files)
  const numGroups = Math.ceil(entries.length / 10)
  const groups = await Promise.all(
    Array.from({ length: numGroups }, async (_, i) => {
      const start = i * 10
      const group = new JSZip()
      const files = entries.slice(start, start + 10)
      for (const [key, file] of files) {
        const data = await file.async('uint8array')
        group.file(key, data)
      }
      return group
    })
  )
  return groups
}

export const zipToFile = async (
  zip: JSZip,
  fileName: string
): Promise<File> => {
  const blob = await zip.generateAsync({ type: 'blob' })
  return new File([blob], fileName, { type: 'application/zip' })
}
export const getFormattedDateString = () => {
  const date = new Date()
  const isoString = date.toISOString()
  const [dateStr, timeStr] = isoString.split('T')
  const [year, month, day] = dateStr.split('-')
  const [hour, minute] = timeStr.slice(0, -1).split(':')
  return `${year}/${month}/${day}/${hour}/${minute}`
}
