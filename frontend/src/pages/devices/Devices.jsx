import React, { useRef } from 'react'
const libraries = ['places']
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import format from 'date-fns/format'
import MenuIcon from '../../components/menuitem/MenuIcon'
import { Button } from 'primereact/button'
import { BsCpu } from "react-icons/bs"
import { Dialog } from 'primereact/dialog'
import { containerStyle } from '../addsupplier/Styles.js'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useDevicesHook } from './useDevicesHook'
import { useSupplierHook } from '../suppliers/useSupplierHook'
import { InputNumber } from 'primereact/inputnumber'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Menu } from 'primereact/menu'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Sidebar } from 'primereact/sidebar'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { GoogleMap, useLoadScript, MarkerF} from '@react-google-maps/api'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiBattery, BiCalendar, BiChip, BiCircle, BiDollar, BiEnvelope, BiGasPump, BiHealth, BiMapPin, BiSolidTachometer, BiUser, BiPhone, BiQrScan, BiMap, BiChart } from 'react-icons/bi'

function Devices() {
    const  popoverRef = useRef(null)
    const  navigate = useNavigate()
    const { isEnglish, currentUser } = useGlobalContextHook()
    const { suppliers } = useSupplierHook()
    const { isLoaded } = useLoadScript({
        id: 'script-loader',
        version: 'weekly',
        googleMapsApiKey:import.meta.env.VITE_MAP_API_KEY,
        libraries,
      })


    const {
        saveDevice,
        deleteDevice,
        devices,
        visible, 
        location,
        setVisible,
        selectedSupplier, 
        setSelectedSupplier,
        setSerialNumber,
        setProductName,
        serialNumber,
        productName,
        cords,
        center,
        weight,
        setWeight,
        buyingPrice,
        setBuyingPrice,
        sellingPrice,
        setSellingPrice,
        setPickedLocation,
        confirmLocation,
        passcode,
        addDevice,
        setPasscode,
        isLoading,
        activeDevice, 
        menuItems,
        setActiveDevice,
        openDevice,
        isOpen,
        setIsOpen,
        searchDevice,
        editOpen, 
        setEditOpen,
        setLocation,
        activateDevice,
        popupOpen, 
        setPopupOpen,
        setActivationCode,
        confirmDeviceActivation,
        setRefresh
    } = useDevicesHook()

    const footerContent = (
        <div>
            <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check" onClick={() => addDevice(false)} autoFocus />
        </div>
    )

    const footerEditContent = (
        <div>
            <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setEditOpen(false)} className="p-button-text" />
            <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check" onClick={() => saveDevice(false)} autoFocus />
        </div>
    )

    const footerActivateContent = (
        <div>
            <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setPopupOpen(false)} className="p-button-text" />
            <Button label={isEnglish ? "Activate": "Huisha"} icon="pi pi-check" onClick={() => confirmDeviceActivation(false)} autoFocus />
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

        return <span>{props.placeholder}</span>
    }

    const supplierOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.photoURL} src={option.photoURL}  style={{ width: '25px', margin:'0px 12px 0px 12px', borderRadius:'14px' }} />
                <div>{option.fullName}</div>
            </div>
        )
    }

      
  const statusTemplate =(item) => {
    //"pending" //blocked, flagged, deleted,
    return (
     <Tag severity={
        item.deviceStatus === 'online' ? "success":
        item.deviceStatus === "offline" ? "danger" :
        item.deviceStatus === "no-signal" ? "warning" : "info"
     } 

     icon={
      item.deviceStatus === 'online'? "pi pi-check":
      item.deviceStatus === 'offline' ? 'pi pi-times':
      item.deviceStatus === "no-signal" ? "pi pi-exclamation-triangle":
      "pi pi-info-circle"
    }
     
     value={item.deviceStatus} rounded />
    )
  }


  const dateAllocated =(item) => {
      if(item.dateAllocated) {
        return format(new Date(item.createdAt), "Pp")
      } else {
        return "Not-allocated"
      }
  }


  const paginatorLeft = <Button 
    type="button" 
    icon="pi pi-refresh" 
    text onClick={() => setRefresh(prev => !prev )} />
    
    const customIcons = (
        <React.Fragment>
           <button className="p-sidebar-icon p-link mr-2" onClick={() => activateDevice(true)}>
                <span className="pi pi-qrcode" />
            </button>

            <button className="p-sidebar-icon p-link mr-2" onClick={() => navigate(`/prediction/${activeDevice._id}`)}>
                <span className="pi pi-chart-bar" />
            </button>

        <button className="p-sidebar-icon p-link mr-2" onClick={() => setEditOpen(true)}>
                <span className="pi pi-pencil" />
            </button>


            <button className="p-sidebar-icon p-link mr-2" onClick={() => confirm1()}>
                <span className="pi pi-trash" />
            </button>
        </React.Fragment>
    )

    const accept = () => {
        deleteDevice()
    }

    const reject = () => {
         
    }
    
    const confirm1 = () => {
        confirmDialog({
            message: `Wait!? Are you sure you want to delete device with serial number ${activeDevice !== null ? activeDevice.serialNumber: null} ?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        })
    }

  //console.log(activeDevice)
  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <div className='page-wrapper'>
            <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Devices": 'Vifaa'}</h3>
             <div className="search-bar">
                <i className="pi pi-search" />
                <input type='text' placeholder="Search"  onChange={(e) => searchDevice(e.target.value)}/>
            </div>
            </div>

        <div className='page-filters'>
          <div className="card flex flex-wrap justify-content-left gap-3">
            <Button  type="button" onClick={()=> setVisible(true)} label={isEnglish ? "Add Device" : "Ongeza"} />

            <Button type="button" label={ isEnglish ? "Total"  : "Jumla" } icon={(<BsCpu  size={18} style={{ marginRight: 10 }} />)}  outlined badge={devices.length} badgeClassName="p-badge-primary" />
                 </div>
              </div>


              { isLoading ? <Loader /> : devices.length <=0 ? 
              <Empty label={isEnglish ? "No devices are currently available" : "Vifaa havipo katika mfumo kwa sasa"} Icon={BsCpu} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={devices} size='small'stripedRows
                paginatorLeft={paginatorLeft}  onRowClick={(e) => openDevice(e)} selectionMode="single"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column  field={dateAllocated}   header={isEnglish ? "Date allocation": "Tarehe ya usajili"}></Column>
                   <Column field="serialNumber" sortable   header={isEnglish ? "Serial number": "Namba seri"}></Column>
                   <Column field="batteryPercentage" sortable  header={isEnglish ? "Battery %": "Batteri %"}></Column>
                   <Column field="productName" sortable  header={isEnglish ? "Product": "Bidhaa"}></Column>
                   <Column field="weight" sortable  header={isEnglish ? "Weight": "Uzito"}></Column>
                   <Column field="gasLevel" sortable  header={isEnglish ? "Gas level": "Bei ya Gesi"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Hali"}></Column>
               </DataTable>
              </div>
             }

            <OverlayPanel ref={popoverRef}>
                  <Menu model={menuItems} />
              </OverlayPanel>

       <ConfirmDialog />
        {activeDevice !== null ? <div className="card flex justify-content-center">
            <Sidebar visible={isOpen} modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}} icons={customIcons}>
                <h3 style={{ padding: 10 }}>Device details</h3>
                <MenuIcon  title={isEnglish ? "Date allocation": "Tarehe ya usajili"} rightTitle={activeDevice.dateAllocated === null ? 'Not-allocated' :
                  format(new Date(activeDevice.dateAllocated), "Pp")} Icon={BiCalendar} />
                <MenuIcon  title={isEnglish ? "Serial number": "Namba seri"} rightTitle={activeDevice.serialNumber} Icon={BiChip} />
                <MenuIcon  title={isEnglish ? "Battery %": "Batteri %"} rightTitle={activeDevice.batteryPercentage} Icon={BiBattery} />
                <MenuIcon  title={isEnglish ? "Battery Condition": "Hali ya Batteri "} rightTitle={activeDevice.batteryCondition} Icon={BiHealth} />
                <MenuIcon  title={isEnglish ? "Status": "Hali"} rightTitle={activeDevice.deviceStatus} Icon={BiCircle} />
                <MenuIcon  id="touchable" onClick={() => activateDevice()}  title={isEnglish ? "Activation": "Uhuisha"} rightTitle={activeDevice.activation} Icon={BiQrScan} />
                <MenuIcon  title={isEnglish ? "Location": "Mahali"} rightTitle={activeDevice.address} Icon={BiMapPin} />
                <MenuIcon  title={isEnglish ? "GPS Coordinates": "GPS"} rightTitle={activeDevice.location.coordinates[0]+' , '+activeDevice.location.coordinates[1]} Icon={BiMap} />
                <div className='supplier-location'>
                    { isLoaded ? <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>  
                       <MarkerF draggable={false} 
                            position={{
                                lat: activeDevice.location.coordinates[1],
                                lng: activeDevice.location.coordinates[0]
                               }}  />
                        </GoogleMap> : 
                     <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
                    }
                 </div>

                <h3 style={{ padding: 20 }}>Product details</h3>
                <MenuIcon  title={isEnglish ? "Brand": "Brandi"} rightTitle={activeDevice.productName} Icon={BiGasPump} />
                <MenuIcon  title={isEnglish ? "Weight": "Uzito"} rightTitle={activeDevice.weight} Icon={BiSolidTachometer} />
                <MenuIcon  title={isEnglish ? "Buying price": "Bei ya kununulia"} rightTitle={activeDevice.sellingPrice.toLocaleString()} Icon={BiDollar} />
                <MenuIcon  title={isEnglish ? "Selling Price": "Bei ya Kuuzia"} rightTitle={activeDevice.buyingPrice.toLocaleString()} Icon={BiDollar} />
                <Button    style={{ margin: 15 }} onClick={()=> navigate(`/prediction/${activeDevice._id}`)} icon={<BiChart size={20} color="#666" />} severity='secondary' text label={isEnglish ? "Usages" : "Matumizi"}></Button>

                <h3 style={{ padding: 20 }}>Customer details</h3>
                 { activeDevice.customer !== null ? 
                 <>
                  <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeDevice.customer.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeDevice.customer.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeDevice.customer.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeDevice.customer.address} Icon={BiMapPin} />
                
                 </> :
                    <div className="card flex justify-content-center">
                        <Button label="Allocate device to  the customer"  outlined/>
                     </div>}

                 <h3 style={{ padding: 20 }}>Supplier details</h3>
                 <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeDevice.supplier.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeDevice.supplier.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeDevice.supplier.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeDevice.supplier.address} Icon={BiMapPin} />
            </Sidebar>
        </div>: null}



    <Dialog header={isEnglish ? `Device details` :"Taarifa za Kifaa"}  visible={visible} modal={false}
        style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerContent} onHide={() => setVisible(false)}>

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Serial number" :"Namba ya Mfululizo"}</label> 
            <InputText id="username" aria-describedby="username-help"  onChange={(e) => setSerialNumber(e.target.value)}/>
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Product name": "Jina la bidhaa"}</label> 
            <InputText id="username" aria-describedby="username-help" onChange={(e) => setProductName(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Weight": "Uzito"}</label> 
            <InputNumber id="username" aria-describedby="username-help" onValueChange={(e) => setWeight(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Buying price": "Bei ya Kununulia"}</label> 
            <InputNumber id="username" aria-describedby="username-help"  onValueChange={(e) => setBuyingPrice(e.target.value)}/>
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Selling price": "Bei ya kuuzia"}</label> 
            <InputNumber id="username" aria-describedby="username-help" onValueChange={(e) => setSellingPrice(e.target.value)} />
        </div> 

        { currentUser.roleId == 1 ? <div className="flex flex-column gap-2"> 
        <label htmlFor="suppliers" style={{ paddingTop: 15 }}>{isEnglish ? "Suppliers": "Wasambazaji"}</label>
            <Dropdown value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.value)} options={suppliers} optionLabel="fullName" placeholder="Select Supplier" 
               id="suppliers" filter valueTemplate={selectedSupplierTemplate} itemTemplate={supplierOptionTemplate} className="w-full " />
        </div> : null}

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Passcode": "Msimbo"}</label> 
            <InputNumber id="username" aria-describedby="username-help" onValueChange={(e) => setPasscode(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15, height: 500 }}>
            <label htmlFor="username">{isEnglish ? "Location": "Makazi"}</label> 
            { isLoaded ? 
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>  
                    <MarkerF draggable={true}  position={center}  onDrag={(e) => setPickedLocation(e)} />
                        </GoogleMap> : 
                <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
             }

    <InputText id="username" value={location === null ? "Location": location}  aria-describedby="username-help" onChange={(e) => setLocation(e.target.value)} />
        <Button  onClick={()=> confirmLocation()} label={isEnglish ? "Confirm location" : "Hakiki Makazi"} severity="secondary" outlined />
        </div> 
        </Dialog>

    {/**Edit device */}
    <Dialog header={isEnglish ? `Edit Device details` :"Hariri Taarifa za Kifaa"}  visible={editOpen} modal={false}
        style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerEditContent} onHide={() => setEditOpen(false)}>

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Serial number" :"Namba ya Mfululizo"}</label> 
            <InputText id="username" value={serialNumber} aria-describedby="username-help"  onChange={(e) => setSerialNumber(e.target.value)}/>
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Product name": "Jina la bidhaa"}</label> 
            <InputText id="username"  value={productName} aria-describedby="username-help" onChange={(e) => setProductName(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Weight": "Uzito"}</label> 
            <InputNumber id="username" value={weight} aria-describedby="username-help" onValueChange={(e) => setWeight(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Buying price": "Bei ya Kununulia"}</label> 
            <InputNumber id="username" value={buyingPrice} aria-describedby="username-help"  onValueChange={(e) => setBuyingPrice(e.target.value)}/>
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Selling price": "Bei ya kuuzia"}</label> 
            <InputNumber id="username" value={sellingPrice} aria-describedby="username-help" onValueChange={(e) => setSellingPrice(e.target.value)} />
        </div> 

        { currentUser.roleId == 1 ? <div className="flex flex-column gap-2"> 
        <label htmlFor="suppliers" style={{ paddingTop: 15 }}>{isEnglish ? "Suppliers": "Wasambazaji"}</label>
            <Dropdown value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.value)} options={suppliers} optionLabel="fullName" placeholder="Select Supplier" 
               id="suppliers" filter valueTemplate={selectedSupplierTemplate} itemTemplate={supplierOptionTemplate} className="w-full " />
        </div> : null}

        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Passcode": "Msimbo"}</label> 
            <InputNumber id="username" value={passcode} aria-describedby="username-help" onValueChange={(e) => setPasscode(e.target.value)} />
        </div> 

        <div className="flex flex-column gap-2" style={{ marginTop: 15, height: 500 }}>
            <label htmlFor="username">{isEnglish ? "Location": "Makazi"}</label> 
            { isLoaded ? 
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>  
                    <MarkerF draggable={true}  position={center}  onDrag={(e) => setPickedLocation(e)} />
                        </GoogleMap> : 
                <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
             }

      <InputText id="username" value={location === null ? "Location": location}  aria-describedby="username-help" onChange={(e) => setLocation(e.target.value)} />
        <Button  onClick={()=> confirmLocation()} label={isEnglish ? "Confirm location" : "Hakiki Makazi"} severity="secondary" outlined />
        </div> 
        </Dialog>

        {/** ACTIVATE DEVICE */} 
        <Dialog header={isEnglish ? `Activate Device` :"Uhuisha Kifaa"}  visible={popupOpen} modal={false}
        style={{ width: window.innerWidth > 1000 ? '40vw': '80vw' }}  footer={footerActivateContent} onHide={() => setPopupOpen(false)}>
                  
         <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Activation code" :"Kodi za kuhuisha"}</label> 
            <InputText id="username" aria-describedby="username-help"  onChange={(e) => setActivationCode(e.target.value)}/>
        </div> 
        </Dialog>

  
            </div>
          </div>
        </div>
    </div>
  )
}

export default Devices
