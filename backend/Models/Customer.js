const mongoose = require("mongoose")
const Schema = mongoose.Schema

const customerSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true    
    },
    address:{
        type: String,
        required: true
    },
    device:{
        type:Schema.Types.ObjectId,
        ref:"devices",
        required: true,
        unique: true
    },
    supplier:{
        type:Schema.Types.ObjectId,
        ref:"suppliers",
        required: true
    },
    createdBy:{
        type:String,    
        required: true
    },
    customerStatus:{
        type:String,
        required: true,
        default: "active", //deleted, blocked, flagged
    }
}, { timestamps: true })

const Customer = mongoose.model("customers", customerSchema)
module.exports = { Customer }