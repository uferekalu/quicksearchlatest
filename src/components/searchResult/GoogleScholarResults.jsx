import React from 'react'
import { ImageWithFallback, useWebSummary } from '../../utils/utility'
import { getFavicon } from '../../api/google_api'
import WebSummary from '../webSummary/WebSummary'
import Backdrop from '../backdrop/Backdrop'

export default function GoogleScholarResults({ result }) {
  const {
    showWebSummary,
    handleShowWebSummary,
    handleHideWebSummary,
    webSummaryResult,
    webSummaryLoading,
  } = useWebSummary(result.link)
  return (
    <div className="googleScholarResultContainer">
      <div className="scholarSearchedResultContentsHolder">
        <div className="scholarSearchResultsContent">
          <ImageWithFallback
            src={getFavicon(result.link)}
            alt="favicon"
            styleString="scholarSearchResultPic"
            fallbackSrc="icons/icon48.png"
          />
          <div className="scholarSearchResultsContentContainer">
            <h3 className="scholarSearchResultContentHeader">{result.title}</h3>
            <p className="scholarSearchResultContentDesc">{result.snippet}</p>
            <span className="scholarSearchResultAuthors">
              <strong>Authors: </strong>
              {result?.publication_info?.authors ? (
                result.publication_info.authors.map((a, index) => (
                  <span key={a.link}>
                    <a href={a.link} target="_blank" rel="noopener noreferrer">
                      {a.name}
                    </a>
                    {index < result.publication_info.authors.length - 1 && ', '}
                  </span>
                ))
              ) : (
                <span>Not Available</span>
              )}
            </span>
            <div className="pdfCitationsRelatedPages">
              <span>
                <strong className="scholarSearchResultPdfsHeading">
                  PDFs:
                </strong>{' '}
                {result?.resources && Array.isArray(result.resources) ? (
                  result.resources
                    .filter((dt) => dt.file_format === 'PDF')
                    .map((dt, index, array) => (
                      <span key={dt.link}>
                        <a
                          href={dt.link}
                          className="visit__link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {dt.title}
                        </a>
                        {index < array.length - 1 && ', '}
                      </span>
                    ))
                ) : (
                  <span>No PDFs Available</span>
                )}
              </span>
              <span>
                <a
                  href={result?.inline_links?.cited_by?.link}
                  className="visit__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result?.inline_links?.cited_by?.total} Citations
                </a>
              </span>
              <span>
                <a
                  href={result?.inline_links?.related_pages_link}
                  className="visit__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Related Pages
                </a>
              </span>
            </div>
            <span className="scholarSearchResultsContentDetail">
              <a
                href="#"
                className="scholarSearchResultsContentDetail"
                onClick={(e) => {
                  e.preventDefault()
                  openLink(result.link, true)
                }}
                onMouseEnter={handleShowWebSummary}
                onMouseLeave={handleHideWebSummary}
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
        <div className="scholarBookmarkIconHolder">
          <img
            src="images/bookmarkIcon.svg"
            alt="bookmarkIcon"
            className="scholarBookmarkIcon"
          />
        </div>
      </div>
    </div>
  )
}
