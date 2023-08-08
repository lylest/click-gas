const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    supplier:{
        type: Schema.Types.ObjectId,
        ref:"suppliers",
        required: true
    },
    cost:{
        type: Number,
        required: true
    },
    productStatus:{
        type: String,
        required:true,
        default: "active" //deleted, out-of-stock, unavailable
    }
},{ timestamps: true })

const Product = mongoose.model("products", productSchema)
module.exports = { Product }