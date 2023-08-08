const mongoose = require("mongoose")
const { generatePermissions } = require("../utils/generatePermissions")

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    accountStatus: {
      type: String,
      required: false,
      default:"active"
    },
    email: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: false,
      default: null
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    roleId: {
      type: Number,
      required: false,
      default:1
    },
    idType:{
      type: String,
      required: true //nida, voting, driving-lincence, other
    },
    idNumber:{
      type: String,
      required: true,
    },
    permissions: {
      type:Array,
      default:generatePermissions(),
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    tmpPassword:{
      type: String,
      required:false,
      default:null
    },
    photoURL: {
      type: String,
      default: "https://picsum.photos/seed/picsum/200/200",
    },
    userStatus:{
      type: String,
      default:"active"
    }
  },
  { timestamps: true }
)

const Users = mongoose.model("users", userSchema)

module.exports = {
  Users
}
