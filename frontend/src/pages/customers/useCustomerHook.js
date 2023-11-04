import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useCustomerHook =()=> {
    const [ refresh, setRefresh ] = useState(false)
    const { currentUser } = useGlobalContextHook()
    const [ customers, setCustomers] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isEditOpen, setIsEditOpen ] = useState(false)
    const [ fullName, setFullName ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ address, setAddress ] = useState("")
    const [ physicalAddress, setPhysicalAddress ] = useState("")
    const [ isLoading, setIsLoading ] = useState(true)
    const [ activeCustomer, setActiveCustomer ] = useState(null)
    const [ selectedSupplier, setSelectedSupplier ] = useState(null)
    const [ selectedDevice, setSelectedDevice ] = useState(null)

    const addCustomer = async() => {
        try {  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/create/customers`,{
            method: 'POST',
            body: JSON.stringify({
                fullName:fullName,
                phoneNumber:phone,
                email:email,
                physicalAddress:physicalAddress,
                supplier:selectedSupplier._id,
                address:address,
                device:selectedDevice._id,
                createdBy:currentUser._id,
            }),
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
            console.log(json)
             toast.success(json.message)
             setVisible(false)
             clearInputs()
             setRefresh(prev => !prev)
             updateDevice(new Date(), json.data._id, selectedDevice._id)
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during adding customer')
        }
    }

      const updateDevice = async(newDate, customerId, deviceId) => {
        try { 
          const response = await fetch(`${import.meta.env.VITE_API_URL}/update/devices?id=${deviceId}`,{
            method: 'PATCH',
            body: JSON.stringify({
              dateAllocated:newDate,
              customer:customerId
            }),
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
          })
  
          const json = await response.json()
          if(response.ok) {
             toast.success(json.message)
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          console.error("error", error)
          toast.error('Error during saving device changes')
        }
    }

    function clearInputs () {
        setFullName(""); setPhone(0); setEmail(""); setAddress("");
        setSelectedDevice(null); setSelectedSupplier(null)
    } 
    
    const listAllCustomers = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/customers`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setCustomers(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing customers')
        }
    }

    const listSupplierCustomers = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/customers?supplierId=${currentUser._id}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setCustomers(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing customers')
        }
    }

    function openCustomer(event) {
      setActiveCustomer(event.data)
      setIsOpen(true)
      const { data } = event
      setFullName(data.fullName)
      setEmail(data.email)
      setPhone(data.phoneNumber)
      setAddress(data.address)
      setSelectedSupplier(data.supplier)
      setSelectedDevice(data.device)
      setPhysicalAddress(data.physicalAddress)
    }

    const deleteCustomer = async() => {
      try {
        const { _id } = activeCustomer
        const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/customers?id=${_id}`,{
          method: 'DELETE',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           setRefresh(prev => !prev)
           updateDevice(null,null,activeCustomer.device._id) //newdate, customerId, deviceId
           toast.success(json.message)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        console.log(error)
        toast.error(`Error deleting customer`)
      }
    }

    const saveCustomer = async() => {
      try {  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/customers?id=${activeCustomer._id}`,{
          method: 'PATCH',
          body: JSON.stringify({
              fullName:fullName,
              phoneNumber:phone,
              email:email,
              physicalAddress:physicalAddress,
              supplier:selectedSupplier._id,
              address:address,
              device:selectedDevice._id,
              createdBy:currentUser._id,
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           toast.success(json.message)
           setRefresh(prev => !prev)
           setIsEditOpen(false)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during saving customer')
      }
    }

    const searchCustomers = async(keyword) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/customers?search=${keyword}`,{
          method: 'GET',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           setCustomers(json.data)
           setIsLoading(false)
        }
    
        if(!response.ok){
          setIsLoading(false)
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during searchings customers')
      }
  }

    useEffect(()=>{
        if(currentUser) {
            const { roleId } = currentUser
            if(roleId === 1) { listAllCustomers() }
            if(roleId === 2) { listSupplierCustomers()}
        }
    },[currentUser, refresh])

    return {
        customers,
        visible, 
        setVisible,
        selectedSupplier, 
        setSelectedSupplier,
        selectedDevice, 
        setSelectedDevice,
        addCustomer,
        fullName,
        setFullName,
        email,
        setEmail,
        phone,
        setPhone,
        address, 
        setAddress,
        isLoading,
        setRefresh,
        openCustomer,
        activeCustomer, 
        setActiveCustomer,
        isOpen, setIsOpen,
        deleteCustomer,
        isEditOpen, 
        setIsEditOpen,
        saveCustomer,
        searchCustomers,
        physicalAddress, 
        setPhysicalAddress
    }
}