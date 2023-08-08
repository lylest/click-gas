const { string, object} = require("yup")

const supplierValidators = object({
    fullName:string().required(),
    phoneNumber:string().required().min(9),
    email:string().required().email(),
    location:object().required(),
    idType:string().required(),
    idNumber:string().required(),
    password:string().required(),
    createdBy:string().required(),
    address:string().required()
})

module.exports = { supplierValidators }