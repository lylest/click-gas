import './addsupplier.css'
import React from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useSupplierHook } from './useSupplierHook'
import { containerStyle } from './Styles.js'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import { InputText } from "primereact/inputtext"
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { GoogleMap, useLoadScript, MarkerF} from '@react-google-maps/api'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
const libraries = ['places']

function Suppliers() {
  const { isEnglish } = useGlobalContextHook()
  const { isLoaded } = useLoadScript({
    id: 'script-loader',
    version: 'weekly',
    googleMapsApiKey:import.meta.env.VITE_MAP_API_KEY,
    libraries,
  })

  

  const { 
    center,
    setPickedLocation,
    selectedIdType, 
    setSelectedIdType,
    idTypes, 
    setIdTypes,
    location,
    confirmLocation,
    setFullName,
    setPhone,
    setEmail,
    setIdnumber,
    addSupplier
  } = useSupplierHook()

  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <div className='page-wrapper'>
          <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 30px' }}>{ isEnglish ? "New Suppliers": 'Msambazaji Mpya'}</h3>
          </div>

             <div className='two-grid'>
                <div className='grid-one'>
                    <div className="card-input">
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder={isEnglish ? "Full name": "Jina kamili"} />
                    </span>
                     </div> 

                     <div className="card-input">
                     <span className="p-input-icon-left">
                        <i className="pi pi-at" />
                        <InputText 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEnglish ? "E-mail" : "Barua pepe"} />
                    </span>
                     </div>  

                     <div className="card-input">
                     <span className="p-input-icon-left">
                        <i className="pi pi-phone" />
                        <InputText 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={isEnglish? "Phone": "Simu"} />
                    </span>
                     </div> 

                     <div className='card-input'>
                     <Dropdown value={selectedIdType} onChange={(e) => setSelectedIdType(e.value)}
                         options={idTypes} optionLabel="name"  style={{ width: '90%' }}
                         editable placeholder={isEnglish ? "Select ID Type": "Aina ya kitambulisho"} />
                     </div>

                     <div className="card-input">
                     <span className="p-input-icon-left">
                        <i className="pi pi-id-card" />
                        <InputText 
                         onChange={(e) => setIdnumber(e.target.value)}
                         placeholder={isEnglish ? "ID number": "Namba ya Kitambulisho"} />
                    </span>
                     </div>

                     <div className="card-input">
                     <span className="p-input-icon-left">
                        <i className="pi pi-map-marker" />
                        <InputText placeholder= "location" value={location === null ? "Location": location}  />
                    </span>
                     </div>

                     <div className='card-input'>
                     <Button 
                         onClick={()=> confirmLocation()}
                         label={isEnglish ? "Confirm location" : "Hakiki Makazi"}
                         severity="secondary" outlined />
                     </div>
                     <br />
                     <div className="card flex justify-content-center">
                         <Button label={isEnglish ? "Register" : "Sajili"} onClick={()=> addSupplier()}/>
                    </div>
                </div>

                <div className='grid-two'>
                    { isLoaded ? 
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}>  
                       
                       <MarkerF 
                            draggable={true} 
                            position={center} 
                            onDrag={(e) => setPickedLocation(e)} />
                        </GoogleMap> : 
                     <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
                    }
                </div>
             </div>
          </div>
          </div>
        </div>
    </div>
  )
}

export default Suppliers
