import React from 'react'
import { Link , useLocation } from "react-router-dom"
import { Badge } from 'primereact/badge'

function MenuItem({ path_name, title, Icon, rightTitle }) {
    const activeRoute = useLocation()
    const { pathname } = activeRoute

  return (
    <div className="menu-bar" id={ path_name === pathname ? 'active' :'inactive'} >
    <Link to={ path_name }><div className="menu-icon"> 
            <Icon color={
              path_name === pathname  ? "#F8CD06" : "#f2f2f2"
            } size={20} /> </div></Link>
          <div className="menu-list"><Link to={ path_name }> { title} </Link></div>

         { rightTitle > 0 ? <div className="menu-with-icon-far">
          <Badge value={rightTitle} severity="secondary" style={{ margin:'20px 12px 12px 12px'}} /></div> : null }
          
     </div>
  )
}

export default MenuItem
