import React, { useState, useRef, useEffect } from 'react'
import '../searchResult/SearchResults.css'
import { openLink, useWebSummary } from '../../utils/utility'
import WebSummary from '../webSummary/WebSummary'
import Backdrop from '../backdrop/Backdrop'

export default function SearchResults({ result }) {
  const {
    showWebSummary,
    handleShowWebSummary,
    handleHideWebSummary,
    webSummaryResult,
    webSummaryLoading,
  } = useWebSummary(result.link)

  return (
    <div className="searchResultsContainer">
      <div className="searchResultsContentsHolder">
        <div className="searchResultsContent">
          <img
            src={
              result.pagemap && result.pagemap.cse_thumbnail
                ? result.pagemap.cse_thumbnail[0].src
                : 'icons/icon48.png'
            }
            alt="pic"
            className="searchResultPic"
          />
          <div className="searchResultsContentContainer">
            <h3 className="searchResultContentHeader">{result.title}</h3>
            <p className="searchResultContentDesc">{result.snippet}</p>
            <span className="searchResultsContentDetail">
              <a
                href="#"
                className="searchResultsContentDetail"
                onMouseEnter={handleShowWebSummary}
                onMouseLeave={handleHideWebSummary}
                onClick={(e) => {
                  e.preventDefault()
                  openLink(result.link, true)
                }}
              >
                See details {'>'}
              </a>
              {showWebSummary && (
                <WebSummary
                  result={webSummaryResult}
                  isLoading={webSummaryLoading}
                  onMouseEnter={handleShowWebSummary}
                  onMouseLeave={handleHideWebSummary}
                />
              )}
              {showWebSummary && <Backdrop />}
            </span>
          </div>
        </div>
        <div className="bookmarkIconHolder">
          <img
            src="images/bookmarkIcon.svg"
            alt="bookmarkIcon"
            className="bookmarkIcon"
          />
        </div>
      </div>
    </div>
  )
}
