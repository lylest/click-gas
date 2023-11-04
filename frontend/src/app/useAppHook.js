import { useState, useEffect } from "react"
import { useGlobalContextHook } from '../hook/useGlobalContextHook'
import vivalight  from '../viva-light.scss'


export const  useAppHook =() => {
    const [ checked, setChecked] = useState(false)
    const { dispatch } = useGlobalContextHook()
    const [ isUserLoggedIn, setIsUserLoggedIn] = useState(null) //null, false
    const [ selectedThemeModule, setSelectedThemeModule] = useState(vivalight)

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
        //toggleTheme()
    },[])  


        const toggleTheme = async() =>{
        try {
          const currentTheme  = await localStorage.getItem('theme')
          if(currentTheme === 'light') {

           // document.body.classList.add('dark-theme')
            //document.body.classList.remove('light-theme')
          //  localStorage.setItem('theme','dark')
         //   setChecked(true)
           // changeprimeTheme('viva-dark')
    
          } 
          if(currentTheme === 'dark') {
           // document.body.classList.remove('dark-theme');
           // document.body.classList.add('light-theme');
           // localStorage.setItem('theme','light')
           // setChecked(false)
         //   changeprimeTheme('viva-dark')

          }
          if(currentTheme === null) {
          /// document.body.classList.toggle('light-theme');
          ///  localStorage.setItem('theme','light')
          //  changeprimeTheme('viva-dark')
           // setChecked(false)
          }
         } catch( err) {
          console.log(err)
        }  
      }

      const changeprimeTheme = (theme) => {
        import.meta.glob('../viva-dark.scss').then((module) => {
          if (selectedThemeModule) {
             selectedThemeModule.unuse()
          }
          module.use()
          setSelectedThemeModule(module)
        })
      }


    return {
        isUserLoggedIn,
        toggleTheme
    }
}