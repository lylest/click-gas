import toast from 'react-hot-toast'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from "react"


export const usePrediction =()=> {
    const { id } = useParams()
    const [ prediction, setPrediction] = useState([])
    const [ device, useDevice] = useState(null)
    const [ period, setPeriod ] = useState("today")
    const [ usages, setUsages ] = useState([])
    const [ dates, setDates ] = useState([new Date(), addDays(new Date(), 1) ])

    const getPrediction = async() => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/read/usages?id=${id}&prediction=yes`, {
            method: 'GET',
            credentials: "include"
          })
  
          const json = await response.json()
          if(response.ok) {
           // console.log(json, "prediction")
          }
      
          if(!response.ok){
            toast.error(json.message)
          }
      
        } catch(error){
          toast.error('Error during finding device')
        }
    }
    
    const getUsages = async() => {
      try {
        const secondDate = addDays(dates[0], 1)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/read/usages?id=${id}&usage=yes`, {
          method: 'POST',
          body:JSON.stringify({
            fromDate:format(dates[0], 'MM/dd/yyyy'),
            toDate:dates[1] === null ? format(secondDate, 'MM/dd/yyyy') : format(dates[1], 'MM/dd/yyyy')
          }),
          credentials: "include",
          headers: { 'Content-Type': 'application/json'}
        })

        const json = await response.json()
        if(response.ok) {
           setUsages(json.data)
        }
    
        if(!response.ok){
          toast.error(json.message)
        }
    
      } catch(error){
        toast.error('Error during finding device')
      }
  }
    useEffect(() => {
        if(id) { 
          getPrediction()
          getUsages()
        }
    },[ id, period, dates ])


    /** Date filters**/
    useEffect(()=>{
        if(period === "today") {
            setDates([new Date(), addDays(new Date(), 1) ])
        } 
        else if (period === "weekly") {
            setDates([addDays(new Date(), -7), addDays(new Date(), 1) ])
        } 
        else if (period === "monthly") {
            setDates([addDays(new Date(), -30), addDays(new Date(), 1) ])
        }
       else if (period === "3-months") {
            setDates([addDays(new Date(), -90), addDays(new Date(), 1) ])
        }
        else if (period === "6-months") {
            setDates([addDays(new Date(), -180), addDays(new Date(), 1) ])
        }
         else if (period === "9-months") {
            setDates([addDays(new Date(), -270), addDays(new Date(), 1) ])
        }
        else if (period === "Last year") {
            setDates([addDays(new Date(), -365), addDays(new Date(), 1) ])
        }
        else if (period === "Last three year") {
            setDates([addDays(new Date(), -1096), addDays(new Date(), 1) ])
        }
        else {
            setDates([new Date(), addDays(new Date(), 1) ])
        }
    },[ period ])


        const periods = [
        { name: "today", value:"today" },
        { name: "weekly", value:"weekly" },
        { name: "monthly", value:"monthly" },
        { name: "3-months", value:"3-months" },
        { name: "6-months", value:"6-months" },
        { name: "9-months", value:"9-months" },
        { name: "Last year", value:"Last year" },
        { name: "Last three year", value:"Last three year" },
    ]

    return {
        prediction,
        device,
        dates,
        setDates,
        period,
        setPeriod,
        periods,
        usages
    }
}