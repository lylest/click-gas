import React,{ useState, useEffect } from 'react'
import { useCluster } from '../../pages/customers/tabs/clustercustomer/useCluster'
import { classNames } from 'primereact/utils'
import './remaining.css'

function RemainingTemplate({ item }) {
    const [ days, setDays ] = useState(0)
    const [ percentage, setPercentage ] = useState(0)
    const [ BorderRadius, setBorderRadius] = useState(`10rem 0rem 0rem 10rem`)
    const { getPrediction } = useCluster()

    async function obtainPrediction () {
        var daysLeft = await getPrediction(item.device._id)
        setDays(daysLeft)
        setPercentage((( daysLeft /60)*100).toFixed())

        if (  percentage >= 100) {
            setBorderRadius(`10rem 10rem 10rem 10rem`)
        }
    }
    useEffect(()=> {
        obtainPrediction()
    },[item]) 

    console.log(percentage)
   return (
    <div className='p-bar'>
        <p>{days.toFixed(0)+ " Days"}</p>
        <div className='p-line' 
        style={{ 
            width: `${percentage}%`,
            borderRadius:BorderRadius
            }}></div>
    </div>
   )
}

export default RemainingTemplate
