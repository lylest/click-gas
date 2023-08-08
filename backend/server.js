require("dotenv").config();
const cors = require("cors");
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dbConnString = process.env.MONGO_URI
const cookieParser = require("cookie-parser")
const fileupload = require('express-fileupload')
const { routerMiddleWare } = require("./routes/main")
const { permissionMiddleWare } = require("./middlewares/permissionMiddleWare")
const { authenticationMiddleWare } = require("./middlewares/authenticationMiddleWare")

const corsOptions = {
  origin: true,
  credentials: true
}

// middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: "15mb" }))
app.use(cookieParser())
app.use(fileupload())
app.use(express.static("assets"))
app.use(express.urlencoded({ extended: false, limit: "15mb" }))
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use(
  "/:action/:model",
  authenticationMiddleWare,
  permissionMiddleWare,
  routerMiddleWare
)

const options = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const dbConnection = () => {
  try {
    mongoose.connect(dbConnString, options).then(() =>
      app.listen(process.env.PORT, () => {
        console.log("server running on port number", process.env.PORT);
      })
    );
  } catch (error) {
    console.log(error)
  }
}

dbConnection()
