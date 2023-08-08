import React from 'react'
import './login.css'
import './auth.css'
import logo from "../../assets/logo.png"
import bg from '../../assets/bg.svg'
import { InputText } from 'primereact/inputtext'
import { useLoginHook } from './useLoginHook'
import { Button } from 'primereact/button'
import { Link } from  "react-router-dom"
import { Password } from 'primereact/password'

function Login() {
  const { 
    password,
    setUserId,
    setPassword,
    login
  } = useLoginHook()
  return (
    <div className='auth-wrapper'>
      <div className='auth-left'><img src={bg} loading='lazy' /></div>
       <div className='auth-right'>
          <div className='auth-bar'>
              <div className='auth-logo'>
                <img src={logo} loading='lazy' />
                <h3>Click-Gas</h3>
              </div>
          </div>

          <h2>Login to Your Account</h2>
           <div className="auth-inputs-wrapper">

            <span className="p-input-icon-left" id="auth-longinput">
                <i className="pi pi-envelope" />
                <InputText placeholder="E-mail" onChange={(e) => setUserId(e.target.value)} style={{ width:'100%'}} />
            </span>

            <span className="p-input-icon-left" id="auth-longinput">
                <i className="pi pi-lock" />
                <Password placeholder="Password" feedback={false} value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
            </span>

              <Button label="Login" id="submit-button"onClick={() => login()}  />
              <div className="google-button" >

          <p><Link to="/signup">Login as supplier</Link></p>
          <br /> <br />
 </div>
</div>

       </div>
    </div>
  )
}

/**
 *               onSuccess={credentialResponse => {
               handleJWTonBackend(credentialResponse)
              }}
 */
export default Login
