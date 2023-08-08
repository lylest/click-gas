const { string, object, number} = require("yup")

const deviceValidators = object({
    serialNumber:string().required(),
    passcode:string().required(),
    location:object().required(),
    createdBy:string().required(),
    supplier:string().required(),
    productName:string().required(),
    weight:number().required(),
    buyingPrice:number().required(),
    sellingPrice:number().required(),
    address:string().required()
})

module.exports = { deviceValidators }