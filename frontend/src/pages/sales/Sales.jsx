import React from 'react'
import format from 'date-fns/format'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import MenuIcon from '../../components/menuitem/MenuIcon'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useSalesHook } from './useSalesHook'
import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Sidebar } from 'primereact/sidebar'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiBattery, BiCalendar, BiChip, BiCircle, BiDollar, BiEnvelope, BiGasPump, BiHealth, BiMapPin, BiSolidTachometer, BiUser, BiPhone } from 'react-icons/bi'


function Sales() {
 const { isEnglish } = useGlobalContextHook()
 const {  
    sales, 
    isLoading,
    setRefresh,
    openSale,
    isOpen, 
    setIsOpen,
    activeSale,
    isEditOpen, 
    setIsEditOpen,
    amount, 
    setAmount,
    addPaidCommision,
    deleteSale
 } = useSalesHook()

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

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() =>  setRefresh(prev => !prev)} />

  const timeTemplate =(item) => {
    return format(new Date(item.createdAt), "Pp")
  }

  const customIcons = (
    <React.Fragment>
        <button className="p-sidebar-icon p-link mr-2" onClick={() => setIsEditOpen(true)}>
            <span className="pi pi-plus" />
        </button>

        <button className="p-sidebar-icon p-link mr-2" onClick={() => confirm1()}>
            <span className="pi pi-trash" />
        </button>
    </React.Fragment>
)

const footerEditContent = (
    <div>
        <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setIsEditOpen(false)} className="p-button-text" />
        <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check" onClick={() => addPaidCommision()} autoFocus />
    </div>
)

const accept = () => {
    deleteSale()
}

const reject = () => {
     
}

const confirm1 = () => {
    confirmDialog({
        message: `Wait!? Are you sure you want to delete sale record ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept,
        reject
    });
}

  const buyingPriceTemplate =(item) => { return item.buyingPrice.toLocaleString() }
  const sellingPriceTemplate =(item) => { return item.sellingPrice.toLocaleString()}
  const commissionTemplate =(item) => { return item.commission.toLocaleString() }
  const netSaleTemplate =(item) => { return item.netSale.toLocaleString() }

  console.log(sales)

  return (
  <div className='page-container'>
    <Topnav  page="home"/>
      <div className='container'>
        <div className='sider'><Sider /></div>
        <div className='section'>

        <div className='page-wrapper'> 
        <div className="page-bar-wrapper">
           <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Sales": 'Mauzo'}</h3>
           {/*<div className="search-bar">
              <i className="pi pi-search" />
              <input type='text' placeholder="Search"  onChange={(e) => searchOrder(e.target.value)}/>
          </div>*/}
          </div>

       {sales !== null ? <div className='page-filters'>
        <div className="card flex flex-wrap justify-content-left gap-3">
          <Button type="button" label={ isEnglish ? "Sale"  : "Jumla" }icon={(<LiaFileInvoiceDollarSolid  size={18} style={{ marginRight: 10 }} />)} 
            outlined badge={sales.total.toLocaleString()} badgeClassName="p-badge-primary" />

         <Button type="button" label={ isEnglish ? "Commission"  : "Jumla ya Kamisheni" }icon={(<LiaFileInvoiceDollarSolid  size={18} style={{ marginRight: 10 }} />)} 
            outlined badge={sales.totalCommision.toLocaleString()} badgeClassName="p-badge-warning" severity='warning' />

         <Button type="button" label={ isEnglish ? "Net sale"  : "Jumla ya mauzo halisi" }icon={(<LiaFileInvoiceDollarSolid  size={18} style={{ marginRight: 10 }} />)} 
            outlined badge={sales.totalNetSale.toLocaleString()} badgeClassName="p-badge-help" severity='help' />

        <Button type="button" label={ isEnglish ? "Paid commission"  : "Kamisheni iliyolipwa" }icon={(<LiaFileInvoiceDollarSolid  size={18} style={{ marginRight: 10 }} />)} 
            outlined badge={sales.totalPaidCommision.toLocaleString()} badgeClassName="p-badge-success" severity='success' />

        <Button type="button" label={ isEnglish ? "Remained commission"  : "Kamisheni iliyosalia" }icon={(<LiaFileInvoiceDollarSolid  size={18} style={{ marginRight: 10 }} />)} 
            outlined badge={sales.totalRemainedCommision.toLocaleString()} badgeClassName="p-badge-danger" severity='danger' />
              </div>
           </div>: null}

           { isLoading ? <Loader /> : sales === null ? 
              <Empty label={isEnglish ? "No sales  currently available" : "Hakuna mauzo katika mfumo kwa sasa"} Icon={LiaFileInvoiceDollarSolid} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={sales.sales} size='small'stripedRows
                paginatorLeft={paginatorLeft}  onRowClick={(e) => openSale(e)} selectionMode="single"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field={timeTemplate}   header={isEnglish ? "Date": "Tarehe"}></Column>
                   <Column field="device.productName" sortable  header={isEnglish ? "Product": "Bidhaa"}></Column>
                   <Column field="device.weight"  sortable  header={isEnglish ? "Weight": "Uzito"}></Column>
                   <Column body={buyingPriceTemplate}  sortable  header={isEnglish ? "Buying price": "Bei ya kununulia"}></Column>
                   <Column body={sellingPriceTemplate}  sortable  header={isEnglish ? "Selling price": "Bei ya kuuzia"}></Column>
                   <Column body={commissionTemplate}  sortable  header={isEnglish ? "Commision": "Kamisheni"}></Column>
                   <Column body={netSaleTemplate}  sortable  header={isEnglish ? "Net sale": "Mauzo kamili"}></Column>
                   <Column field="customer.fullName" sortable  header={isEnglish ? "Customer": "Mteja"}></Column>
                   <Column field="supplier.fullName" sortable  header={isEnglish ? "Supplier": "Msambazaji"}></Column>
               </DataTable>
              </div>
             }

        <ConfirmDialog />
        {activeSale !== null ?  
         <div className="card flex justify-content-center">
            <Sidebar visible={isOpen}  modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}}  icons={customIcons}>
            <h3 style={{ padding: 20 }}>Sale details</h3>
                <MenuIcon  title={isEnglish ? "Selling price": "Bei ya kuuzia"} rightTitle={activeSale.sellingPrice.toLocaleString()} Icon={LiaFileInvoiceDollarSolid} />
                 <MenuIcon  title={isEnglish ? "Commission": "Kamisheni"} rightTitle={activeSale.commission.toLocaleString()} Icon={LiaFileInvoiceDollarSolid} />
                 <MenuIcon  title={isEnglish ? "Netsale": "Mauzo halisi"} rightTitle={activeSale.netSale.toLocaleString()} Icon={LiaFileInvoiceDollarSolid} />
                 <MenuIcon  title={isEnglish ? "Commission Paid": "Kamisheni iliyolipwa"} rightTitle={activeSale.paidCommission.toLocaleString()} Icon={LiaFileInvoiceDollarSolid} />
                 <MenuIcon  title={isEnglish ? "Remained comission": "Kamisheni iliyosalia"} rightTitle={activeSale.remainedCommission.toLocaleString()} Icon={LiaFileInvoiceDollarSolid} />

                 <h3 style={{ padding: 20 }}>Product details</h3>
                <MenuIcon  title={isEnglish ? "Brand": "Brandi"} rightTitle={activeSale.device.productName} Icon={BiGasPump} />
                <MenuIcon  title={isEnglish ? "Weight": "Uzito"} rightTitle={activeSale.device.weight} Icon={BiSolidTachometer} />
                
                 <h3 style={{ padding: 20 }}>Device details</h3>
                {activeSale.device !== null ? 
                <>
                <MenuIcon  title={isEnglish ? "Date allocation": "Tarehe ya usajili"} rightTitle={activeSale.device.dateAllocated === null ? 'Not-allocated' :
                  format(new Date(activeSale.device.dateAllocated), "Pp")} Icon={BiCalendar} />
                <MenuIcon  title={isEnglish ? "Serial number": "Namba seri"} rightTitle={activeSale.device.serialNumber} Icon={BiChip} />
                <MenuIcon  title={isEnglish ? "Battery %": "Batteri %"} rightTitle={activeSale.device.batteryPercentage} Icon={BiBattery} />
                <MenuIcon  title={isEnglish ? "Battery Condition": "Hali ya Batteri "} rightTitle={activeSale.device.batteryCondition} Icon={BiHealth} />
                <MenuIcon  title={isEnglish ? "Status": "Hali"} rightTitle={activeSale.device.deviceStatus} Icon={BiCircle} />
                <MenuIcon  title={isEnglish ? "Location": "Mahali"} rightTitle={activeSale.device.address} Icon={BiMapPin} />
                </>: <p style={{ textAlign:'center'}}>No Device Associated with customer</p> }

                <h3 style={{ padding: 20 }}>Customer details</h3>
                <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeSale.customer.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeSale.customer.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeSale.customer.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeSale.customer.address} Icon={BiMapPin} />
            
                <h3 style={{ padding: 20 }}>Supplier details</h3>
                 <MenuIcon  title={isEnglish ? "Full name": "Jina kamili"} rightTitle={activeSale.supplier.fullName} Icon={BiUser} />
                 <MenuIcon  title={isEnglish ? "Phone": "Simu"} rightTitle={activeSale.supplier.phoneNumber} Icon={BiPhone} />
                 <MenuIcon  title={isEnglish ? "Email": "Barua pepe"} rightTitle={activeSale.supplier.email} Icon={BiEnvelope} />
                 <MenuIcon  title={isEnglish ? "Address": "Makazi"} rightTitle={activeSale.supplier.address} Icon={BiMapPin} />
            
            </Sidebar>
        </div> : null }  

        <Dialog header={isEnglish ? `Add Paid Commision ` :"Ongeza kamisheni"}  visible={isEditOpen} modal={false}
         style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerEditContent} onHide={() => setIsEditOpen(false)}>
       
        <div className="flex flex-column gap-2" style={{ marginTop: 15 }}>
            <label htmlFor="username">{isEnglish ? "Amount": "Kiasi"}</label> 
            <InputNumber id="username" value={amount} aria-describedby="username-help"  onValueChange={(e) => setAmount(e.target.value)}/>
        </div>
        </Dialog>     

           </div>
        </div>
      </div>
  </div>
  )
}

export default Sales
