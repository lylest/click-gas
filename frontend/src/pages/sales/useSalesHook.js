import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useSalesHook =() => {
    const { currentUser } = useGlobalContextHook()
    const [ refresh, setRefresh ] = useState(false)
    const [ sales, setSales ] = useState(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isEditOpen, setIsEditOpen ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ activeSale, setActiveSale ] = useState(null)
    const [ amount, setAmount ] = useState(0)

    const listSales = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/sales`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             if(json.data.length <= 0) {
              setSales(null)
             } else {
              setSales(json.data[0])
             }
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing sales')
        }
    }

    const listSupplierSales = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/sales?supplierId=${currentUser._id}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setSales(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing supplier  sales')
        }
    }

    const addPaidCommision = async() => {
      try {  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/sales?id=${activeSale._id}`,{
          method: 'PATCH',
          body: JSON.stringify({
            paidCommission: Number(activeSale.paidCommission) + Number(amount),
            remainedCommission: Number(activeSale.remainedCommission) - Number(amount)
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           toast.success(json.message)
           setIsEditOpen(false)
           setRefresh(prev => !prev)
         }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during saving sale changes')
      }
    }

    const deleteSale = async() => {
      try {
        const { _id } = activeSale
        const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/sales?id=${_id}`,{
          method: 'DELETE',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           setRefresh(prev => !prev)
           toast.success(json.message)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error(`Error deleting sale record`)
      }
    }

    function openSale(event) {
       setActiveSale(event.data)
       setIsOpen(true)
    }

    useEffect(() => {
        if(currentUser) {
            const { roleId } = currentUser
            if(roleId === 1) { listSales() }
            if(roleId === 2) { listSupplierSales() }
        }
    },[refresh])

    return {
        sales,
        isLoading,
        setRefresh,
        openSale,
        isOpen, 
        setIsOpen,
        activeSale, 
        setActiveSale,
        isEditOpen, 
        setIsEditOpen,
        amount, 
        setAmount,
        addPaidCommision,
        deleteSale
    }
}