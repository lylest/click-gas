import './prediction.css'
import format from 'date-fns/format'
import React from 'react'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import MenuIcon from '../../components/menuitem/MenuIcon'
import { Calendar } from 'primereact/calendar'
import { usePrediction } from './usePrediction'
import { Dropdown } from 'primereact/dropdown'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiCalendar, BiChart } from 'react-icons/bi'

function Prediction() {
const { isEnglish } = useGlobalContextHook()
const { 
  device,
  dates,
  setDates,
  period,
  setPeriod,
  periods,
  usages
} = usePrediction()

//console.log(period)
  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <div className='page-wrapper'>
          <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Usages": 'Matumizi'}</h3>
          </div>
           {!device === null ? <Loader /> : 
           <div className='usage-wrapper'>
            <div className='usage-section'>
              <div className="card flex noflex-wrap justify-content-left gap-3">
                <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput  showIcon  style={{ margin: 15 }}/>
                   <Dropdown value={period} onChange={(e) => setPeriod(e.value)} options={periods} 
                     optionLabel="name" placeholder="Today" className="w-full"  style={{ margin: 15 }}/>
                </div>
              
              </div>
            <div className='usage-sider'>
              <h3>{ period }</h3>
               { usages.length <=0 ? <Empty Icon={BiChart} label="No usagage adjust dates" /> : 
                 usages.map(usage => ( <MenuIcon title={format(new Date(usage.createdAt), 'Pp')} Icon={BiChart} rightTitle={ usage.amount } />))
                }
            </div>
           </div>}
          </div>
       </div>
     </div>
    </div>     
  )
}

export default Prediction
