import React from 'react'
import './blocked.css'
import { FaUserLock } from "react-icons/fa"
import { Button } from 'primereact/button'
        

function Blocked() {
    const goHome = () => {
         window.location.reload()
    }
  return (
    <>
    <br /> <br /> 
    <div className="blocked-wrapper">
        <br />
        <div className="blocked-icon"><FaUserLock color="#B0003A" size={50} /></div>
        <h2>Your account has been blocked</h2>
        <p>In order to activate our account we recommend taking the following steps:</p>

        <ol>
            <li><strong>Contact Customer Support</strong>: Reach out to the customer support <strong>0766298542</strong>. They should be able to provide you with specific information about why your account was blocked and guide you through the process of resolving the issue.</li>
            <li><strong>Review Terms of Service</strong>: Read through the terms of service or community guidelines of the platform in question to understand the rules and policies you may have violated. This can help you identify the reason for the block and avoid similar issues in the future.</li>
            <li><strong>Be Patient and Persistent</strong>: Resolving a blocked account issue may take time and patience. Stay in contact with the customer support team, follow their instructions, and ask for updates if necessary. Sometimes the process can be lengthy, but maintaining a respectful and cooperative approach can help in getting your account unblocked.</li>
        </ol>

    <Button label="Go back to home" severity="info" rounded  style={{ margin: 60}} onClick={() => goHome()}/>
    </div>
    <br /> <br /> 
    </>
  )
}

export default Blocked
