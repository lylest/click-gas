import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './index.css'
import { GlobalContextProvider } from './context/GlobalContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <GlobalContextProvider>
            <App/>
      </GlobalContextProvider>
  </React.StrictMode>
)
