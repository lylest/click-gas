import React, { useEffect, useState } from 'react'
import 'primereact/resources/primereact.min.css' 
import 'primereact/resources/themes/viva-light/theme.css'
import 'primeicons/primeicons.css' 
import 'primeflex/primeflex.css'
import MainNav from '../navigation/MainNav'
import AuthNav from '../navigation/AuthNav'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import  Loader from '../components/loader/Loader'
import { useAppHook } from './useAppHook'
import { BiCloudLightRain } from 'react-icons/bi'

function App() {
const {         
    isUserLoggedIn,
    toggleTheme
  } = useAppHook()

  return (
    <Router>
    { isUserLoggedIn === null ? <Loader /> : 
      isUserLoggedIn === true ? <MainNav /> : 
      isUserLoggedIn === false ? <AuthNav /> : 
      <Loader />
    }
      <Toaster  position='bottom-center' duration="5000" />
    {/**  <div className='fab' id="touchable" onClick={() => toggleTheme()}
      > <BiCloudLightRain size={25} color="#FFF" /></div> */}
    </Router>
  )
}


export default App
