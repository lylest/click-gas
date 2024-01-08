import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useOrdersHook =()=> {
    const [ orders, setOrders] = useState([])
    const [ refresh, setRefresh] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ visible, setVisible ] = useState(false)
    const [ activeOrder, setActiveOrder ] = useState(null)
    const { isEnglish, currentUser } = useGlobalContextHook()
    const [ center, setCenter] = useState({lat:-7.79, lng:33.88})
    const [ destination, setDestination] = useState({lat:-7.79, lng:33.88})
    const [ directions, setDirections] = useState(null)

    const listOrders = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/orders`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setOrders(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing orders')
        }
    }

    const listSupplierOrders = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/orders?supplierId=${currentUser._id}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setOrders(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing orders')
        }
    }

    let menuItems = [
        {
         label:isEnglish ? "Options": "Chagua",
         items:[
             { label: isEnglish ? 'Open':'Fungua', icon: 'pi pi-eye', 
                command:()=> setIsOpen(true)},
  
            { label: isEnglish ? 'New-order':'Oda mpya', icon: 'pi pi-cart-plus',
              command:()=> updateOrder('new-order')},

            { label: isEnglish ? 'Delivered ':'Imefika', icon: 'pi pi-check',
              command:()=> updateOrder('delivered')},
               
            { label: isEnglish ? 'Un-delivered':'Haijafika', icon: 'pi pi-exclamation-circle',
               command:()=> updateOrder('un-delivered')
            },

            { label: isEnglish ? 'On-delivery':'Ipo njiani', icon: 'pi pi pi-truck',
              command:()=> updateOrder('on-delivery')
            },

            { label: isEnglish ? 'Route':'Njia', icon: 'pi pi pi-map',
            command:()=> showRoute()
            },

            { separator: true},
            { label: isEnglish ? 'Delete':'Futa', icon: 'pi pi-fw pi-trash',
               command:()=> deleteOrder()
             }
         ]
        }
      ] 

    
    const updateOrder = async(newStatus) => {
        try {
          const { _id } = activeOrder
          const response = await fetch(`${import.meta.env.VITE_API_URL}/update/orders?id=${_id}`,{
            method: 'PATCH',
            body:JSON.stringify({
               orderStatus:newStatus
            }),
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
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
          toast.error(`Error ${newStatus} order`)
        }
      }
     
    const deleteOrder = async() => {
        try {
          const { _id } = activeOrder
          const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/orders?id=${_id}`,{
            method: 'DELETE',
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
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
          toast.error(`Error ${newStatus} order`)
        }
    }

    const searchOrder = async(keyword) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/orders?search=${keyword}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setOrders(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing search orders')
        }
    } 
    
    const showRoute = async () => {
      try {
      setVisible(true)
      setDirections(null)
      const service = new window.google.maps.DirectionsService()
      service.route({
        origin:center,
        destination:destination,
        travelMode:window.google.maps.TravelMode.DRIVING
      },(result, status) => {
        //sometimes it fails to find a route
          if(status === "OK" && result) {
             setDirections(result)
          } else {
            toast.error("Failed to suggest suitable direction")
          }
      })
      } catch (err) {
         console.log(err)
      }
    }

    useEffect(() => {
        if(currentUser) {
            const { roleId } = currentUser
            if(roleId == 1) { listOrders() }
            if(roleId == 2) { listSupplierOrders() }
        }
    },[refresh])

    return {
        orders,
        isLoading,
        setRefresh,
        menuItems,
        setActiveOrder,
        searchOrder,
        activeOrder,
        isOpen, setIsOpen,
        visible,
        setVisible,
        center, 
        destination,
        setCenter,
        setDestination,
        directions
    }
}