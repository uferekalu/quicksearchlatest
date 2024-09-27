import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setEngineState,
  setPhaseCacheState,
  setQueryState,
} from '../../state/slice/browserSlice'
import '../home/HomeSection.css'
import SearchEngineOption from './SearchEngineOption'
import SearchResults from '../searchResult/SearchResults'
import {
  getGSearchValue,
  getScholarStoredQuery,
  getStoredQuery,
  Spinner,
} from '../../utils/utility'
import { google_scholar, google_search } from '../../api/google_api'
import GoogleScholarResults from '../searchResult/GoogleScholarResults'

export default function HomeSection() {
  const [showSearchEngineOption, setShowSearchEngineOption] = useState(false)
  const [searchEngine, setSearchEngine] = useState('Google')
  const hideTimeoutRef = useRef(null)
  const { query, phaseCache, engine } = useSelector((state) => state.browser)

  const [searching, setSearching] = useState(false)
  const [searchRes, setSearchRes] = useState([])
  const dispatch = useDispatch()

  const handleNextPhase = (next_phase) => {
    handleSearch(next_phase)
    dispatch(setPhaseCacheState({ phase: next_phase }))
  }

  const handleSearch = async (phase, eng) => {
    try {
      const mainEng = eng || engine
      setSearching(true)
      const query_to_lower_case = query.toLowerCase().trim()
      let gSearchValue = await getGSearchValue()

      if (!gSearchValue) {
        chrome.storage.local.set(
          { 'g-search': '{"google":{},"scholar":{}}' },
          () => {
            if (chrome.runtime.lastError) {
              console.log('error setting g-search')
            }
          },
        )
        gSearchValue = '{"google":{},"scholar":{}}'
      }

      const g_search =
        typeof gSearchValue === 'string'
          ? JSON.parse(gSearchValue)
          : gSearchValue

      if (!g_search[mainEng]) {
        g_search[mainEng] = {}
      }

      if (
        g_search[`${mainEng}`][query_to_lower_case] &&
        g_search[`${mainEng}`][query_to_lower_case][`${phase}`]
      ) {
        const { data, ttl } =
          g_search[`${mainEng}`][query_to_lower_case][`${phase}`]
        if (Date.now() <= ttl) {
          setSearchRes(data)
          setSearching(false)
          return
        }
      }

      const regex = /^\s+$/gi
      if (query && !regex.test(query)) {
        const res =
          mainEng === 'Google'
            ? await google_search(query, phase)
            : await google_scholar(query, phase)

        const oneDayLater = new Date()
        oneDayLater.setHours(oneDayLater.getHours() + 24)
        const ttl = oneDayLater

        const queryCache = g_search[`${mainEng}`][query_to_lower_case] || {}
        g_search[`${mainEng}`][query_to_lower_case] = {
          ...queryCache,
          [phase]: { data: res, ttl },
        }

        if (mainEng === 'Google') {
          chrome.storage.local.set(
            {
              'g-search': JSON.stringify(g_search),
              storedQuery: query_to_lower_case,
            },
            function () {
              setSearchRes(res)
              setSearching(false)
              return
            },
          )
        } else {
          chrome.storage.local.set(
            {
              'g-search': JSON.stringify(g_search),
              scholarStoredQuery: query_to_lower_case,
            },
            function () {
              setSearchRes(res)
              setSearching(false)
              return
            },
          )
        }
      } else {
        setSearchRes([])
      }
      setSearching(false)
    } catch (error) {
      setSearching(false)
      console.error(error)
    }
  }

  useEffect(() => {
    async function getSavedResults() {
      let gSearchValue = await getGSearchValue()
      const storedQuery = await getStoredQuery()
      const scholarStoredQuery = await getScholarStoredQuery()
      if (gSearchValue) {
        const g_search =
          typeof gSearchValue === 'string'
            ? JSON.parse(gSearchValue)
            : gSearchValue

        if (searchEngine === 'Google') {
          if (
            g_search[`${searchEngine}`] &&
            g_search[`${searchEngine}`][storedQuery] &&
            g_search[`${searchEngine}`][storedQuery][`${phaseCache}`]
          ) {
            const { data, ttl } =
              g_search[`${searchEngine}`][storedQuery][`${phaseCache}`]
            if (Date.now() <= new Date(ttl).getTime()) {
              setSearchRes(data)
            }
          } else {
            setSearchRes([])
          }
        } else {
          if (
            g_search[`${searchEngine}`] &&
            g_search[`${searchEngine}`][scholarStoredQuery] &&
            g_search[`${searchEngine}`][scholarStoredQuery][`${phaseCache}`]
          ) {
            const { data, ttl } =
              g_search[`${searchEngine}`][scholarStoredQuery][`${phaseCache}`]
            if (Date.now() <= new Date(ttl).getTime()) {
              setSearchRes(data)
            }
          } else {
            setSearchRes([])
          }
        }
      } else {
        setSearchRes([])
      }
    }
    getSavedResults()
  }, [searchEngine])

  const handleEnter = (e) => e.key == 'Enter' && handleNextPhase(1)

  const handleSearchEngine = (engine) => {
    setSearchEngine(engine)
    dispatch(setEngineState(engine))
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
          dispatch(setEngineState('Google'))
        } else if (isGoogleScholar) {
          setSearchEngine('GoogleScholar')
          dispatch(setEngineState('GoogleScholar'))
        }
      },
    )
  }, [])

  useEffect(() => {
    if (query !== '') handleSearch(phaseCache)
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
            onKeyUp={handleEnter}
            defaultValue={query}
            onChange={({ target: { value } }) =>
              dispatch(setQueryState({ query: value }))
            }
          />
          {searching ? (
            <Spinner />
          ) : (
            <button
              className="searchBtnHolder"
              onClick={() => handleNextPhase(1)}
            >
              Search
              <img
                src="images/searchSendIcon.svg"
                alt="search"
                className="searchSendIcon"
              />
            </button>
          )}
          {showSearchEngineOption && (
            <SearchEngineOption
              onMouseEnter={handleShowSearchEngineOption}
              onMouseLeave={handleHideSearchEngineOption}
              handleSearchEngine={handleSearchEngine}
              searchEngine={searchEngine}
            />
          )}
        </div>
        {searchRes.length > 0 && !searching ? (
          <>
            <span className="searchResultsTotal">
              {searchRes.length} Results
            </span>
            {engine === 'Google' ? (
              searchRes.map((res, i) => <SearchResults key={i} result={res} />)
            ) : engine === 'GoogleScholar' ? (
              searchRes.map((res, i) => (
                <GoogleScholarResults key={i} result={res} />
              ))
            ) : (
              <div>No result</div>
            )}
          </>
        ) : (
          <div className="">
            {searching ? (
              <p className="searchingResults">Searching...</p>
            ) : (
              <p className="searchResultsAppearHere">
                {' '}
                Search results appear here...
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
