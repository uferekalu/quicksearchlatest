import React from 'react'
import '../searchResult/SearchResults.css'
import { openLink } from '../../utils/utility'

export default function SearchResults({ result }) {
  return (
    <div className="searchResultsContainer">
      {/* <span className="searchResultsTotal">200 Results</span> */}
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
            <span
              className="searchResultsContentDetail"
              onClick={(e) => openLink(result.link, true)}
            >
              See details {'>'}
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
