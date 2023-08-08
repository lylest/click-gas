import { useState, useEffect } from "react"
import { useGlobalContextHook } from '../hook/useGlobalContextHook'

export const  useAppHook =() => {
    const { dispatch } = useGlobalContextHook()
    const [ isUserLoggedIn, setIsUserLoggedIn] = useState(null) //null, false

    const checkLoginStatus = async ()=> {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/auth`,{
            method: 'GET',
            credentials: "include"
          })
    
          const json = await response.json()
          if(response.ok) {
             setIsUserLoggedIn(true)
             dispatch({type:'SET_CURRENT_USER', payload: json.data })
          }
      
          if(!response.ok){    
            setIsUserLoggedIn(false)
    
            if(json.message == 'Account is blocked') {
              setIsUserLoggedIn('blocked')
             }  
         
          }
        } catch(error){
           console.log(error)
        }
      }

    useEffect(()=> {
        checkLoginStatus()
    },[])  
    return {
        isUserLoggedIn
    }
}