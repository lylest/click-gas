import React from 'react'
import format from 'date-fns/format'
import Empty from '../../../../components/empty/Empty'
import Loader from "../../../../components/loader/Loader"
import MenuIcon from '../../../../components/menuitem/MenuIcon'
import { BiGroup, BiMap } from "react-icons/bi"
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useCustomerHook } from './useCustomerHook'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { Dropdown } from 'primereact/dropdown'
import { useDevicesHook } from "../../../devices/useDevicesHook"
import { useSupplierHook } from '../../../suppliers/useSupplierHook'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useGlobalContextHook } from "../../../../hook/useGlobalContextHook"
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { BiBattery, BiCalendar, BiChip, BiCircle, BiEnvelope, BiHealth, BiMapPin, BiUser, BiPhone } from 'react-icons/bi'


function ListCustomers() {
    const { isEnglish, currentUser } = useGlobalContextHook()
    const { suppliers } = useSupplierHook()
    const { devices } = useDevicesHook()
    const { 
        visible, 
        setVisible,
        customers,
        selectedSupplier, 
        setSelectedSupplier,
        selectedDevice, 
        setSelectedDevice,
        addCustomer,
        fullName,
        setFullName,
        email,
        setEmail,
        phone,
        setPhone,
        address, 
        setAddress,
        isLoading,
        setRefresh,
        openCustomer,
        activeCustomer, 
        setActiveCustomer,
        isOpen, setIsOpen,
        deleteCustomer,
        isEditOpen, 
        setIsEditOpen,
        saveCustomer,
        searchCustomers,
        physicalAddress, 
        setPhysicalAddress
     } = useCustomerHook()

     const footerContent = (
        <div>
            <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" className="p-button-text" onClick={() => setVisible(false)} />
            <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check"  onClick={() => addCustomer()} autoFocus />
        </div>
    )

    const footerEditContent = (
        <div>
            <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" className="p-button-text" onClick={() => setIsEditOpen(false)} />
            <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check"  onClick={() => saveCustomer()} autoFocus />
        </div>
    )

    const selectedSupplierTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <img alt={option.fullName} src={option.photoURL}  style={{ width: '25px', margin:'0px 12px 0px 12px', borderRadius:'14px' }} />
                    <div>{option.fullName}</div>
                </div>
            )
        }

        return <span>{props.placeholder}</span>;
    }

    const supplierOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.photoURL} src={option.photoURL}  style={{ width: '25px', margin:'0px 12px 0px 12px', borderRadius:'14px' }} />
                <div>{option.fullName}</div>
            </div>
        )
    }

    const selectedDeviceTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.serialNumber}</div>
                </div>
            )
        }

        return <span>{props.placeholder}</span>;
    }

    const deviceOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.serialNumber}</div>
            </div>
        )
    }

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
    
      const timeTemplate =(item) => {
        return format(new Date(item.createdAt), "Pp")
      }

      
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() =>   setRefresh(prev => !prev)} />
  
  const customIcons = (
    <React.Fragment>
        <button className="p-sidebar-icon p-link mr-2" onClick={() => setIsEditOpen(true)}>
            <span className="pi pi-pencil" />
        </button>
        <button className="p-sidebar-icon p-link mr-2" onClick={() => confirm1()}>
            <span className="pi pi-trash" />
        </button>
    </React.Fragment>)

const accept = () => {
    deleteCustomer()
}

const reject = () => {
     
}

const confirm1 = () => {
    confirmDialog({
        message: `Wait!? Are you sure you want to delete customer ${activeCustomer !== null ? activeCustomer.fullName: null} ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept,
        reject
    })
}
  
  return (
          <div className='page-wrapper'>
            <div className="page-bar-wrapper">
             <div className="search-bar">
                <i className="pi pi-search" />
                <input type='text' placeholder="Search"  onChange={(e) => searchCustomers(e.target.value)}/>
            </div>
            </div>

          <div className='page-filters'>
          <div className="card flex flex-wrap justify-content-left gap-3">
            <Button 
              type="button" 
              onClick={()=> setVisible(true)}
              label={isEnglish ? "Add Customer" : "Ongeza"} />

            <Button type="button" 
              label={ isEnglish ? "Total"  : "Jumla" }
              icon={(<BiGroup  size={18} style={{ marginRight: 10 }} />)} 
              outlined badge={customers.length} 
              badgeClassName="p-badge-primary" />

         </div>
            </div>

            { isLoading ? <Loader /> : customers.length <=0 ? 
              <Empty label={isEnglish ? "No Customers  currently available" : "Wateja hawapo katika mfumo kwa sasa"} Icon={BiGroup} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={customers} size='small'stripedRows
                paginatorLeft={paginatorLeft}  onRowClick={(e) => openCustomer(e)} selectionMode="single"
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
    <ConfirmDialog />
        {activeCustomer !== null ?  
        <div className="card flex justify-content-center">
            <Sidebar visible={isOpen} modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}} icons={customIcons}>
                <h3 style={{ padding: 20 }}>Customer details</h3>
                <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeCustomer.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeCustomer.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeCustomer.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeCustomer.address} Icon={BiMapPin} />
                 <MenuIcon  title={isEnglish ? "Physical Address": "Anwani Makazi"} rightTitle={activeCustomer.physicalAddress} Icon={BiMap} />
            
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
                
          
        <Dialog  header={isEnglish ? `Customer details` :"Taarifa za Mteja"}  visible={visible} modal={false}
            style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerContent} onHide={() => setVisible(false)}>

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="fullname">{isEnglish ? "Full name" :"Jina kamili"}</label> 
            <InputText id="fullname"  value={fullName} onChange={(e) => setFullName(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="phone">{isEnglish ? "Phone": "Simu"}</label> 
            <InputText id="phone"  value={phone} onChange={(e) => setPhone(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="email">{isEnglish ? "Email": "Barua pepe"}</label> 
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="physical-address">{isEnglish ? "Physical address": "Anwani ya makazi"}</label> 
            <InputText id="physical-address" value={physicalAddress} onChange={(e) => setPhysicalAddress(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="address">{isEnglish ? "Address": "Makazi"}</label> 
            <InputText id="address" value={address} onChange={(e) => setAddress(e.target.value)} aria-describedby="username-help" />
        </div> 

       { currentUser.roleId == 1 ? <div className="flex flex-column gap-2"> 
        <label htmlFor="suppliers" style={{ paddingTop: 15 }}>{isEnglish ? "Suppliers": "Wasambazaji"}</label>
            <Dropdown value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.value)} options={suppliers} optionLabel="fullName" placeholder="Select Supplier" 
               id="suppliers" filter valueTemplate={selectedSupplierTemplate} itemTemplate={supplierOptionTemplate} className="w-full " />
        </div>: null }

        <div className="flex flex-column gap-2"> 
        <label htmlFor="devices" style={{ paddingTop: 15 }}>{isEnglish ? "Devices": "Vifaa"}</label>
            <Dropdown value={selectedDevice} onChange={(e) => setSelectedDevice(e.value)} options={devices} optionLabel="fullName" placeholder="Select Device" 
               id="devices" filter valueTemplate={selectedDeviceTemplate} itemTemplate={deviceOptionTemplate} className="w-full " />
        </div>

        </Dialog>

        {/**Edit customer details */}
        <Dialog  header={isEnglish ? `Edit Customer details` :"Hariri Taarifa za Mteja"}  visible={isEditOpen} modal={false}
            style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerEditContent} onHide={() => setIsEditOpen(false)}>

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="fullname">{isEnglish ? "Full name" :"Jina kamili"}</label> 
            <InputText id="fullname"  value={fullName} onChange={(e) => setFullName(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="phone">{isEnglish ? "Phone": "Simu"}</label> 
            <InputText id="phone"  value={phone} onChange={(e) => setPhone(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="email">{isEnglish ? "Email": "Barua pepe"}</label> 
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="username-help" />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="physical-address">{isEnglish ? "Physical address": "Anwani ya makazi"}</label> 
            <InputText id="physical-address" value={physicalAddress} onChange={(e) => setPhysicalAddress(e.target.value)} aria-describedby="username-help" />
        </div> 
        
        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="address">{isEnglish ? "Address": "Makazi"}</label> 
            <InputText id="address" value={address} onChange={(e) => setAddress(e.target.value)} aria-describedby="username-help" />
        </div> 

       { currentUser.roleId == 1 ? <div className="flex flex-column gap-2"> 
        <label htmlFor="suppliers" style={{ paddingTop: 15 }}>{isEnglish ? "Suppliers": "Wasambazaji"}</label>
            <Dropdown value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.value)} options={suppliers} optionLabel="fullName" placeholder="Select Supplier" 
               id="suppliers" filter valueTemplate={selectedSupplierTemplate} itemTemplate={supplierOptionTemplate} className="w-full " />
        </div>: null }

        <div className="flex flex-column gap-2"> 
        <label htmlFor="devices" style={{ paddingTop: 15 }}>{isEnglish ? "Devices": "Vifaa"}</label>
            <Dropdown value={selectedDevice} onChange={(e) => setSelectedDevice(e.value)} options={devices} optionLabel="fullName" placeholder="Select Device" 
               id="devices" filter valueTemplate={selectedDeviceTemplate} itemTemplate={deviceOptionTemplate} className="w-full " />
        </div>

        </Dialog>
          </div>
  )
}

export default ListCustomers
