import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useNavigate, useParams } from "react-router-dom"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useEditSupplier =() => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [ supplier, setSupplier ] = useState(null)
    const { currentUser } = useGlobalContextHook()
    const [ center, setCenter] = useState({lat:-7.79,lng:33.88})
    const [ cords,setCords] = useState(null)
    const [ location,setLocation] = useState(null)
    const [ selectedIdType, setSelectedIdType] = useState(null) 
    const [ fullName, setFullName] = useState("")
    const [ phone, setPhone] = useState("")
    const [ email, setEmail] = useState("")
    const [ idNumber, setIdnumber ] = useState(0)

    const setPickedLocation =(e)=>{
        const latitude = e.latLng.lat()
        const longitude = e.latLng.lng()
        setCords({Lat:latitude, Lng:longitude}) 
    }

    const [ idTypes, setIdTypes] = useState([
        { name: "NIDA", value: "nida" },
        { name: "Voting ID", value:"voting"},
        { name: "Driving Lincence", value:"driving-lincence"},
        { name: "Other", value:"other"}
    ])


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


    const saveSupplier = async() => {
        try {
          const { Lat, Lng } = cords  
          const { _id } = supplier
          const response = await fetch(`${import.meta.env.VITE_API_URL}/update/suppliers?id=${_id}`,{
            method: 'PATCH',
            body: JSON.stringify({
                fullName:fullName,
                phoneNumber:parseInt(phone),
                email:email,
                location:{
                    type:"Point",
                    coordinates:[Lng, Lat]
                },
                idType:selectedIdType,
                idNumber:idNumber,
                createdBy:currentUser._id
            }),
            credentials: "include",
            headers: { 'Content-Type': 'application/json'}
          })

          const json = await response.json()
          if(response.ok) {
             toast.success(json.message)
             navigate('/suppliers')
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          console.log(error)
          toast.error('Error during saving supplier')
        }
    }

    
    const getSupplier = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/suppliers?id=${id}`, {
          method: 'GET',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
          setSupplier(json.data)
          setFullName(json.data.fullName)
          setPhone(json.data.phoneNumber)
          setEmail(json.data.email)
          setLocation(json.data.address)
          setIdnumber(json.data.idNumber)
          setSelectedIdType(json.data.idType)
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

    useEffect(() => {
       if(id) { getSupplier() }
    },[id])

    return {
        center,
        setPickedLocation,
        selectedIdType, 
        setSelectedIdType,
        idTypes, 
        setIdTypes,
        location,
        confirmLocation,
        setFullName,
        setPhone,
        setEmail,
        setIdnumber,
        saveSupplier,
        supplier,
        fullName,
        phone,
        email,
        idNumber
    }
}