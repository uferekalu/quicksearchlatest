import React, { useEffect, useState, useRef } from 'react'
import { web_summary } from '../api/google_api'

/**
 * Custom hook to handle the show and hide logic for web summaries with delay.
 * @param {string} url - URL to fetch the web summary for.
 * @param {number} showDelay - Delay in milliseconds for showing the summary (default 700ms).
 * @param {number} hideDelay - Delay in milliseconds for hiding the summary (default 200ms).
 * @returns {Object} - Object containing state and handlers for show/hide actions.
 */
export function useWebSummary(url, showDelay = 700, hideDelay = 200) {
  const [showWebSummary, setShowWebSummary] = useState(false)
  const hideSummaryTimeoutRef = useRef(null)
  const showSummaryTimeoutRef = useRef(null)
  const [webSummaryResult, setWebSummaryResult] = useState(null)
  const [webSummaryLoading, setWebSummaryLoading] = useState(false)

  const clearTimer = (timerRef) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleShowWebSummary = () => {
    clearTimer(hideSummaryTimeoutRef)
    showSummaryTimeoutRef.current = setTimeout(async () => {
      setShowWebSummary(true)
      setWebSummaryLoading(true)
      const result = await web_summary(url)
      setWebSummaryResult(result)
      setWebSummaryLoading(false)
    }, showDelay)
  }

  const handleHideWebSummary = () => {
    clearTimer(showSummaryTimeoutRef)
    hideSummaryTimeoutRef.current = setTimeout(() => {
      setShowWebSummary(false)
      setWebSummaryResult(null)
    }, hideDelay)
  }

  useEffect(() => {
    return () => {
      clearTimer(hideSummaryTimeoutRef)
      clearTimer(showSummaryTimeoutRef)
    }
  }, [])

  return {
    showWebSummary,
    handleShowWebSummary,
    handleHideWebSummary,
    webSummaryResult,
    webSummaryLoading,
  }
}

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

export async function getScholarStoredQuery() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['scholarStoredQuery'], (result) => {
      resolve(result['scholarStoredQuery'] || null)
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

export const ImageWithFallback = ({ src, fallbackSrc, alt, styleString }) => {
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    setImgSrc(fallbackSrc)
  }

  return (
    <img src={imgSrc} alt={alt} onError={handleError} className={styleString} />
  )
}

export function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      className="generalBookmarkSpinner"
    >
      <g fill="#034aa6">
        <path
          fillRule="evenodd"
          d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
          clipRule="evenodd"
          opacity={0.2}
        ></path>
        <path d="M12 22c5.523 0 10-4.477 10-10h-3a7 7 0 0 1-7 7zM2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z"></path>
      </g>
    </svg>
  )
}
