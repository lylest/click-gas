import './home.css'
import '../../components/pagebar/pagebar.css'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import React from 'react'
import { Tag } from 'primereact/tag'
import format from 'date-fns/format'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import { useSalesHook } from "../../pages/sales/useSalesHook"
import { useSupplierHook } from '../suppliers/useSupplierHook'
import { useOrdersHook } from '../orders/useOrdersHook'
import { useCustomerHook } from '../customers/useCustomerHook'
import { useDevicesHook } from '../devices/useDevicesHook'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
  
function Home() {
const { isEnglish } = useGlobalContextHook()
const { suppliers } = useSupplierHook()
const { orders } = useOrdersHook()
const { customers } = useCustomerHook()
const { devices } = useDevicesHook() 
const { sales } = useSalesHook()


const statusTemplate =(item) => {
  //"pending" //blocked, flagged, deleted,
  return (
   <Tag severity={
      item.supplierStatus === 'active' ? "success":
      item.supplierStatus === "blocked" ? "danger" :
      item.supplierStatus === "flagged" ? "warning" : "info"
   } 

   icon={
    item.supplierStatus === 'active'? "pi pi-check":
    item.supplierStatus ===  'blocked' ? 'pi pi-times':
    item.supplierStatus === "flagged" ? "pi pi-exclamation-triangle":
    "pi pi-info-circle"
  }
   
   value={item.supplierStatus} rounded />
  )
}

const timeTemplate =(item) => {
  return format(new Date(item.createdAt), "Pp")
}

  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <br />
            <div className='grid-wrapper'>
         
            <div className="grid">
           <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Orders</span>
                        <div className="text-900 font-medium text-xl">{devices.length}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
               {/** <span className="text-green-500 font-medium">24 new</span> */}
                <span className="text-500">since last visit</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Sales</span>
                        <div className="text-900 font-medium text-xl">{sales !== null ? sales.total.toLocaleString(): 0}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-dollar text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium"></span>
                <span className="text-500">since last visit</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Customers</span>
                        <div className="text-900 font-medium text-xl">{customers.length}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-users text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-500">newly registered</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Devices</span>
                        <div className="text-900 font-medium text-xl">{devices.length}</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium"></span>
                <span className="text-500">Added devices</span>
            </div>
        </div>
            </div>

             <div className="col-12 xl:col-6" id="col-12">
             <h2 style={{ color:'var(--text-color2)', padding: '20px 15px 20px 10px '}}>Suppliers</h2>
                <div className="card">
                    <DataTable value={suppliers} size='small'stripedRows
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="fullName" sortable  header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="phoneNumber" sortable  header={isEnglish ? "Phone": "Simu"}></Column>
                   <Column field={timeTemplate}   header={isEnglish ? "Created at": "Tarehe"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Taarifa"}></Column>
               </DataTable>
                </div>
            </div>  
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home
