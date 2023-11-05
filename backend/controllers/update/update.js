const { Sale } = require("../../Models/Sale")
const { Users } = require("../../Models/User")
const { Order }  = require("../../Models/Order")
const { Device } = require("../../Models/Device")
const { Supplier } = require("../../Models/Supplier")
const { Customer } = require("../../Models/Customer")

const update = async (req, res) => {
  try {
    const { model } = req.params
    switch (model) {
      case "users":
        return updateUserDetails(req, res)

      case "suppliers":
        return updateSupplierDetails(req, res)  

      case "devices":
        return updateDeviceDetails(req, res)  

      case "customers":
        return updateCustomerDetails(req, res) 

      case "orders":
        return updateOrderDetails(req, res) 

      case "sales":
        return updateSaleDetails(req, res)
        
      case "auth":
        return logout(req, res)

      default:
        return res.status(404).json({ message: "No Matching Route Found" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateSaleDetails = async (req, res) => {
  try {
    const { id } = req.query
    const { body } = req

    const updatedSale = await Sale.findByIdAndUpdate(id, body, {
      new: true
    })
    if (!updatedSale) {
      return res.status(404).json({
        message: "Failed to update sale details"
      })
    }
    return res.status(200).json({ message: 'Sale details updated successfully', data: updatedSale })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const updateOrderDetails = async (req, res) => {
  try {
    const { id } = req.query
    const { body } = req

    const updatedOrder = await Order.findByIdAndUpdate(id, body, {
      new: true
    })
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Failed to update order details"
      })
    }
    return res.status(200).json({ message: 'Order details updated successfully', data: updatedOrder })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}


const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.query
    const { body } = req

    const updatedCustomer = await Customer.findByIdAndUpdate(id, body, {
      new: true
    })
    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Failed to update customer details"
      })
    }
    return res.status(200).json({ message: 'Customer details updated successfully', data: updatedCustomer})
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}


const createSale = async (req, res, device) => {
  try {
    const { body} = req
    const commisionPercentage =  10 //should be from collection not fixed
    const commission = ( device.sellingPrice * commisionPercentage) / 100
    const newSale = new Sale({
      device:device._id,
      customer:device.customer,
      supplier:device.supplier,
      buyingPrice:device.buyingPrice,
      sellingPrice:device.sellingPrice,
      commission:commission,
      netSale:device.sellingPrice - commission, //deducting permision
      paidCommission:0,
      remainedCommission:commission
    })

    await newSale.save()

    //return res.status(201).json({ message: 'New sale added', data: newSale })
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const activateDevice = async (req, res) => {
  try {
    const { id  } = req.query
    const { body } = req
    const updatedDevice = await Device.findOneAndUpdate({$and:[
      { passcode: body.activationCode },
      { _id:  id }
    ]}, { activation:'activated'}, { new: true })

    if (!updatedDevice) {
      return res.status(404).json({
        message: "Failed to update activate device",
        data:updatedDevice
      })
    }
    
     createSale(req, res, updatedDevice)
    return res.status(200).json({ message: 'Device activated successfully', data: updatedDevice})
    
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}


const updateDeviceBySerial = async (req, res) => {
  try {
    const { serial } = req.query
    const { body } = req

    const updatedDevice = await Device.findOneAndUpdate({ serialNumber: serial }, body, {
      new: true
    })
    if (!updatedDevice) {
      return res.status(404).json({
        message: "Failed to update device details"
      })
    }
    return res.status(200).json({ message: 'device details updated successfully', data: updatedDevice})
    
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const updateDeviceDetails = async (req, res) => {
  try {
    const { id, activation, serial } = req.query
    const { body } = req
   
    if(activation) { activateDevice(req, res) } 
    else if(serial ) { updateDeviceBySerial(req, res)}
    else {
    const updatedDevice = await Device.findByIdAndUpdate(id, body, {
      new: true
    })
    if (!updatedDevice) {
      return res.status(404).json({
        message: "Failed to update device details"
      })
    }
    return res.status(200).json({ message: 'device details updated successfully', data: updatedDevice})
    }
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}


const updateSupplierDetails = async (req, res) => {
  try {
    const { id } = req.query
    const { body } = req

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, body, { password: 0, permissions:0}, {
      new: true
    })
    if (!updatedSupplier) {
      return res.status(404).json({
        message: "Failed to update supplier details"
      })
    }
    return res.status(200).json({ message: 'Supplier details updated successfully', data: updatedSupplier})
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const { body } = req;

    const updatedUser = await Users.findByIdAndUpdate(id, body, {
      new: true,
    })
    if (!updatedUser) {
      return res.status(404).json({
        message: "Failed to update user detais",
      })
    }
    return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

const logout = async (req, res) => {
  try {
   res.cookie("token", "",{ maxAge: 1, httpOnly: true })
   return res.status(200).json({ message: 'Goodbye' })
  } catch(err) {
     return res.status(200).json({ message: err.message })
  }
}

module.exports = { update }
