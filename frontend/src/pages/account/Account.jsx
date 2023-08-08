import './account.css'
import React from 'react'
import format from 'date-fns/format'
import Empty from '../../components/empty/Empty'
import Loader from "../../components/loader/Loader"
import Sider from '../../components/sider/Sider'
import Topnav from '../../components/topbar/Topnav'
import MenuIcon from '../../components/menuitem/MenuIcon'
import { Dialog } from 'primereact/dialog'
import { InputText } from "primereact/inputtext"
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { HiAtSymbol } from "react-icons/hi"
import { RiAdminLine } from "react-icons/ri"
import { AiOutlineIdcard } from "react-icons/ai"
import { useAccountHook } from './useAccountHook'
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"
import { BiCalendar, BiPhone } from 'react-icons/bi'


function Account() {
    const { isEnglish } = useGlobalContextHook()
    const { 
      account, 
      localPermissions, 
      logout,
      open, 
      setOpen,
      fullName,
      email,
      saveUser,
      idTypes,
      phone,
      idNumber,
      setPhone,
      setEmail,
      setIdnumber,
      setFullName,
      selectedIdType, 
      setSelectedIdType,
     } = useAccountHook()

    const footerContent = (
      <div>
          <Button label={isEnglish ? "Cancel" : "Hairisha"} icon="pi pi-times" onClick={() => setOpen(false)} className="p-button-text" />
          <Button label={isEnglish ? "Activate": "Huisha"} icon="pi pi-check" onClick={() => saveUser()} autoFocus />
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
             <h3 style={{ padding: '25px 15px 15px 20px' }}>{ isEnglish ? "Account": 'Akaunti'}</h3>
            </div>
            { account === null ? <Loader /> : account === 'not-found' ? <Empty label={isEnglish ? "Account not found" : "Akaunti haipo"} Icon={RiAdminLine} /> : 
              <>
                <div className='page-setion-wrapper'>
                  <div className='page-left-section'>
                     <div className='mini-bar'>
                        <div className='min-img'>
                          <img src={account.photoURL} loading='lazy' />
                          </div>
                          <div style={{ marginTop: 10 }}><h3>{account.username}</h3><p>{account.email}</p> </div>
                          <div className='mini-far'>
                          <Button icon="pi pi-pencil" onClick={()=> setOpen(true)} rounded text severity="help" aria-label="Favorite" />
                          </div>
                     </div>
                     <MenuIcon 
                      title={isEnglish ? "Phone": "Simu"}
                      rightTitle={account.phoneNumber}
                      Icon={BiPhone} />

                    <MenuIcon 
                      title={isEnglish ? "Email": "Barua pepe"}
                      rightTitle={account.email}
                      Icon={HiAtSymbol} />

                    <MenuIcon 
                      title={isEnglish ? "ID Type": "Aina ya Kitambulisho"}
                      rightTitle={account.idType}
                      Icon={AiOutlineIdcard} />

                    <MenuIcon 
                      title={isEnglish ? "ID Number": "Namba ya Kitambulisho"}
                      rightTitle={account.idNumber}
                      Icon={AiOutlineIdcard} />
                      
                    <MenuIcon 
                      title={isEnglish ? "Created at": "Tarehe ya usajili"}
                      rightTitle={format(new Date(account.createdAt), "Pp")}
                      Icon={BiCalendar} />

               <div className="card flex justify-content-left" style={{ margin: 30 }}>
                  <Button label="Logout" onClick={() => logout()} />
                  <br />
                </div>
                     </div>

                   <div className='page-right-section'>
                    <h3>Permissions</h3>
                      { localPermissions.length > 0 ? 
                         localPermissions.map(permission => (
                          <div className='permission-wrapper' key={permission.name}>
                          <div className='edit-permission'>
                              <h4>{permission.name.charAt(0).toUpperCase() + permission.name.slice(1)}</h4>
                              <div className='edit-far-btn'>
                              </div>
                            </div>
                           {
                         permission.list.length > 0 ? permission.list.map(item => (
                          <div className="permission-bar">
                           <p>{item.toUpperCase()}</p>
                           <div className='switch-far'>
                               <div className="card flex justify-content-center">
                                <Button 
                                   onClick={()=> {}}
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
                    </div>
                </div>

           <Dialog header={isEnglish ? `Edit details` :"Hariri Taarifa"}  visible={open} modal={false}
             style={{ width: window.innerWidth > 1000 ? '40vw': '90vw' }}  footer={footerContent} onHide={() => setOpen(false)}>
                   
           <span className="p-input-icon-left"> <i className="pi pi-user" />
                <InputText value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isEnglish ? "Full name": "Jina kamili"} />
              </span>

            <span className="p-input-icon-left" style={{ margin: 10 }}> <i className="pi pi-at" />
                <InputText  value={email} onChange={(e) => setEmail(e.target.value)} placeholder={isEnglish ? "E-mail" : "Barua pepe"} />
                     </span>

            <span className="p-input-icon-left"><i className="pi pi-phone" />
                <InputText value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={isEnglish? "Phone": "Simu"} />
                  </span>

            <Dropdown value={selectedIdType} onChange={(e) => setSelectedIdType(e.value)} options={idTypes} optionLabel="name" 
              editable placeholder={isEnglish ? "Select ID Type": "Aina ya kitambulisho"} style={{ margin: 10 }} />
                    
                    <br />
            <span className="p-input-icon-left" style={{ marginTop: 10 }}> <i className="pi pi-id-card" />
               <InputText  value={idNumber} onChange={(e) => setIdnumber(e.target.value)} placeholder={isEnglish ? "ID number": "Namba ya Kitambulisho"} />
                 </span>
        </Dialog> 
              </>
              }
         </div>
       </div>
      </div>
    </div>      
  )
}

export default Account
