import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useSupplierHook =()=> {
    const navigate = useNavigate()
    const { isEnglish } = useGlobalContextHook()
    const [ suppliers, setSuppliers] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ activeSupplier, setActiveSupplier ] = useState(null)

    const listSuppliers = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/suppliers`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setSuppliers(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing supplier')
        }
    }

    const searchSupplier = async(keyword) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/suppliers?search=${keyword}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setSuppliers(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing supplier')
        }
    }

    const updateSupplier = async(newStatus) => {
      try {
        const { _id } = activeSupplier
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/suppliers?id=${_id}`,{
          method: 'PATCH',
          body:JSON.stringify({
             supplierStatus:newStatus
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           listSuppliers()
           toast.success(json.message)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error(`Error ${newStatus} supplier`)
      }
    }

    const deleteSupplier = async() => {
      try {
        const { _id } = activeSupplier
        const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/suppliers?id=${_id}`,{
          method: 'DELETE',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           listSuppliers()
           toast.success(json.message)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error(`Error deleting supplier`)
      }
    }

    let menuItems = [
      {
       label:isEnglish ? "Options": "Chagua",
       items:[
           { label: isEnglish ? 'Open':'Fungua', icon: 'pi pi-eye', 
              command:()=> navigate(`/view-supplier/${activeSupplier._id}`) },

           { label: isEnglish ? 'Edit':'Hariri', icon: 'pi pi-pencil',
              command:()=> navigate(`/edit-supplier/${activeSupplier._id}`)
           },

           { label: isEnglish ? 'Flag':'Ripoti', icon: 'pi pi-flag',
             command:()=> updateSupplier('flagged')},

          { label: isEnglish ? 'Activate ':'huihisha', icon: 'pi pi-check',
            command:()=> updateSupplier('active')},
             
           { label: isEnglish ? 'Block':'Zuia', icon: 'pi pi-exclamation-circle',
             command:()=> updateSupplier('blocked')
           },
           { separator: true},
           { label: isEnglish ? 'Delete':'Futa', icon: 'pi pi-fw pi-trash',
             command:()=> deleteSupplier()
           }
       ]
      }
    ]

    useEffect(()=>{
        listSuppliers()
    },[])


    return {
        suppliers,
        isLoading,
        searchSupplier,
        listSuppliers,
        setActiveSupplier,
        menuItems
    }
}