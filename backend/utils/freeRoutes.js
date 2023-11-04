const freeRoutes = [
   {
     model:"users",
     action:["create","read"]
   },
   {
    model:"suppliers",
    action:["read"]
   },
  {
    model:"usages",
    action:["create"]
   }
]

module.exports = { freeRoutes }