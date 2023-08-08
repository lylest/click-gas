import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useUsersHook =() => {
    const [ phone, setPhone] = useState("")
    const [ email, setEmail] = useState("")
    const [ users, setUsers] = useState([])
    const [ fullName, setFullName] = useState("")
    const [ idNumber, setIdnumber ] = useState(0)
    const [ isOpen, setIsOpen ] = useState(false)
    const { currentUser } = useGlobalContextHook()
    const [ actions, setActions ] = useState(null)
    const [ visible, setVisible ] = useState(false)
    const [ isLoading, setLoading ] = useState(false)
    const [ activeUser, setActiveUser ] = useState(null)
    const [ editVisible,setEditVisible] = useState(false)
    const [ isOpenPopup, setIsOpenPopup ] = useState(false)
    const [ selectedIdType, setSelectedIdType] = useState(null) 
    const [ localPermissions, setLocalPermissions ] = useState([])
    const [ activePermission, setActivePermission ] = useState(null)

    const [ idTypes, setIdTypes] = useState([
        { name: "NIDA", value: "nida" },
        { name: "Voting ID", value:"voting"},
        { name: "Driving Lincence", value:"driving-lincence"},
        { name: "Other", value:"other"}
    ])

    const items = [
      { name: 'CREATE', value: 'create' },
      { name: 'READ', value: 'read' },
      { name: 'UPDATE', value: 'update' },
      { name: 'DELETE', value: 'remove' }
  ]

    const addUser = async() => {
        try {
          const password = generateStrongPassword(12)  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/create/users`,{
            method: 'POST',
            body: JSON.stringify({
                username:fullName,
                phoneNumber:parseInt(phone),
                email:email,
                idType:selectedIdType,
                idNumber:idNumber,
                password:password,
                tmpPassword:password    
            }),
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
             toast.success(json.message)
             setVisible(false)
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during adding user')
        }
    }

    const searchUser = async(keyword) => {
      if(keyword.length === 0){  listUsers() } else {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/auth?search=${keyword}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setUsers(json.data)
             setLoading(false)
          }
      
          if(!response.ok){
            setLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing users')
        }
      }
    }

    const listUsers = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/auth?list=yes`,{
          method: 'GET',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           setUsers(json.data)
           setLoading(false)
        }
    
        if(!response.ok){
          setLoading(false)
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during listing users')
      }
   }

   const deleteUser = async() => {
    try {
      const { _id } = activeUser
      const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/users?id=${_id}`,{
        method: 'DELETE',
        credentials: "include"
      })

      const json = await response.json()
      if(response.ok) {
         listUsers()
         toast.success(json.message)
      }
  
      if(!response.ok){
        toast.error(json.message)
      }
  
    } catch(error){
      toast.error(`Error deleting USER`)
    }
  }

   function generateStrongPassword(length) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numericChars = '0123456789';
        const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
      
        const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;
        let password = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * allChars.length);
          password += allChars[randomIndex];
        }
      
        return password;
  }
    
    const  openUser =(event)=> {
      setActiveUser(event.data)
      setLocalPermissions(event.data.permissions)
      setIsOpen(true)

      const { data } = event
      setFullName(data.username)
      setPhone(data.phoneNumber)
      setEmail(data.email)  
      setSelectedIdType(data.type)
      setIdnumber(data.idNumber)
    } 
    
    function editPermission(Permission) {
      setActivePermission(Permission)
      setEditVisible(true)
      setActions(Permission.list)
   }

   function savePermissionChanges() {
    let newLocalPermissions = localPermissions.map((permission) => {
      if(permission.name === activePermission.name) {
         return {
          ...permission,
          list:actions
         }
      }
      return permission
    })
    setLocalPermissions(newLocalPermissions)
    saveUser(newLocalPermissions)
    setEditVisible(false) 
  }

  const saveUser = async(newLocalPermissions) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update/users?id=${activeUser._id}`,{
        method: 'PATCH',
        body: JSON.stringify({
           permissions:newLocalPermissions
        }),
        credentials: "include",
        headers: { 'Content-Type': 'application/json'}
      })

      const json = await response.json()
      if(response.ok) {
         toast.success(json.message)
         listUsers()
      }
  
      if(!response.ok){
        toast.error(json.message)
      }
  
    } catch(error){
      toast.error('Error during saving user')
    }
  }

  const saveBasicUserDetails = async() => {
    try { 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update/users?id=${activeUser._id}`,{
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
         setIsOpenPopup(false)
         listUsers()
      }
  
      if(!response.ok){
        toast.error(json.message)
      }
  
    } catch(error){
      toast.error('Error during saving user')
    }
  }

    useEffect(() => {
        listUsers()
    },[])  

    return {
        users,
        isLoading,
        visible,
        setVisible,
        setFullName,
        idTypes, 
        setIdTypes,
        setPhone,
        setEmail,
        setIdnumber,
        selectedIdType, 
        setSelectedIdType,
        addUser,
        listUsers,
        isOpen,
        setIsOpen,
        openUser,
        activeUser,
        localPermissions,
        editVisible,
        setEditVisible,
        setActions,
        actions,
        activePermission,
        items,
        deleteUser,
        searchUser,
        editPermission,
        savePermissionChanges,
        isOpenPopup, setIsOpenPopup,
        fullName,
        email,
        phone,
        idNumber,
        saveBasicUserDetails
    }
}