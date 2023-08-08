const { string, object, number} = require("yup")

const productValidators = object({
    brand:string().required(),
    weight:number().required(),
    supplier:string().required(),
    cost:number().required()
})

module.exports = { productValidators }