import './supplier.css'
import React, { useRef } from 'react'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import { InputText } from "primereact/inputtext"
import { useSupplierHook } from './useSupplierHook'
import { Button } from 'primereact/button'
import { BsShop } from "react-icons/bs"
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import format from 'date-fns/format'
import { Tag } from 'primereact/tag'
import { Menu } from 'primereact/menu'
import { OverlayPanel } from 'primereact/overlaypanel'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
  
function Suppliers() {
  const  popoverRef = useRef(null)
  const { isEnglish } = useGlobalContextHook()
  const { 
    suppliers, 
    isLoading,
    menuItems,
    listSuppliers,
    searchSupplier,
    setActiveSupplier
  } = useSupplierHook()
  const navigate = useNavigate()

  
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

  const menuTemplate =(Supplier) => {
    return (
      <Button 
       onClick={(e) => openMenu(e, Supplier)} 
        icon="pi pi-ellipsis-h" 
        rounded text 
        severity="secondary" 
        aria-label="Menu" />
    )
  }

  const openMenu =(e, Supplier) => {
    popoverRef.current.toggle(e)
    setActiveSupplier(Supplier)
  }

  const paginatorLeft = <Button 
    type="button" 
    icon="pi pi-refresh" 
    text onClick={() => listSuppliers()} />

  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <div className='page-wrapper'>
          <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Suppliers": 'Wasambazaji'}</h3>
             <div className="search-bar">
                <i className="pi pi-search" />
                <input type='text' placeholder="Search"  onChange={(e) => searchSupplier(e.target.value)}/>
            </div>
          </div>

          <div className='page-filters'>
          <div className="card flex flex-wrap justify-content-left gap-3">
            <Button 
              type="button" 
              onClick={()=> navigate('/add-supplier')}
              label={isEnglish ? "Add Supplier" : "Ongeza"} />

            <Button type="button" 
              label={ isEnglish ? "Total"  : "Jumla" }
              icon={(<BsShop  size={18} style={{ marginRight: 10 }} />)} 
              outlined badge={suppliers.length} 
              badgeClassName="p-badge-primary" />

         </div>
          </div>
            { isLoading ? <Loader /> : suppliers.length <=0 ? 
              <Empty label={isEnglish ? "No suppliers are currently available" : "Wasambazaji hawapo katika mfumo kwa sasa"} Icon={BsShop} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={suppliers} size='small'stripedRows
              paginatorLeft={paginatorLeft} 
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="fullName" sortable  header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="phoneNumber" sortable  header={isEnglish ? "Phone": "Simu"}></Column>
                   <Column field="email" sortable  header={isEnglish ? "Email": "Barua pepe"}></Column>
                   <Column field="idType" sortable  header={isEnglish ? "ID type": "Aina ya Kitambulisho"}></Column>
                   <Column field="idNumber" header={isEnglish ? "ID Number": "Namba"}></Column>
                   <Column field={timeTemplate}   header={isEnglish ? "Created at": "Tarehe"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Taarifa"}></Column>
                   <Column body={menuTemplate} header={isEnglish ? "Menu": "Menyu"}></Column>
               </DataTable>
              </div>
             }
              <OverlayPanel ref={popoverRef}>
                  <Menu model={menuItems} />
              </OverlayPanel>
          </div>
          </div>
        </div>
    </div>
  )
}

export default Suppliers
