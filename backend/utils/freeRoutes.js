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
  },
  {
    model:"orders",
    action:["create", "read"]
  },
    {
    model:"devices",
    action:["read", "update"]
  }
]

module.exports = { freeRoutes }