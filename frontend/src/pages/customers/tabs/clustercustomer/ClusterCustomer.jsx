import React, { useEffect, useState } from 'react'
import format from 'date-fns/format'
import Empty from '../../../../components/empty/Empty'
import Loader from "../../../../components/loader/Loader"
import { useCustomerHook } from '../listcustomers/useCustomerHook'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { useCluster } from './useCluster'
import RemainingTemplate from '../../../../components/remaininggas/RemainingTemplate'

function ClusterCustomer() {
  const { customers, isLoading, isEnglish } = useCustomerHook()

      const getRemainingGas =(item)=> {
        return (<RemainingTemplate item={item} />)
      }

      const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() =>   setRefresh(prev => !prev)} />
  
  return (
    <div>
             { isLoading ? <Loader /> : customers.length <=0 ? 
              <Empty label={isEnglish ? "No Customers  currently available" : "Wateja hawapo katika mfumo kwa sasa"} Icon={BiGroup} /> :
              <div className='table-wrapper'>
      
              <DataTable value={customers} size='small'stripedRows
                paginatorLeft={paginatorLeft}  onRowClick={(e) => openCustomer(e)} selectionMode="single"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="fullName"   header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="phoneNumber"   header={isEnglish ? "Phone": "Simu"}></Column>
                   <Column field="device.serialNumber"   header={isEnglish ? "Device ": "Kifaa"}></Column>
                   <Column field={getRemainingGas}   header={isEnglish ? "Remaining": "Siku zilizosalia"}></Column>
                   <Column field="supplier.fullName"   header={isEnglish ? "Supplier": "Msambazaji"}></Column>
               </DataTable>
              </div>
             }
    </div>
  )
}

export default ClusterCustomer
