import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureHttpPrefix(url: string) {
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url
  }
  return `https://${url}`
}

export function checkUrlPrefix(query: string) {
  return (
    query.startsWith("https://") ||
    query.startsWith("www.") ||
    query.startsWith("http://")
  )
}

export function getDomain(url: string) {
  // Remove 'http://' or 'https://' and 'www.' if present
  return url.replace(/^(https?:\/\/)?(www\.)?/, "")
}

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export function b64toBlob(b64Data: string, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data.split(",")[1])
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export function base64ToBlob(
  base64: string,
  contentType = "",
  sliceSize = 512,
) {
  const byteCharacters = atob(base64.split(",")[1])
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export function blobToFile(blob: Blob, fileName: string) {
  // biome-ignore lint/suspicious/noExplicitAny: false
  const b: any = blob
  b.name = fileName
  b.lastModifiedDate = new Date()
  return b as File
}

// biome-ignore lint/suspicious/noExplicitAny: false
export function areObjectsEqual<T extends Record<string, any>>(
  obj1: T,
  obj2: T,
  keysToIgnore?: string[],
): boolean {
  const filteredKeys = keysToIgnore
    ? Object.keys(obj1).filter((key) => !keysToIgnore.includes(key))
    : Object.keys(obj1)

  return filteredKeys.every((key) => obj1[key] === obj2[key])
}

/**
 * Extracts unique values from an array of objects based on a given key.
 * Optionally excludes a specific value from the result.
 *
 * @template T - The object type in the array.
 * @template K - The key in the object whose values should be extracted.
 * @param {T[]} array - The array of objects to extract values from.
 * @param {K} key - The key whose values should be collected.
 * @param {T[K]} [exclude] - An optional value to exclude from the result.
 * @returns {T[K][]} - An array of values corresponding to the specified key.
 *
 * @example
 * const searchEngines = [
 *   { name: "Google", short: "g" },
 *   { name: "Bing", short: "b" },
 *   { name: "DuckDuckGo", short: "d" },
 * ];
 *
 * const result = extractUniqueValues(searchEngines, "short", "b");
 * console.log(result); // Output: ["g", "d"]
 */
export function extractUniqueValues<T, K extends keyof T>(
  array: T[],
  key: K,
  exclude?: T[K],
): T[K][] {
  return array.reduce<T[K][]>((acc, item) => {
    if (item[key] !== exclude) acc.push(item[key])
    return acc
  }, [])
}

export const trimSpaces = (str: string) => str.replace(/\s+/g, " ").trim()

export const googleFavIcon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
