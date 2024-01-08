import React from 'react'
import Login from '../pages/login/Login'
import Signup from '../pages/signup/Signup'
import NotFound from '../components/notfound/NotFound'
import SupplierLogin from '../pages/supplierlogin/SupplierLogin'
import { Routes, Route } from 'react-router-dom'


function UserNav({ screen }) {
  return (
    <Routes>
        <Route path="*"  element={<NotFound />} />
        <Route path="/"  element={<Login /> } />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/supplier-login"  element={<SupplierLogin />} />
    </Routes>
  )
}

export default UserNav