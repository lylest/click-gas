const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const { Sale } = require("../../Models/Sale")
const { File } = require("../../Models/File")
const { Users } = require("../../Models/User")
const { Usage } = require("../../Models/Usage")
const { Order }  = require("../../Models/Order")
const { Device } = require("../../Models/Device")
const { Supplier } = require("../../Models/Supplier")
const { Customer } = require("../../Models/Customer")
const validators = require("../../validators/userValidators")

const read = async (req, res) => {
  try {
    const { model } = req.params;
    switch (model) {
      case "users":
        return login(req, res)

      case "auth":
        return getSpecificUser(req, res)  

      case "suppliers":
        return getSupplier(req, res)

      case "devices":
        return getDevice(req, res)
        
      case "customers":
        return getCustomer(req, res)

      case "orders":
        return getOrders(req, res)

      case "files":
        return getFiles(req, res)

      case "usages":
        return getUsages(req, res)

      case "sales":
        return getSales(req, res)  

      default:
        return res.status(404).json({ message: "No Matching Route Found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const getSupplierSales = async (req, res) => {
  try {
      const { supplierId } = req.query
      const sales = await Sale.aggregate([
        {
          '$match': {
            '$expr': {
              '$and': [
                {
                  '$eq': [
                    '$supplier', {
                      '$toObjectId': supplierId
                    }
                  ]
                }, {
                  '$ne': [
                    '$saleStatus', 'deleted'
                  ]
                }
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'customers', 
            'localField': 'customer', 
            'foreignField': '_id', 
            'as': 'customer'
          }
        }, {
          '$lookup': {
            'from': 'suppliers', 
            'localField': 'supplier', 
            'foreignField': '_id', 
            'as': 'supplier'
          }
        }, {
          '$lookup': {
            'from': 'devices', 
            'localField': 'device', 
            'foreignField': '_id', 
            'as': 'device'
          }
        }, {
          '$unwind': {
            'path': '$customer'
          }
        }, {
          '$unwind': {
            'path': '$supplier'
          }
        }, {
          '$unwind': {
            'path': '$device'
          }
        }, {
          '$unset': 'supplier.permissions'
        }, {
          '$unset': 'supplier.tmpPassword'
        }, {
          '$unset': 'supplier.password'
        }, {
          '$group': {
            '_id': 'all sales', 
            'total': {
              '$sum': '$sellingPrice'
            }, 
            'totalNetSale': {
              '$sum': '$netSale'
            }, 
            'totalCommision': {
              '$sum': '$commission'
            }, 
            'totalPaidCommision': {
              '$sum': '$paidCommission'
            }, 
            'totalRemainedCommision': {
              '$sum': '$remainedCommission'
            }, 
            'sales': {
              '$push': '$$ROOT'
            }
          }
        }
      ])

      if(sales.length >= 0) { return res.status(200).json({ message: "All Supplier sales", data: sales }) } else {
        return res.status(404).json({ message: "Failed to get all supplier sales", data: sales})
     }
  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getSales = async (req, res) => {
  try {
      const { supplierId } = req.query
      if(supplierId) { 
         getSupplierSales(req, res)
      } else {
        const  sales = await  Sale.aggregate([
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$ne': [
                      '$saleStatus', 'deleted'
                    ]
                  }
                ]
              }
            }
          }, {
            '$lookup': {
              'from': 'customers', 
              'localField': 'customer', 
              'foreignField': '_id', 
              'as': 'customer'
            }
          }, {
            '$lookup': {
              'from': 'suppliers', 
              'localField': 'supplier', 
              'foreignField': '_id', 
              'as': 'supplier'
            }
          }, {
            '$lookup': {
              'from': 'devices', 
              'localField': 'device', 
              'foreignField': '_id', 
              'as': 'device'
            }
          }, {
            '$unwind': {
              'path': '$customer'
            }
          }, {
            '$unwind': {
              'path': '$supplier'
            }
          }, {
            '$unwind': {
              'path': '$device'
            }
          }, {
            '$unset': 'supplier.permissions'
          }, {
            '$unset': 'supplier.tmpPassword'
          }, {
            '$unset': 'supplier.password'
          }, {
            '$group': {
              '_id': 'all sales', 
              'total': {
                '$sum': '$sellingPrice'
              }, 
              'totalNetSale': {
                '$sum': '$netSale'
              }, 
              'totalCommision': {
                '$sum': '$commission'
              }, 
              'totalPaidCommision': {
                '$sum': '$paidCommission'
              }, 
              'totalRemainedCommision': {
                '$sum': '$remainedCommission'
              }, 
              'sales': {
                '$push': '$$ROOT'
              }
            }
          }
        ])

        if(sales.length >= 0) { return res.status(200).json({ message: "All sales", data: sales }) } else {
           return res.status(401).json({ message: "Failed to get all sales", data: sales})
        }
      }


  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getDeviceUsages = async (req, res) => {
  try {
      const { id } = req.query
      const { fromDate, toDate }  = req.body

      const usages = await Usage.aggregate([
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$device', {
                    '$toObjectId': id
                  }
                ]
              }
            }
          },
          {
        '$match': {
           '$and':[
              {
               'createdAt': {
               '$gte': new Date(fromDate), 
               '$lte': new Date(toDate)
                }
              }
              //{ 'transactionType': { $in: transactionType } }
           ]
        }
      },
        ])

      if(usages.length >= 0) { return res.status(200).json({ message: 'Usages', data: usages })} else {
        return res.status(404).json({ message: 'No usages found', data:  usages })
      }  


  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getUsages = async (req, res) => {
  try {
      const { id, prediction, usage } = req.query
  
      if(prediction) {
        const prediction = await Usage.aggregate([
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$device', {
                    '$toObjectId': id
                  }
                ]
              }
            }
          }, {
            '$sort': {
              'createdAt': 1
            }
          }, {
            '$group': {
              '_id': null, 
              'firstUsage': {
                '$first': '$$ROOT.amount'
              }, 
              'firstTimestamp': {
                '$first': '$$ROOT.createdAt'
              }, 
              'lastUsage': {
                '$last': '$$ROOT.amount'
              }, 
              'lastTimestamp': {
                '$last': '$$ROOT.createdAt'
              }
            }
          }, {
            '$project': {
              'rateOfUsage': {
                '$divide': [
                  {
                    '$subtract': [
                      '$firstUsage', '$lastUsage'
                    ]
                  }, 2
                ]
              }, 
              'lastUsage': '$lastUsage'
            }
          }, {
            '$project': {
              'predictedDaysToEmpty': {
                '$divide': [
                  '$lastUsage', '$rateOfUsage'
                ]
              }
            }
          }
        ]) 


        
        if(prediction) { return res.status(200).json(prediction) } else {
          return res.status(401).json({ message:"Failed to get prediction", data: prediction})
        }
      } else if (usage) { getDeviceUsages(req, res)}


  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSpecificFile = async (req, res) => {
  try {
    const { id } = req.query
    const file = await File.findOne({ _id: id, fileStatus: "uploaded" })
    if(file) { return res.status(200).json({ message:"File details", data: file })} else {
      return res.status(442).json({ message: 'Failed to find file details', data: file })
    }
  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getFiles = async (req, res) => {
  try {
    const { id } = req.query
    const { userId } = req.userDetails
    if(id) {  getSpecificFile(req, res) } else {
      const files = await File.find({ createdBy:userId, fileStatus:"uploaded" })
      if(files.length>= 0) { return res.status(200).json({ message:"All user files", data: files })} else {
        return res.status(442).json({ message: 'Failed to user files', data: files })
      }
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSupplierOrders = async (req, res) => {
  try {
    const { supplierId } = req.query
    const supplierOrders = await Order.find({ supplier: supplierId, orderStatus:{ $ne: 'deleted' }})
      .populate({ path:"device", model:"devices"})
      .populate({ path:"customer", model:"customers"})
      //.populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})

    if(supplierOrders.length >= 0) { return res.status(200).json({ message:"All Supplier orders", data:supplierOrders })} else {
      return res.status(442).json({ message: 'Failed to find all supplier orders', data: supplierOrders })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSpecificOrder = async (req, res) => {
  try {
    const { id } = req.query
    const orderDetails = await Order.findOne({ _id: id, orderStatus:{ $ne: 'deleted' }})
        .populate({ path:"device", model:"devices"})
        .populate({ path:"customer", model:"customers"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
    if(orderDetails) { return res.status(200).json({ message:"Order details", data:orderDetails })} else {
      return res.status(442).json({ message: 'Failed to find order details', data: orderDetails })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const searchOrder = async (req, res) => {
  try {
    const { search } = req.query
    const { userId, roleId } =  req.userDetails
    
    if(roleId == 1) {
      const orders = await Order.find({ orderStatus:{ $ne: 'deleted' }})
        .populate({ path:"device", model:"devices"})
        .populate({ path:"customer", match:{
          $or:[
            { fullName: {$regex: search, $options: 'i'}
          }
          ]
        }, model:"customers"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(orders.length >= 0 ) { return res.status(200).json({ message:"Order search results", data:orders })} else {
        return res.status(442).json({ message: 'Failed to find order matching the keyword'+ keyword, data: orders })
      }
    }

    if(roleId == 2) {
      const orders = await Order.find({ orderStatus:{$regex: search, $options: 'i'}, customerStatus:{ $ne: 'deleted' }, createdBy: userId })
      .populate({ path:"device", model:"devices"})
      .populate({ path:"customer", model:"customers"})
      .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(orders.length >= 0 ) { return res.status(200).json({ message:"Order search results", data:orders })} else {
        return res.status(442).json({ message: 'Failed to find order matching the keyword'+ keyword, data: orders })
      }
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getOrders = async (req, res) => {
  try {
      const { id, supplierId, search } = req.query
      if(id) {
         getSpecificOrder(req, res)
      } else if (search) {
        searchOrder(req, res)
      }  else if(supplierId) {
         getSupplierOrders(req, res)
      } else {
        const allOrders = await Order.find({ orderStatus:{ $ne: 'deleted' } })
        .populate({ path:"device", model:"devices"})
        .populate({ path:"customer", model:"customers"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
        if(allOrders.length >= 0) { return res.status(200).json({ message:"All Orders", data:allOrders }) } else {
          return res.status(442).json({ message: 'Failed to find all orders', data: allOrders })
        }
    }
  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSupplierCustomers = async (req, res) => {
  try {
    const { supplierId } = req.query
    const supplierCustomers = await Customer.find({ supplier: supplierId, customerStatus:{ $ne: 'deleted' }})
        .populate({ path:"device", model:"devices"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})

    if(supplierCustomers.length >= 0) { return res.status(200).json({ message:"All Supplier customers", data:supplierCustomers })} else {
      return res.status(442).json({ message: 'Failed to find all supplier customers', data: supplierCustomers })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSpecificCustomer = async (req, res) => {
  try {
    const { id } = req.query
    const customerDetails = await Customer.findOne({ _id: id, customerStatus:{ $ne: 'deleted' }})
        .populate({ path:"device", model:"devices"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
    if(customerDetails) { return res.status(200).json({ message:"Customer details", data:customerDetails })} else {
      return res.status(442).json({ message: 'Failed to find customer details', data: customerDetails })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const searchCustomer = async (req, res) => {
  try {
    const { search } = req.query
    const { userId, roleId } =  req.userDetails
    
    if(roleId == 1) {
      const customers = await Customer.find({ fullName:{$regex: search, $options: 'i'}, customerStatus:{ $ne: 'deleted' }})
      .populate({ path:"device", model:"devices"})
      .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(customers.length >= 0 ) { return res.status(200).json({ message:"Customer search results", data:customers })} else {
        return res.status(442).json({ message: 'Failed to find customer matching the keyword'+ keyword, data: customers })
      }
    }

    if(roleId == 2) {
      const customers = await Customer.find({ fullName:{$regex: search, $options: 'i'}, customerStatus:{ $ne: 'deleted' }, createdBy: userId })
      .populate({ path:"device", model:"devices"})
      .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(customers.length >= 0 ) { return res.status(200).json({ message:"Device search results", data:customers })} else {
        return res.status(442).json({ message: 'Failed to find customer matching the keyword'+ keyword, data: customers })
      }
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getCustomer = async (req, res) => {
  try {
      const { id, supplierId, search } = req.query
      if(id) {
         getSpecificCustomer(req, res)
      } else if (supplierId) {
         getSupplierCustomers(req, res)
      } else if (search) { 
        searchCustomer(req, res)
      } else {
        const allCustomers = await Customer.find({ customerStatus:{ $ne: 'deleted' }})
          .populate({ path:"device", model:"devices"})
          .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
        if(allCustomers.length >= 0) { return res.status(200).json({ message:"All Customers", data:allCustomers })} else {
          return res.status(442).json({ message: 'Failed to find all customers', data: allCustomers })
        }
    }
  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getSupplierDevices = async (req, res) => {
  try {
    const { supplierId } = req.query
    const supplierDevices = await Device.find({ supplier: supplierId, deviceStatus:{ $ne: 'deleted' }})
   
    if(supplierDevices.length >= 0) { return res.status(200).json({ message:"All Supplier devices", data:supplierDevices })} else {
      return res.status(442).json({ message: 'Failed to find all supplier devices', data: supplierDevices })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const searchDevice = async (req, res) => {
  try {
    const { search } = req.query
    const { userId, roleId } =  req.userDetails
    
    if(roleId == 1) {
      const devices = await Device.find({ serialNumber:{$regex: search, $options: 'i'}, deviceStatus:{ $ne: 'deleted' }})
      .populate({ path:"customer", model:"customers"})
      .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(devices.length >= 0 ) { return res.status(200).json({ message:"Device search results", data:devices })} else {
        return res.status(442).json({ message: 'Failed to find device matching the keyword'+ keyword, data: devices })
      }
    }

    if(roleId == 2) {
      const devices = await Device.find({ serialNumber:{$regex: search, $options: 'i'}, deviceStatus:{ $ne: 'deleted' }, createdBy: userId })
      .populate({ path:"customer", model:"customers"})
      .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
     
      if(devices.length >= 0 ) { return res.status(200).json({ message:"Device search results", data:devices })} else {
        return res.status(442).json({ message: 'Failed to find device matching the keyword'+ keyword, data: devices })
      }
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getDeviceBySerial = async (req, res) => {
  try {
    const { serial } = req.query
    const deviceDetails = await Device.findOne({ serialNumber: serial, deviceStatus:{ $ne: 'deleted' }})
    .populate({ path:"customer", model:"customers"})
    .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
    if(deviceDetails) { return res.status(200).json({ message:"Device details", data:deviceDetails })} else {
      return res.status(442).json({ message: 'Failed to find device details', data: deviceDetails })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSpecificDevice = async (req, res) => {
  try {
    const { id } = req.query
    const deviceDetails = await Device.findOne({ _id: id, deviceStatus:{ $ne: 'deleted' }})
    .populate({ path:"customer", model:"customers"})
    .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
    if(deviceDetails) { return res.status(200).json({ message:"Device details", data:deviceDetails })} else {
      return res.status(442).json({ message: 'Failed to find device details', data: deviceDetails })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getDevice = async (req, res) => {
  try {
      const { id, supplierId, search, serial } = req.query
      if(id) {
         getSpecificDevice(req, res)
      } else if (supplierId) { getSupplierDevices(req, res)
      } else if (serial) { getDeviceBySerial(req, res)
      } else if (search) { searchDevice(req, res)}
        else {
        const allDevices = await Device.find({ deviceStatus:{ $ne: 'deleted' }})
        .populate({ path:"customer", model:"customers"})
        .populate({ path:"supplier", select:"-password -permissions -customers -devices", model:"suppliers"})
   
        if(allDevices.length >= 0) { return res.status(200).json({ message:"All Devices", data:allDevices })} else {
          return res.status(442).json({ message: 'Failed to find all devices', data: allDevices })
        }
    }
  } catch(error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getUserSuppliers = async (req, res) => {
  try {
    const { createdBy } = req.query
    const userSuppliers = await Supplier.find({ createdBy: createdBy, supplierStatus:{ $ne: 'deleted' }},{
        password:0, permissions: 0
    })

    if(userSuppliers.length >= 0 ) { return res.status(200).json({ message:"All User Suppliers", data:userSuppliers })} else {
      return res.status(442).json({ message: 'Failed to find all user suppliers', data: userSuppliers })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const loginSupplier = async (req, res) => {
  try {
    const { body } = req
    const supplier = await Supplier.findOne({ email: body.email })

    if (!supplier) {
      return res.status(404).json({ message: "Username not found" })
    }

    const check = await bcryptjs.compare(body.password, supplier.password)

    if (!check) {
      return res.status(404).json({ message: "Incorrect password" })
    }

    const maxAge = 2000 * 24 * 60 * 60; // 2 days
    const token = jwt.sign(
      { userId: supplier._id, email: supplier.email, roleId: supplier.roleId },
      process.env.SECRET_KEY,
      { expiresIn: maxAge }
    )
    const { password, ...userData } = supplier.toObject()
    const response = {
      message: "Login successful",
      user: userData,
    }
    res.cookie("token", token, { maxAge: maxAge, httpOnly: true }); // create  cookies to store token
    return res.status(200).json(response);
  } catch (error) {
    let code = error.errors ? 422 : 500;
    let response = error.errors ? error.errors[0] : error.message;
    return res.status(code).json({ message: response });
  }
}


const searchSupplier = async (req, res) => {
  try {
    const { search } = req.query
    const suppliers = await Supplier.find({ $and:[
      { supplierStatus:{ $ne: 'deleted' }},
      { fullName: { $regex: search, $options: "i" }}
    ]},{
        password:0, permissions:0
    })

    if(suppliers.length >= 0) { return res.status(200).json({ message:"Searched Suppliers", data:suppliers })} else {
      return res.status(442).json({ message: 'Failed to find suppliers', data: suppliers })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSpecificSupplier = async (req, res) => {
  try {
    const { id } = req.query
    const supplierDetails = await Supplier.findOne({ _id: id, supplierStatus:{ $ne: 'deleted' }},{
        password:0, 
    })
    //.populate({ path: "owner", select: "-password -roleId -accountStatus -permissions ", model:"users" })

    if(supplierDetails) { return res.status(200).json({ message:"Supplier details", data:supplierDetails })} else {
      return res.status(442).json({ message: 'Failed to find supplier details', data: supplierDetails })
    }

  } catch (error) {
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}


const getSupplier = async (req, res) => {
  try {
      const { id, login, createdBy, search } = req.query
      if(id) {
        getSpecificSupplier(req, res)
      } else if (login) {
        loginSupplier(req, res)
      } else if(createdBy) {
        getUserSuppliers(req, res)
      } else if(search) {
        searchSupplier(req, res)
      }
       else {
        const userSuppliers = await Supplier.find({ supplierStatus:{ $ne: 'deleted' }},{
            password:0, permissions: 0
        })
  
        if(userSuppliers.length >= 0 ) { return res.status(200).json({ message:"All System Suppliers", data:userSuppliers })} else {
          return res.status(442).json({ message: 'Failed to find all system suppliers', data: userSuppliers })
        }
      }
  } catch(error){
    let code = error.errors ? 422 : 500
    let response = error.errors ? error.errors[0] : error.message
    return res.status(code).json({ message: response })
  }
}

const getAllUsers = async(req, res) => {
  try {
    const { roleId } = req.userDetails
    const users = await Users.find({ },{ password: 0, })
    
    if(roleId === 1) {
      if(users.length >= 0 ) { return res.status(200).json({ message: 'All system users', data: users}) } else { 
        return res.status(500).json({ message:'Failed to find all system users ', data: null })
      }
    } else {
      return res.status(401).json({ message:"Not Authorized to list users", data: null })
    }
   } catch(err) {
      return res.status(500).json({ message: err.message })
  }
}

const searchUser = async(req, res) => {
  try {
    const { search } = req.query
    const { roleId } = req.userDetails
  
    if(roleId === 1) {
      const users = await Users.find({ username:{$regex: search, $options: "i"} },{ password: 0 })
      if(users.length >= 0 ) { return res.status(200).json({ message: 'System search results', data: users}) } else { 
        return res.status(500).json({ message:'Failed to search results ', data: null })
      }
    } else {
      return res.status(401).json({ message:"Not Authorized to list users", data: null })
    }
   } catch(err) {
      return res.status(500).json({ message: err.message })
  }
}


const getSpecificUser = async(req, res) => {
  try {
    const  { userId } = req.userDetails
    const  { list, search } = req.query
    if(list) { getAllUsers(req, res) }
    else if (search) { searchUser(req, res) }
    else {
      const userDetails = await Users.findOne({ _id: userId },{ password: 0, _id:1, })
      if(userDetails !== null) { return res.status(200).json({ message: 'Profile details', data: userDetails})} else { 
        return res.status(500).json({ message:'Failed to find user profile ', data: null })
        }
    }

  } catch(err) {
      return res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { body } = req;
    const { id, list } = req.query
    
    if(id) { getSpecificUser(req, res) } 
    else {
      validators.loginValidator.validateSync(body, {
        abortEarly: false,
        stripUnknown: true,
      });
  
      const user = await Users.findOne({ email: body.email });
  
      if (!user) {
        return res.status(404).json({ message: "Username not found" });
      }
  
      const check = await bcryptjs.compare(body.password, user.password);
  
      if (!check) {
        return res.status(404).json({ message: "Incorrect password" });
      }
  
      const maxAge = 2000 * 24 * 60 * 60; // 2 days
      const token = jwt.sign(
        { userId: user._id, email: user.email, roleId: user.roleId },
        process.env.SECRET_KEY,
        { expiresIn: maxAge }
      );
      const { password, ...userData } = user.toObject();
      const response = {
        message: "Login successful",
        user: userData,
      };
      res.cookie("token", token, { maxAge: maxAge, httpOnly: true }); // create  cookies to store token
      return res.status(200).json(response);
    } 
  } catch (error) {
    let code = error.errors ? 422 : 500;
    let response = error.errors ? error.errors[0] : error.message;
    return res.status(code).json({ message: response });
  }
}

module.exports = { read }
