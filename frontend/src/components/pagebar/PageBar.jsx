import React from 'react'
import './pagebar.css'
import { useNavigate, Link } from 'react-router-dom'
import { useGlobalContextHook } from '../../hook/useGlobalContextHook'
import { MdNotificationsNone }from 'react-icons/md'
import { Badge } from 'primereact/badge'
import { InputText } from "primereact/inputtext"

function PageBar({title}) {
  const { currentUser, dispatch } = useGlobalContextHook()
  const navigate = useNavigate()

  const logout =async()=>{
     try {
        await localStorage.clear() 
        dispatch({type:'SET_CURRENT_USER', payload:null})

        setTimeout(()=>{
          window.location.reload()
        },1000)

        navigate('/')
     } catch(err){
    }
  }

  return (
    <div className="page-bar-wrapper">
       <h3 style={{ padding: '20px 15px 15px 30px' }}>{title}</h3>
       <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText placeholder="Search" />
            </span>
    </div>
  )
}

export default PageBar