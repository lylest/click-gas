const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usageSchema = new Schema({
    device:{
        type: Schema.Types.ObjectId,
        ref:"devices",
        required: true
    },
    customer:{
        type: Schema.Types.ObjectId,    
        ref:"customers",
        required: true
    },
    amount:{
        type:Number,
        required: true
    },
    usageStatus:{
        type:String,
        required: true,
        default:"active" //deleted, nullified
    }
},{ timestamps: true })

const Usage = mongoose.model("usages", usageSchema)
module.exports = { Usage}