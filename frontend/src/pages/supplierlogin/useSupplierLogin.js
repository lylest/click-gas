import toast from 'react-hot-toast'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useGlobalContextHook } from '../../hook/useGlobalContextHook'


export const useSupplierLogin =() => {
    const [ userId, setUserId ] = useState("")
    const [ password, setPassword ] = useState("")
    const { dispatch } = useGlobalContextHook()
    const navigate = useNavigate()

    const login = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/suppliers?login=yes`,{
            method: 'POST',
            credentials: "include", 
            body: JSON.stringify({
                email:userId,
                password:password
            }),
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
            dispatch({type:'SET_CURRENT_USER', payload: json.user })
            toast.success('Welcome')

            setTimeout(() => {
              navigate('/')
              window.location.reload()
             },1500)
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
            console.log(error)
          toast.error('Error during login')
        }
    }


    return {
        setUserId,
        setPassword,
        login
    }
}