import React,{ useState } from 'react'
import "./topbar.css"
import logo from "../../assets/logo.png"
import { Button } from 'primereact/button'
import { Sidebar } from 'primereact/sidebar'
import { useNavigate } from 'react-router-dom'
import Sider from '../sider/Sider'
  
function Topnav() {
const navigate = useNavigate()
const[ visible, setVisible] = useState(false)
  return (
    <div className='top-bar-wrapper'>
      <div className='logo-box' onClick={() => navigate("/")}>
        <img src={logo} alt="clcik-gasface logo" loading='lazy' />
      </div>
      <p style={{ color: '#fff'}}>Click-Gas</p>

  <div className='top-bar-filter'>
      <Button icon="pi pi-bars" 
           onClick={()=> setVisible(prev => !prev)} 
            rounded text 
            severity="secondary" 
          aria-label="filter" />
      </div>
      <Sidebar visible={visible} onHide={() => setVisible(false)} >
         <Sider />
      </Sidebar>
    </div>
  )
}

export default Topnav
