const getPhase = (phase) => phase * 10 - 9

export async function google_search(query, phase) {
  const GAPI_KEY = process.env.EXT_PUBLIC_GAPI_KEY
  const GSearch_ID = process.env.EXT_PUBLIC_GSearch_ID
  const startIndex = getPhase(phase)
  const URL = `https://www.googleapis.com/customsearch/v1?key=${GAPI_KEY}&cx=${GSearch_ID}&q=${encodeURIComponent(
    query
  )}&start=${startIndex}&num=10`

  try {
    const response = await fetch(URL)

    if (!response.ok) throw new Error(`HTTP error, status = ${response.status}`)

    const data = await response.json()

    if (data.items && data.items.length > 0) return data.items
    return []
  } catch (err) {
    throw new Error(err)
  }
}

export async function google_scholar(query, phase) {
  const origin = process.env.EXT_PUBLIC_QAPI_URL
  const URL = `${origin}/search-google-scholar?query=${encodeURIComponent(
    query
  )}&page=${phase}`

  try {
    const response = await fetch(URL)

    if (!response.ok) throw new Error(`HTTP error, status = ${response.status}`)

    const data = await response.json()

    if (data.length > 0) return data
    return []
  } catch (err) {
    throw new Error(err)
  }
}

export function getFavicon(url) {
  try {
    const urlObj = new URL(url)
    return `${urlObj.origin}/favicon.ico`
  } catch {
    return 'localhost:3011/favicon.ico'
  }
}
