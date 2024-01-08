import toast from 'react-hot-toast'
import { useState, useEffect } from "react"
import { useGlobalContextHook } from "../../../../hook/useGlobalContextHook"

export const useCluster =()=> {
    const { isEnglish } = useGlobalContextHook()

    const getPrediction = async(deviceId) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/customers?byPrediction=all&deviceId=${deviceId}`,{
          method: 'GET',
          credentials: "include"
        })

        const json = await response.json()
        if(response.ok) {
            if(json.data.length > 0) {
              return json.data[0].results[0].value
            } else return 0 
        }

        if(!response.ok){
          setIsLoading(false)
          toast.error(json.message)
        }

      } catch(error){
        toast.error('Error during searchings customers')
      }
  }

  return {
     isEnglish,
     getPrediction
  }
}