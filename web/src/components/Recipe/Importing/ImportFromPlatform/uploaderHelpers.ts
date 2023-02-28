import JSZip from 'jszip'

export async function splitJSZipIntoGroups(zip: JSZip): Promise<JSZip[]> {
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
