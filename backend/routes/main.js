const express = require('express');
const { create } = require('../controllers/create/create')
const { read   } = require('../controllers/read/read')
const { update } = require('../controllers/update/update')
const { remove } = require('../controllers/remove/remove')

async function routerMiddleWare (req, res) {
     try {
       const { action } = req.params
       switch(action) {
          case "create":
                return create(req, res)

          case "read":
                return read(req, res)
            
          case "update":
                return  update(req, res)

          case "remove":
                return remove(req, res)    

          default: return res.status(404).json({ message :'No Matching Route Found'})    
       }
     }  catch(err) {
        return res.status(500).json({ message: err.message })
     }  
}

module.exports = { routerMiddleWare }