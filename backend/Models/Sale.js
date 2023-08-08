const mongoose = require("mongoose")
const Schema = mongoose.Schema

const saleSchema = new Schema({
    device:{
        type:Schema.Types.ObjectId,
        ref:"devices",
        required: true
    },
    customer:{
        type:Schema.Types.ObjectId,
        ref:"customers",
        required: true
    },
    supplier:{
        type:Schema.Types.ObjectId,
        ref:"suppliers",
        required: true
    },
    buyingPrice:{
        type:Number,
        required: true
    },
    sellingPrice:{
        type:Number,
        required: true
    },
    commission:{
        type:Number,
        required: true
    },
    netSale:{
        type:Number,
        required: true
    },
    paidCommission:{
        type:Number,
        required: true
    },
    remainedCommission:{
        type:Number,
        required: true
    },
    saleStatus:{
        type:String,
        required: true,
        default:"active" //pending, deleted
    }
},{ timestamps: true })


const Sale = mongoose.model("sales", saleSchema)
module.exports = { Sale }