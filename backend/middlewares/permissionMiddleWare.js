const { freeRoutes } = require("../utils/freeRoutes")
const { Users } = require("../Models/User");
const { Supplier } = require("../Models/Supplier")

async function permissionMiddleWare(req, res, next) {
  try {
    const { model,action } = req.params;
    const isModelExist = freeRoutes.some(route => route.model === model)
    const isActionExist = freeRoutes.some(route => route.action.includes(action))
    if(isModelExist && isActionExist) {
         next()
    } else {
      checkForPermission(req, res, next)
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function checkForPermission(req, res, next) {
  try {
    const { userId } = req.userDetails
    const { action, model } = req.params
    const isModelExist = await Users.findOne({
      _id: userId,
      "permissions.name": model,
    });

    if (isModelExist === null) {
      const isSupplierModelExist = await Supplier.findOne({
        _id: userId,
        "permissions.name": model,
      });

      if(isSupplierModelExist === null) {
        return res
        .status(404)
        .json({ message: "Unsufficient Permission to access the resource" })
      }

      if(isSupplierModelExist) {
        const hasPermission = isSupplierModelExist.permissions.map((permission) => {
          if (permission.name === model) {
            if (permission.list.includes(action)) {
              return next();
            } else {
              return res.status(401).json({
                message:
                  "You do not have permission to access this resource" + action,
              });
            }
          }
        });
      }
    }

    if (isModelExist) {
      const hasPermission = isModelExist.permissions.map((permission) => {
        if (permission.name === model) {
          if (permission.list.includes(action)) {
            return next();
          } else {
            return res.status(401).json({
              message:
                "You do not have permission to access this resource" + action,
            });
          }
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message, data: err })
  }
}
module.exports = { permissionMiddleWare }
