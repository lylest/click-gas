import React from 'react'
import bg from '../../assets/bg.svg'
import { useSignUpHook } from './useSignupHook'
import { Button } from 'primereact/button'
import logo from "../../assets/logo.png"
import { Link} from  "react-router-dom"
import { Password } from 'primereact/password'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
        

function Signup() {
  const { 
    setName,
    setPassword,
    setPhone,
    password,
    setEmail,
    signUp,
    phone,
    navigate,
    isDisabled,
    handleJWTonBackend
  } = useSignUpHook()

  return (
    <div className='auth-wrapper'>
      <div className='auth-left'><img src={bg} loading='lazy' /></div>
       <div className='auth-right'>
          <div className='auth-bar'>
              <div className='auth-logo'>
                <img src={logo} loading='lazy' />
                <h3>Template</h3>
              </div>
          </div>

          <h2>Create Your Account</h2>
        <div className="auth-inputs-wrapper">
          <span className="p-input-icon-left" id="auth-textinput">
              <i className="pi pi-user" />
              <InputText placeholder="Name"  onChange={(e) => setName(e.target.value)}className='short-text-input' />
          </span>

          <span className="p-input-icon-left" id="auth-textinput">
              <InputNumber placeholder="Phone"  
                value={phone} seGrouping={false}
                onValueChange={(e) => setPhone(e.target.value)} className='short-text-input' />
          </span>

          <span className="p-input-icon-left" id="auth-longinput">
              <i className="pi pi-envelope" />
              <InputText placeholder="E-mail"  onChange={(e) => setEmail(e.target.value)} style={{ width:'100%'}} />
          </span>

          
          <span className="p-input-icon-left" id="auth-longinput">
              <i className="pi pi-lock" />
              <Password placeholder='Password' value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                promptLabel="Choose a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Strong password" toggleMask/>
          </span>

         
          <Button label="Submit" id="submit-button" 
              disabled={isDisabled} onClick={() => signUp()} />
           <div className="google-button">
         <p><Link to="/login">Already member? Login here</Link></p>
         <br /> <br />
           </div>
          </div>
       </div>
    </div>
  )
}

export default Signup
