import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import HomeSection from '../components/home/HomeSection'

import { Provider } from 'react-redux'
import store from '../state/store'

const Popup = () => {
  return (
    <>
      <Header />
      <div className="main_container">
        <HomeSection />
      </div>
      <Footer />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <Popup />
  </Provider>,
)
