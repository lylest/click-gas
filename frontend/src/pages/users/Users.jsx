import React from 'react'
import format from 'date-fns/format'
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import MenuIcon from '../../components/menuitem/MenuIcon'
import { DataTable } from 'primereact/datatable'
import { Sidebar } from 'primereact/sidebar'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Dialog } from 'primereact/dialog'
import { InputText } from "primereact/inputtext"
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { LiaUsersCogSolid } from "react-icons/lia"
import { useUsersHook } from './useUsersHook'
import { SelectButton } from 'primereact/selectbutton'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiLock } from 'react-icons/bi'
  
function Users() {
const { isEnglish } = useGlobalContextHook()
const {
    users,
    isLoading,
    visible,
    setVisible,
    setFullName,
    idTypes, 
    setIdTypes,
    setPhone,
    setEmail,
    setIdnumber,
    selectedIdType, 
    setSelectedIdType,
    addUser,
    listUsers,
    isOpen,
    setIsOpen,
    openUser,
    deleteUser,
    activeUser,
    localPermissions,
    editPermission,
    editVisible,
    setEditVisible,
    setActions,
    activePermission,
    actions,
    items,
    searchUser,
    savePermissionChanges,
    isOpenPopup, setIsOpenPopup,
    fullName,
    email,
    phone,
    idNumber,
    saveBasicUserDetails
} = useUsersHook()

const footerContent = (
    <div>
        <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
        <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check" onClick={() => addUser(false)} autoFocus />
    </div>
   )
   
const footerEditContent = (
    <div>
        <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setIsOpenPopup(false)} className="p-button-text" />
        <Button label={isEnglish ? "Save": "Hifadhi"} icon="pi pi-check" onClick={() => saveBasicUserDetails()} autoFocus />
    </div>
   )

const paginatorLeft = <Button  type="button" icon="pi pi-refresh" text onClick={() => listUsers()} />

  const statusTemplate =(item) => {
    return (
     <Tag severity={
        item.userStatus === 'active' ? "success":
        item.userStatus === "blocked" ? "danger" :
        item.userStatus === "flagged" ? "warning" : "info"
     } 

     icon={
      item.userStatus === 'active'? "pi pi-check":
      item.userStatus ===  'blocked' ? 'pi pi-times':
      item.userStatus === "flagged" ? "pi pi-exclamation-triangle":
      "pi pi-info-circle"
    }
     
     value={item.userStatus} rounded />
    )
  }

  const timeTemplate =(item) => {
    return format(new Date(item.createdAt), "Pp")
  }

  const accept = () => {
    deleteUser()
}

const reject = () => {
     
}

const confirm1 = () => {
    confirmDialog({
        message: `WAIT!? Are you sure you want to delete this user, this action can not be reversed ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept,
        reject
    });
};

  const customIcons = (
    <React.Fragment>
        <button className="p-sidebar-icon p-link mr-2" onClick={() => setIsOpenPopup(true)}>
            <span className="pi pi-pencil" />
        </button>

        <button className="p-sidebar-icon p-link mr-2" onClick={() => confirm1()}>
            <span className="pi pi-trash" />
        </button>
    </React.Fragment>
)

  return (
    <div className='page-container'>
      <Topnav  page="home"/>
        <div className='container'>
          <div className='sider'><Sider /></div>
          <div className='section'> 
          <div className='page-wrapper'> 
          <div className="page-bar-wrapper">
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Users": 'Watumiaji'}</h3>
             <div className="search-bar">
                <i className="pi pi-search" />
                <input type='text' placeholder="Search"  onChange={(e) => searchUser(e.target.value)}/>
            </div>
            </div>

            <div className='page-filters'>
            <div className="card flex flex-wrap justify-content-left gap-3">
            <Button 
              type="button" 
              onClick={()=> setVisible(true)}
              label={isEnglish ? "Add User" : "Ongeza Mtumiaji"} />

            <Button type="button" label={ isEnglish ? "Total"  : "Jumla" }icon={(<LiaUsersCogSolid  size={18} style={{ marginRight: 10 }} />)} 
              outlined badge={users.length} badgeClassName="p-badge-primary" />
                </div>
             </div>

             { isLoading ? <Loader /> : users.length <= 0 ? 
              <Empty label={isEnglish ? "No users are currently available" : "Watumiaji hawapo katika mfumo kwa sasa"} Icon={LiaUsersCogSolid} /> :
              <div className='table-wrapper'>
                {/**paginatorRight={paginatorRight} */}
              <DataTable value={users} size='small'stripedRows
               paginatorLeft={paginatorLeft} onRowClick={(e) => openUser(e)} selectionMode="single"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '10rem' }}>
                   <Column headerStyle={{ width: '3rem' }}></Column>
                   <Column field="username" sortable  header={isEnglish ? "Fullname": "Jina"}></Column>
                   <Column field="phoneNumber" sortable  header={isEnglish ? "Phone": "Simu"}></Column>
                   <Column field="email" sortable  header={isEnglish ? "Email": "Barua pepe"}></Column>
                   <Column field="idType" sortable  header={isEnglish ? "ID type": "Aina ya Kitambulisho"}></Column>
                   <Column field="idNumber" header={isEnglish ? "ID Number": "Namba"}></Column>
                   <Column field={timeTemplate}   header={isEnglish ? "Created at": "Tarehe"}></Column>
                   <Column body={statusTemplate} header={isEnglish ? "Status": "Taarifa"}></Column>
               </DataTable>
              </div>
             }

            <ConfirmDialog />
            { activeUser !== null ?  
            <div className="card flex justify-content-center">
            <Sidebar visible={isOpen}  modal={false}  position="right" onHide={() => setIsOpen(false)} className="w-full md:w-20rem lg:w-30rem" style={{ backgroundColor:`var(--bg1)`}}  icons={customIcons}>
            <h3 style={{ padding: 20 }}>Permissions</h3>
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
            <h3 style={{ padding: 20 }}>User details</h3>
            <MenuIcon  title={isEnglish ? "Temporary password": "Msimbo wa mdamfupi"} rightTitle={activeUser.tmpPassword} Icon={BiLock} />
            </Sidebar></div> :null }
             

        <Dialog header={isEnglish ? `User details` :"Taarifa za Mtumiaji"}  visible={visible} modal={false}
             style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerContent} onHide={() => setVisible(false)}>
                   

                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText onChange={(e) => setFullName(e.target.value)} placeholder={isEnglish ? "Full name": "Jina kamili"} />
                    </span>

                    <span className="p-input-icon-left" style={{ margin: 10 }}>
                        <i className="pi pi-at" />
                        <InputText 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEnglish ? "E-mail" : "Barua pepe"} />
                     </span>

                    <span className="p-input-icon-left">
                        <i className="pi pi-phone" />
                        <InputText onChange={(e) => setPhone(e.target.value)} placeholder={isEnglish? "Phone": "Simu"} />
                    </span>

                  <Dropdown value={selectedIdType} onChange={(e) => setSelectedIdType(e.value)} options={idTypes} optionLabel="name" 
                    editable placeholder={isEnglish ? "Select ID Type": "Aina ya kitambulisho"} style={{ margin: 10 }} />
                    
                    <br />
                    <span className="p-input-icon-left" style={{ marginTop: 10 }}>
                    <i className="pi pi-id-card" />
                        <InputText  onChange={(e) => setIdnumber(e.target.value)} placeholder={isEnglish ? "ID number": "Namba ya Kitambulisho"} />
                    </span>
        </Dialog>

        {/**EDIT USER DETAILS */}

        <Dialog header={isEnglish ? `Edit details` :"Hariri Taarifa"}  visible={isOpenPopup} modal={false}
             style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerEditContent} onHide={() => setIsOpenPopup(false)}>
                   

                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isEnglish ? "Full name": "Jina kamili"} />
                    </span>

                    <span className="p-input-icon-left" style={{ margin: 10 }}>
                        <i className="pi pi-at" />
                        <InputText  value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEnglish ? "E-mail" : "Barua pepe"} />
                     </span>

                    <span className="p-input-icon-left">
                        <i className="pi pi-phone" />
                        <InputText value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={isEnglish? "Phone": "Simu"} />
                    </span>

                  <Dropdown value={selectedIdType} onChange={(e) => setSelectedIdType(e.value)} options={idTypes} optionLabel="name" 
                    editable placeholder={isEnglish ? "Select ID Type": "Aina ya kitambulisho"} style={{ margin: 10 }} />
                    
                    <br />
                    <span className="p-input-icon-left" style={{ marginTop: 10 }}>
                    <i className="pi pi-id-card" />
                        <InputText  value={idNumber} onChange={(e) => setIdnumber(e.target.value)} placeholder={isEnglish ? "ID number": "Namba ya Kitambulisho"} />
                    </span>
        </Dialog>

         <Dialog 
            header={isEnglish ? `Edit [${activePermission !== null ?
            activePermission.name: null}] permissions` :"Hariri Ruhusa"}
            visible={editVisible} modal={false}
            style={{ width: window.innerWidth > 1000 ? '50vw': '90vw' }} 
            onHide={() => setEditVisible(false)}>
 
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
        </div>
    </div>
  )
}

export default Users
