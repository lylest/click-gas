const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { 
    generatePermissions, 
    generateSupplierPermissions 
} = require("../utils/generatePermissions")

const supplierSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    address:{
        type:String,
        required: true,
        default:"Add supplier address"
    },
    location:{
        type:Object,
        required: true
    },
    idType:{
        type: String,
        required: true //nida, voting, driving-lincence, other
    },
    idNumber:{
        type: String,
        required: true,
    },
    devices:[{
        type:Schema.Types.ObjectId,
        ref:"devices",
        default:[]
    }],
    customers:[{
        type:Schema.Types.ObjectId,
        ref:"customers",
        default:[]
    }],
    supplierStatus:{
        type: String,
        required: true,
        default: "pending" //active, flagged, deleted, blocked
    },
    password:{
        type: String,
        required: true
    },
    tmpPassword:{
        type: String,
        required:false,
        default:null
    },
    roleId:{
        type: String,
        required:true,
        default: 2
    },
    permissions: {
        type:Array,
        default:generateSupplierPermissions(),
        required: false,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    photoURL: {
        type: String,
        default: "https://picsum.photos/seed/picsum/200/200",
       },
},{ timestamps: true })

supplierSchema.index({ location: "2dsphere" })
const Supplier =  mongoose.model("suppliers", supplierSchema)
module.exports = { Supplier }