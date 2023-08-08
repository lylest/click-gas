import { useState, useEffect} from "react"
import { useGlobalContextHook } from '../../hook/useGlobalContextHook'
import toast from 'react-hot-toast'

export const useHomeHook =()=> {
    const [ isLoading, setLoading ] = useState(true)
    const { currentUser, dispatch, encounters } = useGlobalContextHook()
   
    const likeEncounter = async(Encounter) => {
        try {
            const { _id } = currentUser
            const response = await fetch(`${import.meta.env.VITE_API_URL}/create/likes`,{
                method: 'POST',
                body: JSON.stringify({
                    likerId:_id,
                    likedId:Encounter._id
                }),
                credentials: "include",
                headers: { 'Content-Type': 'application/json'}
              })
        
              const json = await response.json()
              if(response.ok) {
                removeEncounterFromList(Encounter)
                   //toast.success(json.message +' '+ Encounter.username)
              }
          
              if(!response.ok){   
                removeEncounterFromList(Encounter)  
                 // toast.error(json.message +' '+ Encounter.username)
              }
        } catch(err) {
             toast.error(`Error during liking user`)
        }
    }

    const dislikeEncounter = async(Encounter) => {
        try {
            const { _id } = currentUser
            const response = await fetch(`${import.meta.env.VITE_API_URL}/update/likes`,{
                method: 'POST',
                body: JSON.stringify({
                    dislikerId:_id,
                    dislikedId:Encounter._id
                }),
                credentials: "include",
                headers: { 'Content-Type': 'application/json'}
              })
        
              const json = await response.json()
              if(response.ok) {
                removeEncounterFromList(Encounter)
                   toast.success(json.message +' '+ Encounter.username)
              }
          
              if(!response.ok){   
                removeEncounterFromList(Encounter)  
                  toast.error(json.message +' '+ Encounter.username)
              }
        } catch(err) {
             toast.error(`Error during disliking user`)
        }
    }

    function  removeEncounterFromList(Encounter) {
        const { _id } = Encounter 
        let newEncounters = encounters.filter(encounter => encounter._id !== _id)
        dispatch({ type: "set_encounters", payload:newEncounters })
    }
    return {
        isLoading,
        likeEncounter,
        dislikeEncounter
    }
} 