const { modelsList  } = require("./modelsList")

function generatePermissions () {
    try {
        let permissions = [] 
         modelsList.map((model, index) => {
             permissions.push({
                 id:index,
                 name:model,
                 list:['create', 'read', 'update', 'remove'] 
             })
        })
        return permissions 
    } catch (err) {
        console.log(err)
    }
}

function generateSupplierPermissions () {
    try {
        let permissions = [] 
         modelsList.map((model, index) => {
             permissions.push({
                 id:index,
                 name:model,
                 list:['create', 'read', 'update', 'remove'] 
             })
        })
        return permissions 
    } catch (err) {
        console.log(err)
    }
}

module.exports = { generatePermissions, generateSupplierPermissions } 