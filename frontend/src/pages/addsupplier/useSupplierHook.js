import { useState, useEffect } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useSupplierHook =() => {
    const navigate = useNavigate()
    const { currentUser } = useGlobalContextHook()
    const [ center,setCenter] = useState({lat:-7.79,lng:33.88})
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

    const addSupplier = async() => {
        try {
          console.log(phone)
          const { Lat, Lng } = cords  
          const password =   generateStrongPassword(8)
          const response = await fetch(`${import.meta.env.VITE_API_URL}/create/suppliers`,{
            method: 'POST',
            body: JSON.stringify({
                fullName:fullName,
                phoneNumber:parseInt(phone),
                email:email,
                address:location,
                location:{
                    type:"Point",
                    coordinates:[Lng, Lat],
                },
                idType:selectedIdType,
                idNumber:idNumber,
                password:password,
                tmpPassword:password,
                createdBy:currentUser._id
            }),
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
          toast.error('Error during adding supplier')
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
        addSupplier
    }
}