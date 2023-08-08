import React from 'react'
import MenuItem from '../menuitem/MenuItem'
import './sider.css'
import { useMenuList } from './menulist'
import logo from '../../assets/logo.png'
import Divider from './Divider'
 
function Sider() {
  const {  menulist } = useMenuList()
 const roleId = 1
  return (
    <div className="sider-wrapper">
       <div className='sider-little-bar'>
       <div className='logo-box'>
        <img src={logo} alt="face2face logo" loading='lazy' />
      </div>
      <h3 className='sider-title-left'>Click-Gas</h3>
       </div>
  
       { roleId === 2 ?
    <>
       {
        menulist.user.menu.map((item, index) => (
          item.name === "space" ? <Divider /> :
          item.name === "Notifications"  ?
          <MenuItem  title={item.name} key={index} path_name={item.path} Icon={item.icon} /> :
          <MenuItem  title={item.name} key={index} path_name={item.path} Icon={item.icon}/>
        ))
      }
    </> : 
    roleId === 1 ? 
    <>
           {
        menulist.admin.menu.map((item, index) => (
          item.name === "space" ? <Divider /> :
          <MenuItem  title={item.name} key={index} path_name={item.path} Icon={item.icon}/>
        ))
      } 
    </> : null

   }
    </div>
  )
}

export default Sider
