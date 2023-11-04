import React from 'react'
import Home from '../pages/home/Home'
import Login from '../pages/login/Login'
import Users from '../pages/users/Users'
import Sales from '../pages/sales/Sales'
import Orders from '../pages/orders/Orders'
import Account from '../pages/account/Account'
import Devices from '../pages/devices/Devices'
import Suppliers from '../pages/suppliers/Suppliers'
import Customers from '../pages/customers/Customers'
import NotFound from '../components/notfound/NotFound'
import Prediction from '../pages/prediction/Prediction'
import AddSupplier from '../pages/addsupplier/AddSupplier'
import EditSupplier from '../pages/editsupplier/EditSupplier'
import ViewSupplier from '../pages/viewsupplier/ViewSupplier'
import { Routes, Route } from 'react-router-dom'

function UserNav() {
  return (
    <Routes>
        <Route path="*"  element={<NotFound />} />
        <Route path="/"  element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/home"  element={<Home />} />
        <Route path="/users"  element={<Users />} />
        <Route path="/sales"  element={<Sales />} />
        <Route path="/orders"  element={<Orders />} />
        <Route path="/devices"  element={<Devices />} />
        <Route path="/account"  element={<Account />} />
        <Route path="/customers"  element={<Customers />} />
        <Route path="/suppliers"  element={<Suppliers />} />
        <Route path="/prediction/:id"  element={<Prediction />} />
        <Route path="/add-supplier"  element={<AddSupplier />} />
        <Route path="/edit-supplier/:id"  element={<EditSupplier />} />
        <Route path="/view-supplier/:id"  element={<ViewSupplier />} />
    </Routes>
  )
}

export default UserNav