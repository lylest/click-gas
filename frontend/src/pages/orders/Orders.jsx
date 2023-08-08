const libraries = ['places']
import './order.css'
import React,{ useRef } from 'react'
import format from 'date-fns/format'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import MenuIcon from '../../components/menuitem/MenuIcon'
import Loader from "../../components/loader/Loader"
import formatDistance from 'date-fns/formatDistance'
import { Button } from 'primereact/button'
import { BsCartCheck } from 'react-icons/bs'
import { useOrdersHook } from './useOrdersHook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { BsCpu } from "react-icons/bs"
import { Dialog } from 'primereact/dialog'
import { Tag } from 'primereact/tag'
import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'
import { containerStyle } from '../addsupplier/Styles.js'
import { OverlayPanel } from 'primereact/overlaypanel'
import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
import { ProgressSpinner } from 'primereact/progressspinner'
import { GoogleMap, useLoadScript, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiBattery, BiCalendar, BiChip, BiCircle, BiDollar, BiEnvelope, BiGasPump, BiHealth, BiMapPin, BiSolidTachometer, BiUser, BiPhone } from 'react-icons/bi'

  
function Orders() {
  const  popoverRef = useRef(null)
  const { isEnglish } = useGlobalContextHook()
  const { 
    orders,
    isLoading,
    menuItems,
    searchOrder,
    setRefresh,
    activeOrder,
    setActiveOrder,
    isOpen, setIsOpen,
    visible,
    setVisible,
    center, 
    destination,
    setCenter,
    setDestination,
    directions
  } = useOrdersHook()

  const { isLoaded } = useLoadScript({
    id: 'script-loader',
    version: 'weekly',
    googleMapsApiKey:import.meta.env.VITE_MAP_API_KEY,
    libraries,
  })

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() =>  setRefresh(prev => !prev)} />
  const statusTemplate =(item) => {
    return (
     <Tag severity={
        item.orderStatus === 'delivered' ? "success":
        item.orderStatus === "un-delivered" ? "danger" :
        item.orderStatus === "on-delivery" ? "info" :
        item.orderStatus === "new-order" ? "warning" : "info"
     } 

     icon={
      item.orderStatus === 'delivered'? "pi pi-check":
      item.orderStatus === 'un-delivered' ? 'pi pi-times':
      item.orderStatus === "new-order" ? "pi pi-cart-plus":
      item.orderStatus === "on-delivery" ? "pi pi-truck": "pi pi-info-circle"
    }
     
     value={item.orderStatus} rounded />
    )
  }

  const timeTemplate =(item) => {
    return  formatDistance(new Date(), new Date(item.updatedAt), { addSuffix:false })
  }

  const openMenu = (event, Order) => {
    popoverRef.current.toggle(event)
    setActiveOrder(Order)
    setCenter({
      lat:Order.supplier.location.coordinates[1], 
      lng:Order.supplier.location.coordinates[0]
    })

    setDestination({
      lat:Order.device.location.coordinates[1], 
      lng:Order.device.location.coordinates[0]
    })
  }

  const menuTemplate =(Order) => {
    return (
      <Button 
       onClick={(event) => openMenu(event, Order)} 
        icon="pi pi-ellipsis-h" 
        rounded text 
        severity="secondary" 
        aria-label="Menu" />
    )
  }

  
  const footerContent = (
    <div>
        <Button label={isEnglish ? "Close": "Funga"} icon="pi pi-times" onClick={() => setVisible(false)} autoFocus />
    </div>
   )
  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'>
          <div className='page-wrapper'> 
          <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Orders": 'Oda'}</h3>
             <div className="search-bar">
                <i className="pi pi-search" />
                <input type='text' placeholder="Search"  onChange={(e) => searchOrder(e.target.value)}/>
            </div>
            </div>

          <div className='page-filters'>
          <div className="card flex flex-wrap justify-content-left gap-3">
            <Button type="button" label={ isEnglish ? "Total"  : "Jumla" }icon={(<BsCartCheck  size={18} style={{ marginRight: 10 }} />)} 
              outlined badge={orders.length} badgeClassName="p-badge-primary" />

                </div>
             </div>

             { isLoading ? <Loader /> : orders.length <= 0 ? 
              <Empty label={isEnglish ? "No orders  currently available" : "Hakuna oda katika mfumo kwa sasa"} Icon={LiaFileInvoiceDollarSolid} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={orders} size='small'stripedRows
              paginatorLeft={paginatorLeft} 
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="customer.fullName" sortable  header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="device.productName" sortable  header={isEnglish ? "Product": "Bidhaa"}></Column>
                   <Column field="device.weight" sortable  header={isEnglish ? "Weight": "Uzito"}></Column>
                   <Column field="supplier.fullName" sortable  header={isEnglish ? "Supplier": "Msambazaji"}></Column>
                   <Column field={timeTemplate}   header={isEnglish ? "Delivery Await": "Mda"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Taarifa"}></Column>
                   <Column body={menuTemplate} header={isEnglish ? "Menu": "Menyu"}></Column>
               </DataTable>
              </div>
             }

              <OverlayPanel ref={popoverRef}>
                  <Menu model={menuItems} />
              </OverlayPanel>

        {activeOrder !== null ?  
        <div className="card flex justify-content-center">
            <Sidebar visible={isOpen}  modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}}>
                <h3 style={{ padding: 20 }}>Customer details</h3>
                <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeOrder.customer.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeOrder.customer.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeOrder.customer.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeOrder.customer.address} Icon={BiMapPin} />
            
                 <h3 style={{ padding: 20 }}>Device details</h3>
                {activeOrder.device !== null ? 
                <>
                <MenuIcon  title={isEnglish ? "Date allocation": "Tarehe ya usajili"} rightTitle={activeOrder.device.dateAllocated === null ? 'Not-allocated' :
                  format(new Date(activeOrder.device.dateAllocated), "Pp")} Icon={BiCalendar} />
                <MenuIcon  title={isEnglish ? "Serial number": "Namba seri"} rightTitle={activeOrder.device.serialNumber} Icon={BiChip} />
                <MenuIcon  title={isEnglish ? "Battery %": "Batteri %"} rightTitle={activeOrder.device.batteryPercentage} Icon={BiBattery} />
                <MenuIcon  title={isEnglish ? "Battery Condition": "Hali ya Batteri "} rightTitle={activeOrder.device.batteryCondition} Icon={BiHealth} />
                <MenuIcon  title={isEnglish ? "Status": "Hali"} rightTitle={activeOrder.device.deviceStatus} Icon={BiCircle} />
                <MenuIcon  title={isEnglish ? "Location": "Mahali"} rightTitle={activeOrder.device.address} Icon={BiMapPin} />
                </>: <p style={{ textAlign:'center'}}>No Device Associated with customer</p> }

                <h3 style={{ padding: 20 }}>Product details</h3>
                <MenuIcon  title={isEnglish ? "Brand": "Brandi"} rightTitle={activeOrder.device.productName} Icon={BiGasPump} />
                <MenuIcon  title={isEnglish ? "Weight": "Uzito"} rightTitle={activeOrder.device.weight} Icon={BiSolidTachometer} />
                <MenuIcon  title={isEnglish ? "Buying price": "Bei ya kununulia"} rightTitle={activeOrder.device.sellingPrice.toLocaleString()} Icon={BiDollar} />
                <MenuIcon  title={isEnglish ? "Selling Price": "Bei ya Kuuzia"} rightTitle={activeOrder.device.buyingPrice.toLocaleString()} Icon={BiDollar} />

                <h3 style={{ padding: 20 }}>Supplier details</h3>
                 <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeOrder.supplier.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeOrder.supplier.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeOrder.supplier.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeOrder.supplier.address} Icon={BiMapPin} />
            
            </Sidebar>
        </div> : null }  

      <Dialog header={isEnglish ? `Delivery route` :"Njia ya usafirishaji"}  visible={visible} modal={false}
        style={{ width: window.innerWidth > 1000 ? '80vw': '90vw' }}  footer={footerContent} onHide={() => setVisible(false)}>
        <div className='map-container'>
          <div className='direction-stats'>
           {directions ?  
           <h3>{directions.routes[0].legs[0].duration.text}
            <span>({directions.routes[0].legs[0].distance.text})</span>
            </h3>: null}
          </div>
     <div style={{ width:'100vh', height:'100vh'}}>
     { isLoaded ? 
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>  
                <MarkerF draggable={false}  position={center} icon="https://img.icons8.com/arcade/40/shop.png"/>
                <MarkerF draggable={false}  position={destination} icon="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-customer-100-most-used-icons-flaticons-flat-flat-icons.png" alt="external-customer-100-most-used-icons-flaticons-flat-flat-icons"/>

            { directions &&  <DirectionsRenderer directions={directions} />}  
            </GoogleMap> : 
           <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
          }
     </div>

        </div>
        </Dialog> 

             </div>
          </div>
        </div>
    </div>
  )
}

export default Orders
