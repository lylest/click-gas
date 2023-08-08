import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useAccountHook =() => {
    const navigate = useNavigate()
    const [ phone, setPhone] = useState("")
    const [ email, setEmail] = useState("")
    const [ fullName, setFullName] = useState("")
    const [ idNumber, setIdnumber ] = useState(0)
    const [ open, setOpen ] = useState(false)
    const [ account, setAccount] = useState(null)
    const [ localPermissions, setLocalPermissions ] = useState([])
    const [ selectedIdType, setSelectedIdType] = useState(null)

    const [ idTypes, setIdTypes] = useState([
      { name: "NIDA", value: "nida" },
      { name: "Voting ID", value:"voting"},
      { name: "Driving Lincence", value:"driving-lincence"},
      { name: "Other", value:"other"}
   ])

    const getUser = async ()=> {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/auth`,{
            method: 'GET',
            credentials: "include"
          })
    
          const json = await response.json()
          if(response.ok) {
            setAccount(json.data)
            setLocalPermissions(json.data.permissions)

            const { data } = json
            setFullName(data.username)
            setPhone(data.phoneNumber)
            setEmail(data.email)  
            setSelectedIdType(data.type)
            setIdnumber(data.idNumber)
          }
      
          if(!response.ok){     
             setAccount("not-found")
          }
        } catch(error){
           console.log(error)
        }
    }

    const logout = async () => {
      navigate('/')
      setTimeout(async()=>{
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/update/auth`,{
            method: 'PATCH',
            credentials: "include", 
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
             toast.success('Goodbye!')
             navigate('/')

             setTimeout(()=> {
              window.location.reload()
             },400)
          }
      
          if(!response.ok){
             // toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during logout!(')
        }
      },2000)
    }

    const saveUser = async() => {
      try { 
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/users?id=${account._id}`,{
          method: 'PATCH',
          body: JSON.stringify({
              username:fullName,
              phoneNumber:parseInt(phone),
              email:email,
              idType:selectedIdType,
              idNumber:idNumber    
          }),
          credentials:"include",
          headers: { 'Content-Type': 'application/json'}
        })
  
        const json = await response.json()
        if(response.ok) {
           toast.success(json.message)
           setOpen(false)
           getUser()
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during saving user')
      }
    }

    useEffect(()=>{
        getUser()
    },[])

    return {
        account,
        localPermissions,
        logout,
        open, 
        setOpen,
        fullName,
        email,
        phone,
        idNumber,
        setPhone,
        setEmail,
        setIdnumber,
        setFullName,
        selectedIdType, 
        setSelectedIdType,
        idTypes,
        saveUser
    }
}