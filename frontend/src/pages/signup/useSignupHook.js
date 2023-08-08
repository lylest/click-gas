import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from  "react-router-dom"

export const useSignUpHook = () => {
    const navigate = useNavigate()
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ isDisabled, setDisabled ] = useState(true)


    const signUp = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/create/users`,{
            method: 'POST',
            body: JSON.stringify({
                     username:name,
                     email:email,
                     phone:phone,
                     password:password
            }),
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
             toast.success(json.message)
    
             setTimeout(() => {
              navigate('/login')
             },1000)
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during signup')
        }
      }

    useEffect(() => {
        if(name === "" || phone === "" || email === "" || password === "") {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    },[phone, name, email, password,])

    return {
        name,
        setName,
        email,
        phone,
        password,
        setPassword,
        setPhone,
        setEmail,
        signUp,
        navigate,
        password,
        isDisabled,
    }
}