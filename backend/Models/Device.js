const mongoose = require("mongoose")
const Schema = mongoose.Schema

const deviceSchema = new Schema({
    customer:{
        type: Schema.Types.ObjectId,
        ref:"customers",
        default:null,
    },
    dateAllocated:{
        type: Date,
        required:false,
        default:null
    },
    serialNumber:{
        type: String,
        required: true
    },
    batteryPercentage:{
        type: Number,
        required: true,
        default:0
    },
    batteryCondition:{
        type:String,
        required: true,
        default:"good" //good, moderate, bad
    },
    deviceStatus:{
        type: String,
        require: true,
        default:"no-signal", //online,offline,no-signal
    },
    activation:{
        type: String,
        require: true,
        default:"not-activated", //activated
    },
    passcode:{
        type: String,
        required: true
    },
    gasLevel:{
        type: Number,
        required: true,
        default:0
    },
    estTimeRemain:{
        type: Number, 
        required: true,
        default:0
    },
    location:{
        type:Object,
        required:true
    },
    address:{
        type: String,
        required: true,
        default:null
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    supplier:{
        type: Schema.Types.ObjectId,
        ref:"suppliers",
        required:null
    },
    productName:{
        type: String,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    buyingPrice:{
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number,
        required: true
    }
},{ timestamps: true })

const Device = mongoose.model("devices", deviceSchema)
module.exports = { Device }