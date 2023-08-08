const fs = require('fs')
const { File } = require("../../Models/File")
const { Sale } = require("../../Models/Sale")
const { Users } = require("../../Models/User")
const { Order }  = require("../../Models/Order")
const { Device } = require("../../Models/Device")
const { Supplier } = require("../../Models/Supplier")
const { Customer } = require("../../Models/Customer")

const remove = async (req, res) => {
  try {
    const { model } = req.params
    switch (model) {
      case "users":
        return removeUserDetails(req, res)

      case "suppliers":
        return removeSupplier(req, res)

      case "devices":
        return removeDevice(req, res)

      case "customers":
        return removeCustomer(req, res)

      case "orders":
        return removeOrder(req, res)

      case "files":
        return removeFile(req, res)

      case "sales":
        return removeSale(req, res)

      default:
        return res.status(404).json({ message: "No Matching Route Found" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}


const removeSale = async(req, res) => {
  const { id } = req.query
  const removeSale = await Sale.findOneAndUpdate({ _id: id },{ 
     saleStatus:"deleted"
     },{ new: true })
  if (removeSale) {
    return res.status(200).json({ message: "Sale deleted successfully" })
  } else {
    return res.status(422).json({ message:"Failed to delete order", data:removeSale })
  }
}

const removeFile = async(req, res) => {
  try {
    const { id } = req.query
    const removedFile = await File.findOneAndUpdate({ _id: id },{ fileStatus:"deleted"})
    .then(file => {
         if(fs.existsSync(`assets/${file.path}`)) {
             fs.unlinkSync(`assets/${file.path}`)
             return res.status(201).json({ message:'File deleted permanetly'})
         }
          else {
            return res.status(403).json({ message: 'File does not exist'})
          }
       })

  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}


const removeOrder = async(req, res) => {
  const { id } = req.query
  const removedOrder = await Order.findOneAndUpdate({ _id: id },{ 
     orderStatus:"deleted"
     },{ new: true })
  if (removedOrder) {
    return res.status(200).json({ message: "Order deleted successfully" })
  } else {
    return res.status(422).json({ message:"Failed to delete order", data:removedOrder })
  }
}


const removeCustomer = async(req, res) => {
  const { id } = req.query
  const removedCustomer = await Customer.findOneAndUpdate({ _id: id },{ 
     customerStatus:"deleted"
     },{ new: true })
  if (removedCustomer) {
    return res.status(200).json({ message: "Customer deleted successfully" })
  } else {
    return res.status(422).json({ message:"Failed to delete customer", data: removedCustomer })
  }
}


const removeDevice = async(req, res) => {
  const { id } = req.query
  const removedDevice = await Device.findOneAndUpdate({ _id: id },{ 
     deviceStatus:"deleted"
     },{ new: true })
  if (removedDevice) {
    return res.status(200).json({ message: "Device deleted successfully" })
  } else {
    return res.status(422).json({ message:"Failed to delete device", data: removedDevice })
  }
}


const removeSupplier = async(req, res) => {
  const { id } = req.query
  const removedSupplier = await Supplier.findOneAndUpdate({ _id: id },{ 
     supplierStatus:"deleted"
     },{ new: true })
  if (removedSupplier) {
    return res.status(200).json({ message: "Supplier deleted successfully" })
  } else {
    return res.status(422).json({ message:"Failed to delete supplier", data: removedSupplier })
  }
}


const removeUserDetails = async (req, res) => {
  try {
    const { id } = req.query
    const removedUser = await Users.findOneAndDelete({ _id: id })
    if (removedUser) {
      return res.status(200).json({ message: "User deleted successfully" })
    } else {
      return res.status(422).json({ message: "Failed to delete user" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { remove }
