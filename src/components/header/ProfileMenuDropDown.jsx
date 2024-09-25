import React from 'react'

export default function ProfileMenuDropDown({ onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="profileDropdownContainer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="profileDropdownContentHolder">
        <div className="shareHolder">
          <img src="images/share.svg" alt="share" className="shareLogo" />
          <span className="shareText">Share</span>
        </div>
        <div className="loginHolder">
          <img src="images/log-in.svg" alt="login" className="loginLogo" />
          <span className="loginText">Login</span>
        </div>
      </div>
    </div>
  )
}
