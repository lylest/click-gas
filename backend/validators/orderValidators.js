const { string, object } = require("yup")

const orderValidators = object({
    serialNumber:string().required()
})

module.exports = { orderValidators }