const freeRoutes = [
   {
     model:"users",
     action:["create","read"]
   },
   {
    model:"suppliers",
    action:["read"]
   }
]

module.exports = { freeRoutes }