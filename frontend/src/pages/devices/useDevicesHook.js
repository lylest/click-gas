import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"


export const useDevicesHook =()=> {
    const { currentUser, isEnglish } = useGlobalContextHook()
    const { roleId } = currentUser
    const [ devices, setDevices] = useState([])
    const [ visible, setVisible ] = useState(false)
    const [ refresh, setRefresh ] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ isOpenPopup, setIsOpenPopup ] = useState(false)
    const [ editOpen, setEditOpen ] = useState(false)
    const [ serialNumber, setSerialNumber ] = useState("")
    const [ productName, setProductName ] = useState("")
    const [ location, setLocation ] = useState(null)
    const [ passcode, setPasscode ] = useState(0)
    const [ weight, setWeight ] = useState(0)
    const [ buyingPrice, setBuyingPrice ] = useState(0)
    const [ sellingPrice, setSellingPrice ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ selectedSupplier, setSelectedSupplier ] = useState(null)
    const [ center, setCenter] = useState({lat:-7.79, lng:33.88})
    const [ cords, setCords] = useState(null)
    const [ activeDevice, setActiveDevice ] = useState(null)
    const [ popupOpen, setPopupOpen ] = useState(false)
    const [ activationCode, setActivationCode] = useState("")

    const setPickedLocation =(e)=>{
        const latitude = e.latLng.lat()
        const longitude = e.latLng.lng()
        setCords({Lat:latitude, Lng:longitude}) 
    }

    const confirmLocation = async() => {
        try {
      if(cords === null) {
                toast.error("Select location first to continue")
             } else {
                const  { Lat, Lng } = cords
                const latlng = {
                  lat:Lat,
                  lng:Lng,
                };
                const geocoder = new window.google.maps.Geocoder(); 
                const address = await geocoder.geocode({location:latlng})
                var locationName;
                if(address.results[0].address_components[1] === undefined) { 
                  locationName = address.results[1].formatted_address
                }  else {
                  locationName = address.results[0].address_components[1].long_name+',('+address.results[0].address_components[2].long_name+ '),'+address.results[0].address_components[3].long_name+','+address.results[0].address_components[4].long_name
                }
                setLocation(locationName)  
             }
             
           } catch (error) {
            console.log(error)
                toast.error("Failed to get location, Refresh browser")
           }
    }

    const addDevice = async() => {
        try {
          const { Lat, Lng } = cords  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/create/devices`,{
            method: 'POST',
            body: JSON.stringify({
                serialNumber:serialNumber,
                passcode:passcode,
                supplier: roleId == 1 ? selectedSupplier._id: currentUser._id,
                productName:productName,
                weight:weight,
                buyingPrice:buyingPrice,
                sellingPrice:sellingPrice,
                address:location,
                location:{
                    type:"Point",
                    coordinates:[Lng, Lat],
                },
                createdBy:currentUser._id
            }),
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
             toast.success(json.message)
             setVisible(false)
             setRefresh(prev => !prev)
             
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          console.error(error)
          toast.error('Error during adding devices')
        }
    }

    const listSupplierDevices = async() => {
        try {
          const { _id } = currentUser  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/devices?supplierId=${_id}`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setDevices(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during listing supplier dvices')
        }
    }

    const listAllDevices = async() => {
        try {
          const { _id } = currentUser  
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/devices`,{
            method: 'GET',
            credentials: "include"
          })

          const json = await response.json()
          if(response.ok) {
             setDevices(json.data)
             setIsLoading(false)
          }
      
          if(!response.ok){
            setIsLoading(false)
            toast.error(json.message)
          }
      
        } catch(error){
            console.error("error", error)
          toast.error('Error during listing all devices')
        }
    }

    const searchDevice = async(keyword) => {
      try { 
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/devices?search=${keyword}`,{
          method: 'GET',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           setDevices(json.data)
           setIsLoading(false)
        }
    
        if(!response.ok){
          setIsLoading(false)
          toast.error(json.message)
        }
    
      } catch(error){
          console.error("error", error)
        toast.error('Error during listing all devices')
      }
    }

    const deleteDevice = async() => {
      try {
        const { _id } = activeDevice
        const response = await fetch(`${import.meta.env.VITE_API_URL}/remove/devices?id=${_id}`,{
          method: 'DELETE',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
           listAllDevices()
           toast.success(json.message)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error(`Error deleting device`)
      }
    }

    const saveDevice = async() => {
      try {
        const { Lat, Lng } = cords  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/devices?id=${activeDevice._id}`,{
          method: 'PATCH',
          body: JSON.stringify({
              serialNumber:serialNumber,
              passcode:passcode,
              supplier: roleId == 1 ? selectedSupplier._id: currentUser._id,
              productName:productName,
              weight:weight,
              buyingPrice:buyingPrice,
              sellingPrice:sellingPrice,
              address:location,
              location:{
                  type:"Point",
                  coordinates:[Lng, Lat],
              }
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           toast.success(json.message)
           setEditOpen(false)
           listAllDevices()
        }
    
        if(!response.ok){
          toast.error(json.message)
          setEditOpen(false)
        }
    
      } catch(error){
        toast.error('Error during saving device changes')
      }
    }


    const confirmDeviceActivation = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/update/devices?id=${activeDevice._id}&activation=yes`,{
          method: 'PATCH',
          body: JSON.stringify({
              activationCode:activationCode
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           toast.success(json.message)
            setRefresh(prev => !prev)
            setPopupOpen(false)
            setActivationCode("")
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during activating device')
      }
    }

    let menuItems = [
        {
         label:isEnglish ? "Options": "Chagua",
         items:[
             { label: isEnglish ? 'Open':'Fungua', icon: 'pi pi-eye', 
                command:()=> setIsOpen(true) },
  
             { label: isEnglish ? 'Edit':'Hariri', icon: 'pi pi-pencil',
                command:()=> setEditOpen(true)
             },
             { separator: true},
             { label: isEnglish ? 'Delete':'Futa', icon: 'pi pi-fw pi-trash',
               command:()=> deleteSupplier()
             }
         ]
        }
      ]
  
    function  openDevice (event) {
        setActiveDevice(event.data)
        setIsOpen(true)
    const { data:Device } = event
    setSerialNumber(Device.serialNumber)
    setProductName(Device.productName)
    setWeight(Device.weight)
    setBuyingPrice(Device.buyingPrice)
    setSellingPrice(Device.sellingPrice)
    setSelectedSupplier(Device.supplier)
    setLocation(Device.address)
    setPasscode(Device.passcode)
    setIsOpen(true)
    setCenter({
        lat: Device.location.coordinates[1],
        lng: Device.location.coordinates[0]
       })
       
     setCords({
       Lat:Device.location.coordinates[1],
       Lng:Device.location.coordinates[0]
     })

    } 
    
    function  activateDevice() {
      setPopupOpen(true)
    }

    useEffect(()=> {
        if(currentUser) {
            const { roleId } = currentUser
            if(roleId == 1) { listAllDevices() } 
            if(roleId == 2) { listSupplierDevices() }
        }
    },[currentUser, refresh])

    return {
        cords,
        center,
        devices,
        visible, 
        setVisible,
        selectedSupplier, 
        setSelectedSupplier,
        setSerialNumber,
        serialNumber,
        setProductName,
        weight,
        setWeight,
        buyingPrice,
        setBuyingPrice,
        sellingPrice,
        setSellingPrice,
        setPickedLocation,
        confirmLocation,
        location,
        setLocation,
        passcode,
        setPasscode,
        addDevice,
        isLoading,
        activeDevice, 
        openDevice,
        setActiveDevice,
        isOpen,
        setIsOpen,
        searchDevice,
        menuItems,
        editOpen, 
        setEditOpen,
        productName,
        setCenter,
        setCords,
        deleteDevice,
        saveDevice,
        activateDevice,
        popupOpen, 
        setPopupOpen,
        setActivationCode,
        confirmDeviceActivation,
         isOpenPopup, setIsOpenPopup,
         setRefresh,
    }
}