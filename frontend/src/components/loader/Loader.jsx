import React from 'react'
import './loader.css'
import { ProgressSpinner } from 'primereact/progressspinner'

function Loader() {
  return (
   
    <div className='empty-center' >
      <ProgressSpinner  className='center-icon'style={{ marginTop: '50%'}} />
    </div>
  )
}

export default Loader