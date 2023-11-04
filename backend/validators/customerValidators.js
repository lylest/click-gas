const { string, object } = require("yup")

const customerValidators = object({
    fullName:string().required(),
    phoneNumber:string().required().min(10),
    email:string().required().email(),
    supplier:string().required(),
    address:string().required(),
    device:string().required(),
    createdBy:string().required(),
    physicalAddress:string().required()
})

module.exports = { customerValidators }