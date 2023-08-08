import './bottom.css'
import React from 'react'
import { BiUser } from "react-icons/bi"
import { RiHeart2Line } from "react-icons/ri"
import { Link , useLocation, useNavigate } from "react-router-dom"
import { TbSmartHome,TbMessage2Heart } from "react-icons/tb"

function BottomNav() {
  const activeRoute = useLocation()
  const { pathname } = activeRoute
  const navigate = useNavigate()

  return (
    <div className='bottom-wrapper'>

      <div className='menu-fab' id="touchable" onClick={() => navigate('/')}>
        <TbSmartHome 
          color={pathname === '/' ? "#D71BEB": "#666"} size={22} />
        </div>

      <div className='menu-fab' id="touchable" onClick={() => navigate('/matches')}>
        <RiHeart2Line
        color={pathname === '/matches' ? "#D71BED": "#666"} size={22} />
        </div>
   
        <div className='menu-fab' id="touchable" onClick={() => navigate('/chats')}>
        <TbMessage2Heart 
        color={pathname === `/chat` ? "#D71BED": "#666"} size={22} />
        </div>

      <div className='menu-fab' id="touchable" onClick={() => navigate('/profile')}>
        <BiUser 
          color={pathname === '/profile' ? "#D71BED": "#666"} size={22} />
        </div>
    </div>
  )
}

export default BottomNav
