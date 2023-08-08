const bcryptjs = require("bcryptjs")
const { File } = require("../../Models/File")
const { Users } = require("../../Models/User")
const { Usage } = require("../../Models/Usage")
const { Order }  = require("../../Models/Order")
const { Device } = require("../../Models/Device")
const { Customer } = require("../../Models/Customer")
const { Supplier } = require("../../Models/Supplier")
const validators = require("../../validators/userValidators")
const { usageValidators } = require("../../validators/usageValidators")
const { orderValidators} = require("../../validators/orderValidators")
const { deviceValidators } = require("../../validators/deviceValidators")
const { productValidators } = require("../../validators/productValidators")
const { supplierValidators } = require("../../validators/supplierValidators")
const { customerValidators } = require("../../validators/customerValidators")


const create = async (req, res) => {
  try {
    const { model } = req.params
    switch (model) {
      case "users":
        return signUp(req, res)

      case "suppliers":
        return addSupplier(req, res)

      case "products":
        return addProduct(req, res)

      case "devices":
        return addDevice(req, res)
        
      case "customers":
        return addCustomer(req, res)

      case "orders":
        return addOrder(req, res)

      case "files":
        return uploadFile(req, res)

      case "usages":
        return addUsage(req, res)

      default:
        return res.status(404).json({ message: "No matching route found" })
    }
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
}


const updateDeviceDetails = async (req, res, deviceId) => {
  try {
    const { amount } = req.body
    const updatedDevice = await Device.findByIdAndUpdate(deviceId, {
          gasLevel:amount
     }, {
      new: true
    })
    if (!updatedDevice) {
      return res.status(404).json({
        message: "Failed to update device details"
      })
    }
    return res.status(201).json({ message: 'Device details updated successfully', data: updatedDevice })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const addUsage = async (req, res) => {
  try {
    const { body } = req
    const { serialNumber, amount } = req.body

    usageValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const deviceDetails = await Device.findOne({ serialNumber: serialNumber, deviceStatus:{ $ne: 'deleted' }})
    if(deviceDetails === null) {
       return res.status(401).json({ message:`Device with serial number  ${serialNumber} could not be found!`})
    }

    if(deviceDetails !== null) {
      const newUsage = new Usage({
        device: deviceDetails._id,
        customer:deviceDetails.customer,  
        amount:amount
      })
      await newUsage.save()
      return updateDeviceDetails(req, res, deviceDetails._id)
      
    }
    
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response, data: error})
  }
}


const uploadFile = async (req, res) => {
  try {
    const { fileUniqueId } = req.query
    const { userId } = req.userDetails
    const file = req.files.myFile
    const path = `assets/files/${fileUniqueId}.${file.name}`
    const error = await file.mv(path)
  
    if(error){ return res.status(404).json({ message:"Failed to upload file" }) } else { 
        const newFile = new File({
          path:`/files/${fileUniqueId}.${file.name}`,
          name:file.name,
          id:fileUniqueId,
          size:file.size,
          createdBy:userId
        })

        await newFile.save()
        return res.status(201).json({ message: "File uploaded", data: newFile })
   }
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response, data: error })
  }
}


const addOrder = async (req, res) => {
  try {
    const { body } = req
    const { serialNumber } = body
    orderValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })
    
    const device = await Device.findOneAndUpdate({ serialNumber: serialNumber, deviceStatus:{ $ne: 'deleted' }},{
      activation:'not-activated'
    },{ new:  true})
    
    if(device){
        const newOrder = new Order({
          customer:device.customer,
          device:device._id,
          supplier:device.supplier,
          deliveryAwaitTime:30,
        })
        
    await newOrder.save()
    return res.status(201).json({ message:"New order added successfully", date: newOrder })

    } else {
      return res.status(401).json({ message: `Device with serial number [ ${serialNumber} ] was not found!`, data: device })
    }
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response, data: error })
  }
}


const addCustomer = async (req, res) => {
  try {
    const { body } = req
    customerValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const newCustomer = new Customer(body)

    await newCustomer.save()

    return res.status(201).json({ message:"New customer added successfully", data: newCustomer })
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response, data: error })
  }
}


const addDevice = async (req, res) => {
  try {
    const { body } = req

    deviceValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const newDevice = new Device(body)

    await newDevice.save()

    return res.status(201).json({ message:"New device added successfully", data: newDevice })
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response, data: error })
  }
}

const addProduct = async (req, res) => {
  try {
    const { body } = req

    productValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const newProduct = new Supplier(body)

    await newProduct.save()

    return res.status(201).json({ message:"New product added successfully", data: newProduct })
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const addSupplier = async (req, res) => {
  try {
    const { body } = req

    supplierValidators.validateSync(body, {
      abortEarly: false,
      stripUnknown: true
    })

    const hashedPassword = await bcryptjs.hash(body.password, 10)
    const newSupplier = new Supplier({
      ...body,
      password: hashedPassword
    })

    await newSupplier.save()

    return res.status(201).json({ message:"New supplier added successfully", data: newSupplier })
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const signUp = async (req, res) => {
  try {
    const { body} = req

    validators.signUpValidator.validateSync(body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const existingUser = await Users.findOne({ email: body.email })

    if (existingUser) {
      return res.status(403).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcryptjs.hash(body.password, 10)

    const newUser = new Users({
      ...body,
      password: hashedPassword
    });

    await newUser.save()

    return res.status(201).json({ message: 'New user added', data: newUser})
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

module.exports = { create }
