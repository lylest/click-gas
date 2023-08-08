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
      return res.status(401).json({ message: "Not authorized" })
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, userId) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden, try to login" })
      } else {
        req.userDetails = userId;
        next()
      }
    })
  } catch (err) {
    res.status(401).json({ message: err.message })
  }
}

module.exports = { authenticationMiddleWare }
