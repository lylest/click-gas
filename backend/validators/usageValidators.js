const { string, object, number} = require("yup")

const usageValidators = object({
    serialNumber:string().required(),
    amount:number().required()
})

module.exports = { usageValidators }