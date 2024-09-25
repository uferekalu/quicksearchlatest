import React, { useState, useRef } from 'react'
import '../header/Header.css'
import ProfileMenuDropDown from './ProfileMenuDropDown'

export default function Header() {
  const [showProfileDropDown, setShowProfileDropDown] = useState(false)
  const hideTimeoutRef = useRef(null)

  const handleShowProfileDropdown = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    setShowProfileDropDown(true)
  }

  const handleHideProfileDropdown = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowProfileDropDown(false)
    }, 200)
  }

  return (
    <>
      <div className="header">
        <div className="logoHolder">
          <img src="images/appheader.svg" alt="logo" className="logoImg" />
        </div>
        <div className="gptProfileContainer">
          <div className="gptProfileHolder">
            <span className="gptText">GPT</span>
            <label className="switch">
              <input type="checkbox" id="toggle-switch" />
              <span className="slider"></span>
            </label>
          </div>
          <div
            className="profileIconHolder"
            onMouseEnter={handleShowProfileDropdown}
            onMouseLeave={handleHideProfileDropdown}
          >
            <img
              src={
                showProfileDropDown
                  ? 'images/profileIconSelected.svg'
                  : 'images/profileIcon.svg'
              }
              alt="profileLogo"
              className="profileIcon"
            />
            <div className="profileIdentity">K</div>
          </div>
        </div>
      </div>
      {showProfileDropDown && (
        <ProfileMenuDropDown
          onMouseEnter={handleShowProfileDropdown}
          onMouseLeave={handleHideProfileDropdown}
        />
      )}
    </>
  )
}
