export async function getGSearchValue() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['g-search'], (result) => {
      resolve(result['g-search'] || null)
    })
  })
}

export async function getStoredQuery() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['storedQuery'], (result) => {
      resolve(result['storedQuery'] || null)
    })
  })
}

export function openLink(url, openInNewTab) {
  if (openInNewTab) {
    chrome.tabs.create({ url })
  } else {
    chrome.tabs.update({ url })
  }
}
