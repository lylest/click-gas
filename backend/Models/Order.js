const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customer:{
        type:Schema.Types.ObjectId,
        ref:"customers",
        required: true
    },
    device:{
        type: Schema.Types.ObjectId,
        ref:"devices",
        required: true
    },
    supplier:{
        type: Schema.Types.ObjectId,
        ref:"suppliers",
        required: true
    },
    orderStatus:{
        type:String,
        required: true,
        default: "new-order" // on-delivered,delivered, deleted, un-delivered
    },
    deliveryAwaitTime:{
        type:Number,
        required: true
    }
},{ timestamps: true })

const Order = mongoose.model("orders", orderSchema)
module.exports = { Order }