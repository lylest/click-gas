import React from 'react'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import { TabView, TabPanel } from 'primereact/tabview'
import { useGlobalContextHook } from '../../hook/useGlobalContextHook'
import { BiGroup } from 'react-icons/bi'
import ListCustomers from './tabs/listcustomers/ListCustomers'
import ClusterCustomer from './tabs/clustercustomer/ClusterCustomer'


function Customers() {
const { isEnglish } = useGlobalContextHook()
  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'>
            <br />
                <div className="card" style={{ margin: 15 }}>
                <TabView>
                     <TabPanel header = { isEnglish ? "Customers": "Wateja" }  leftIcon={(<BiGroup  size={18} style={{ marginRight: 10 }} />)}><ListCustomers /></TabPanel>
                     <TabPanel header = { isEnglish ? "Clustering": "Makundi" }leftIcon="pi pi-box mr-2" ><ClusterCustomer /></TabPanel>
                </TabView>
             </div>
          </div>
          </div>
          </div>
  )
}

export default Customers
