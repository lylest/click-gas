import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const useViewSupplierHook =() => {
    const [ center, setCenter] = useState({lat:-7.79,lng:33.88})
    const [ cords,setCords] = useState(null)
    const [ supplier, setSupplier ] = useState(null)
    const [ isVisible, setVisible ] = useState(false)
    const [ localPermissions, setLocalPermissions ] = useState([])
    const [ activePermission, setActivePermission ] = useState(null)
    const [ activeCustomer, setActiveCustomer ] = useState(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ customers, setCustomers ] = useState([])
    const  navigate  = useNavigate()
    const { id } = useParams()
    const [ actions, setActions ] = useState(null);
    const items = [
        { name: 'CREATE', value: 'create' },
        { name: 'READ', value: 'read' },
        { name: 'UPDATE', value: 'update' },
        { name: 'DELETE', value: 'remove' }
    ]

    const getSupplier = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/suppliers?id=${id}`, {
            method: 'GET',
            credentials: "include"
          })
  
          const json = await response.json()
          if(response.ok) {
             setSupplier(json.data) 
             setLocalPermissions(json.data.permissions)
             setCenter({
              lat: json.data.location.coordinates[1],
              lng: json.data.location.coordinates[0]
             })
             
           setCords({
             Lat:json.data.location.coordinates[1],
             Lng:json.data.location.coordinates[0]
           })
          }
      
          if(!response.ok){
            setSupplier("not-found")
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during finding supplier')
        }
    }

    function editPermission(Permission) {
        setActivePermission(Permission)
        setVisible(true)
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
      saveSupplier(newLocalPermissions)
      setVisible(false) 
    }

    const saveSupplier = async(newLocalPermissions) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/suppliers?id=${id}`,{
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
           getSupplier()
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        console.log(error)
        toast.error('Error during saving supplier')
      }
    }

   const listSupplierCustomers = async() => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/read/customers?supplierId=${id}`,{
        method: 'GET',
        credentials: "include"
      })

      const json = await response.json()
      if(response.ok) {
         setCustomers(json.data)
         console.log(json)
      }
  
      if(!response.ok){
        toast.error(json.message)
      }
  
    } catch(error){
      toast.error('Error during listing supplier customers')
    }
   }

   function openCustomer(event) {
    setActiveCustomer(event.data)
    setIsOpen(true)
  }

    useEffect(() => {
        if(id) {
           getSupplier()
           listSupplierCustomers()
           }
    },[id])

    return {
        supplier, 
        setSupplier,
        center,
        cords,
        localPermissions,
        activePermission,
        editPermission,
        savePermissionChanges,
        isVisible, 
        setVisible,
        actions,
        setActions,
        items,
        customers,
        openCustomer,
        activeCustomer,
        isOpen, setIsOpen
    }

}