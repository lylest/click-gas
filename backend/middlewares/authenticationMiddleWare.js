const jwt = require("jsonwebtoken");
const { freeRoutes } = require("../utils/freeRoutes");

async function authenticationMiddleWare(req, res, next) {
  try {
    const { model,action } = req.params
    const isModelExist = freeRoutes.some(route => route.model === model)
    const isActionExist = freeRoutes.some(route => route.action.includes(action))
    if(isModelExist && isActionExist) {
         next()
    } else {
        verifyToken(req, res, next)
    }
   
  } catch (err) {
    return res.status(401).json({ message: "Error during authentication" })
  }
}

async function verifyToken(req, res, next) {
  try {
    const cookies = req.cookies;
    const { token } = cookies || undefined
    if (token === undefined) {
          authUsingBearerToken(req, res, next)
    } else {
     
      jwt.verify(token, process.env.SECRET_KEY, (err, userId) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden, try to login" })
      } else {
        req.userDetails = userId;
        next()
      }
    })
    }


  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

async function authUsingBearerToken (req, res, next) {
  try {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'undefined') {
       const token = authHeader.split(' ')[1]

     jwt.verify(token, process.env.SECRET_KEY, (err, userId) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden, try to login" })
      } else {
        req.userDetails = userId
        next()
      }
    })
    } else {
       return res.status(403).json({ message: "Forbidden, try to login" })
    }
  } catch (err) {
     return res.status(401).json({ message: "Failed to authenticate user" })
  }
}

module.exports = { authenticationMiddleWare }
