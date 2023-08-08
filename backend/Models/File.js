const mongoose = require("mongoose")
const Schema = mongoose.Schema

const fileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    fileStatus:{
        type: String,
        required: true,
        default: "uploaded" //deleted
    }

},{ timestamps: true })

const File = mongoose.model("files", fileSchema)
module.exports = { File }