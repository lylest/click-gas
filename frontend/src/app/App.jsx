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

function App() {
const {         
    isUserLoggedIn
  } = useAppHook()

  return (
    <Router>
    { isUserLoggedIn === null ? <Loader /> : 
      isUserLoggedIn === true ? <MainNav /> : 
      isUserLoggedIn === false ? <AuthNav /> : 
      <Loader />
    }
      <Toaster  position='bottom-center' duration="5000" />
    </Router>
  )
}


export default App
