import React, { useState, useRef, useEffect } from 'react'
import '../home/HomeSection.css'
import SearchEngineOption from './SearchEngineOption'
import SearchResults from '../searchResult/SearchResults'

export default function HomeSection() {
  const [showSearchEngineOption, setShowSearchEngineOption] = useState(false)
  const [searchEngine, setSearchEngine] = useState('Google')
  const hideTimeoutRef = useRef(null)

  const handleSearchEngine = (engine) => {
    setSearchEngine(engine)
    if (engine === 'Google') {
      chrome.storage.local.set(
        { isGoogle: true, isGoogleScholar: false },
        function () {
          setShowSearchEngineOption(false)
        },
      )
    } else if (engine === 'GoogleScholar') {
      chrome.storage.local.set(
        { isGoogle: false, isGoogleScholar: true },
        function () {
          setShowSearchEngineOption(false)
        },
      )
    }
  }

  const handleShowSearchEngineOption = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    setShowSearchEngineOption(true)
  }

  const handleHideSearchEngineOption = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowSearchEngineOption(false)
    }, 200)
  }

  useEffect(() => {
    chrome.storage.local.get(
      ['isGoogle', 'isGoogleScholar'],
      function (result) {
        const isGoogle = result.isGoogle
        const isGoogleScholar = result.isGoogleScholar
        if (isGoogle) {
          setSearchEngine('Google')
        } else if (isGoogleScholar) {
          setSearchEngine('GoogleScholar')
        }
      },
    )
  }, [])

  return (
    <>
      <div className="homeSection">
        <div className="homeSectionSearchHolder">
          <div
            className="googleAndScholarIconHolder"
            onMouseEnter={handleShowSearchEngineOption}
            onMouseLeave={handleHideSearchEngineOption}
          >
            <img
              src={
                searchEngine === 'GoogleScholar'
                  ? 'images/googleScholarIcon.svg'
                  : 'images/googleIcon.svg'
              }
              alt="searchEngineIcon"
              className="googleAndScholarIcon"
            />
            <img src="images/line.png" alt="line" className="lineIcon" />
          </div>
          <input
            type="text"
            className="homeSectionInput"
            placeholder="Search here..."
          />
          <button className="searchBtnHolder">
            Search
            <img
              src="images/searchSendIcon.svg"
              alt="search"
              className="searchSendIcon"
            />
          </button>
          {showSearchEngineOption && (
            <SearchEngineOption
              onMouseEnter={handleShowSearchEngineOption}
              onMouseLeave={handleHideSearchEngineOption}
              handleSearchEngine={handleSearchEngine}
              searchEngine={searchEngine}
            />
          )}
        </div>
        <SearchResults />
      </div>
    </>
  )
}
