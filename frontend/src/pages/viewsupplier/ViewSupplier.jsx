import './viewsupplier.css'
import { Tag } from 'primereact/tag'
import React, { useRef } from 'react'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import MenuIcon from '../../components/menuitem/MenuIcon'
import format from 'date-fns/format'
import { Button } from 'primereact/button'
import { SelectButton } from 'primereact/selectbutton'
import { Dialog } from 'primereact/dialog'
import { containerStyle } from '../addsupplier/Styles.js'
import { BsShop } from "react-icons/bs"
import { HiAtSymbol } from "react-icons/hi"
import { AiOutlineIdcard } from "react-icons/ai"
import { FaCircle } from "react-icons/fa"
import { TbMapPin } from "react-icons/tb"
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Sidebar } from 'primereact/sidebar'
import { useNavigate } from 'react-router-dom'
import { InputSwitch } from "primereact/inputswitch"
import { useViewSupplierHook } from './useViewSupplierHook'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { GoogleMap, useLoadScript, MarkerF} from '@react-google-maps/api'
import { BiBattery, BiChip,BiGroup,BiCalendar, BiCircle, BiDollar, BiEnvelope, BiGasPump, BiHealth, BiMapPin, BiSolidTachometer, BiUser, BiPhone } from 'react-icons/bi'

const libraries = ['places']
  
function ViewSupplier() {
  const { isLoaded } = useLoadScript({
    id: 'script-loader',
    version: 'weekly',
    googleMapsApiKey:import.meta.env.VITE_MAP_API_KEY,
    libraries,
  })
  const  popoverRef = useRef(null)
  const { isEnglish } = useGlobalContextHook()
  const { 
    supplier,
    center,
    cords,
    actions,
    setActions,
    items,
    isVisible, 
    setVisible,
    togglePermission,
    localPermissions,
    editPermission,
    activePermission,
    savePermissionChanges,
    customers,
    openCustomer,
    activeCustomer,
    isOpen, setIsOpen
  } = useViewSupplierHook()

  const statusTemplate =(item) => {
    //"pending" //blocked, flagged, deleted,
    return (
     <Tag severity={
        item.customerStatus === 'active' ? "success":
        item.customerStatus === "blocked" ? "danger" :
        item.customerStatus === "flagged" ? "warning" : "info"
      } 

     icon={
      item.customerStatus === 'active'? "pi pi-check":
      item.customerStatus ===  'blocked' ? 'pi pi-times':
      item.customerStatus === "flagged" ? "pi pi-exclamation-triangle":
      "pi pi-info-circle"
    }
     value={item.customerStatus} rounded />
    )
  }
  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          { supplier === null ? <Loader /> : 
            supplier === 'not-found' ? <Empty label="Supplier Not Found" Icon={BsShop} /> :
            <div className='page-wrapper'>
                <div className="page-bar-wrapper">
                  <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "View Supplier": 'Taarifa za Msambazaji'}</h3>
                </div>

                <div className='page-setion-wrapper'>
                  <div className='page-left-section'>
                     <div className='mini-bar'>
                        <div className='min-img'>
                          <img src={supplier.photoURL} loading='lazy' />
                          </div>
                          <div>
                          <h3>{supplier.fullName}</h3>
                          <p>{supplier.email}</p>
                        </div>
                     </div>

                   <div className='supplier-location'>
                     { isLoaded ? <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>  
                       <MarkerF  draggable={false}  position={center}  />
                        </GoogleMap> : 
                     <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
                    }
                    </div>

              <h3 style={{ padding: 20 }}>Customers</h3>
              { customers.length <=0 ? 
              <Empty label={isEnglish ? "No Customers  currently available" : "Wateja hawapo katika mfumo kwa sasa"} Icon={BiGroup} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={customers} size='small'stripedRows
                onRowClick={(e) => openCustomer(e)} selectionMode="single"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="fullName" sortable  header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="phoneNumber" sortable  header={isEnglish ? "Phone": "Simu"}></Column>
                   <Column field="email" sortable  header={isEnglish ? "Email": "Barua pepe"}></Column>
                   <Column field="address" sortable  header={isEnglish ? "Address": "Makazi"}></Column>
                   <Column field="device.serialNumber" sortable  header={isEnglish ? "Device ": "Kifaa"}></Column>
                   <Column field="device.gasLevel" sortable  header={isEnglish ? "Gas level": "Kiwango cha Gesi"}></Column>
                   <Column field="supplier.fullName" sortable  header={isEnglish ? "Supplier": "Msambazaji"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Taarifa"}></Column>
               </DataTable>
              </div>
             }

              <h3 style={{ padding: 20 }}>Sales</h3>

        { activeCustomer !== null ?  
        <div className="card flex justify-content-center">
            <Sidebar visible={isOpen} modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}}>
                <h3 style={{ padding: 20 }}>Customer details</h3>
                <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeCustomer.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeCustomer.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeCustomer.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeCustomer.address} Icon={BiMapPin} />
            
                 <h3 style={{ padding: 20 }}>Device details</h3>
                {activeCustomer.device !== null ? 
                <>
                <MenuIcon  title={isEnglish ? "Date allocation": "Tarehe ya usajili"} rightTitle={activeCustomer.device.dateAllocated === null ? 'Not-allocated' :
                  format(new Date(activeCustomer.device.dateAllocated), "Pp")} Icon={BiCalendar} />
                <MenuIcon  title={isEnglish ? "Serial number": "Namba seri"} rightTitle={activeCustomer.device.serialNumber} Icon={BiChip} />
                <MenuIcon  title={isEnglish ? "Battery %": "Batteri %"} rightTitle={activeCustomer.device.batteryPercentage} Icon={BiBattery} />
                <MenuIcon  title={isEnglish ? "Battery Condition": "Hali ya Batteri "} rightTitle={activeCustomer.device.batteryCondition} Icon={BiHealth} />
                <MenuIcon  title={isEnglish ? "Status": "Hali"} rightTitle={activeCustomer.device.deviceStatus} Icon={BiCircle} />
                <MenuIcon  title={isEnglish ? "Location": "Mahali"} rightTitle={activeCustomer.device.address} Icon={BiMapPin} />
                </>: <p style={{ textAlign:'center'}}>No Device Associated with customer</p> }

                <h3 style={{ padding: 20 }}>Supplier details</h3>
                 <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeCustomer.supplier.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeCustomer.supplier.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeCustomer.supplier.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeCustomer.supplier.address} Icon={BiMapPin} />
            
            </Sidebar>
        </div> : null }
              </div>


                  <div className='page-right-section'>
                    <h3>Supplier details</h3>
                    <MenuIcon 
                      title={isEnglish ? "Phone": "Simu"}
                      rightTitle={supplier.phoneNumber}
                      Icon={BiPhone} />

                    <MenuIcon 
                      title={isEnglish ? "Email": "Barua pepe"}
                      rightTitle={supplier.email}
                      Icon={HiAtSymbol} />

                    <MenuIcon 
                      title={isEnglish ? "ID Type": "Aina ya Kitambulisho"}
                      rightTitle={supplier.idType}
                      Icon={AiOutlineIdcard} />

                    <MenuIcon 
                      title={isEnglish ? "ID Number": "Namba ya Kitambulisho"}
                      rightTitle={supplier.idNumber}
                      Icon={AiOutlineIdcard} />
                      
                    <MenuIcon 
                      title={isEnglish ? "Created at": "Tarehe ya usajili"}
                      rightTitle={format(new Date(supplier.createdAt), "Pp")}
                      Icon={BiCalendar} />

                    <MenuIcon 
                      title={isEnglish ? "Status": "Taarifa"}
                      rightTitle={supplier.supplierStatus}
                      Icon={FaCircle} />

                    <MenuIcon 
                      title={isEnglish ? "Location": "Makazi"}
                      rightTitle={supplier.address}
                      Icon={TbMapPin} />

                    <h3>Permissions</h3>
                      { localPermissions.length > 0 ? 
                         localPermissions.map(permission => (
                          <div className='permission-wrapper' key={permission.name}>
                          <div className='edit-permission'>
                              <h4>{permission.name.charAt(0).toUpperCase() + permission.name.slice(1)}</h4>
                              <div className='edit-far-btn'>
                              <Button label={isEnglish  ? "Edit" :"Hariri"}
                                onClick={()=> editPermission(permission) }
                                icon="pi pi-pencil" text />
                              </div>
                            </div>
                           {
                         permission.list.length > 0 ? permission.list.map(item => (
                          <div className="permission-bar">
                           <p>{item.toUpperCase()}</p>

                           <div className='switch-far'>
                               <div className="card flex justify-content-center">
                                <Button 
                                   onClick={()=> editPermission(permission) }
                                   icon="pi pi-check-circle" 
                                   rounded text 
                                   severity="success" 
                                   aria-label="remove trash" />
                             </div>
                           </div>

                             </div>
                            )): null
                           }
                         </div>
                         )) : null }

        <Dialog 
            header={isEnglish ? `Edit [${activePermission !== null ?
            activePermission.name: null}] permissions` :"Hariri Ruhusa"}
            visible={isVisible} modal={false}
            style={{ width: window.innerWidth > 1000 ? '50vw': '90vw' }} 
            onHide={() => setVisible(false)}>
 
          <div className="card flex justify-content-center">
            <SelectButton 
              value={actions} 
              onChange={(e) => setActions(e.value)} 
              optionLabel="name" 
              options={items} multiple />
         </div>

         <br />
         <br />
         <div className="card flex justify-content-center">
            <Button 
              onClick={() => savePermissionChanges() }
              label={isEnglish ? "Save Changes": "Hifadhi Mabadiliko"} />
        </div>
          </Dialog>
                  </div>
                </div>
          </div>}
          </div>
        </div>
    </div>
  )
}

export default ViewSupplier
