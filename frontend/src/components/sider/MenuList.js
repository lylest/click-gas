import { BiUser,BiGroup } from "react-icons/bi"
import { TbUsersGroup } from "react-icons/tb"
import { RiAdminLine } from "react-icons/ri"
import { LiaFileInvoiceDollarSolid,LiaUsersCogSolid } from "react-icons/lia"
import { BsShop, BsCpu, BsCartCheck, BsGrid } from "react-icons/bs"
import { useGlobalContextHook } from "../../hook/useGlobalContextHook"

export const useMenuList =() => {
    const { isEnglish } = useGlobalContextHook()
    const menulist = {
        user:{
            role:'user',
            role_id: 2,
            menu:[
                {
                    name:isEnglish ? 'Dashboard': 'Dashibodi',
                    path:'/',
                    icon:BsGrid
                },
                {
                    name:isEnglish ? 'Customers': 'Wateja',
                    path:'/customers',
                    icon:BiGroup
                },
                {
                    name:isEnglish ? 'Devices': 'Vifaa',
                    path:'/devices',
                    icon:BsCpu
                },
                {
                    name:'space',
                    path:"/",
                    icon:null
                },
                {
                    name:isEnglish ?'Orders': 'Oda',
                    path:'/orders',
                    icon:BsCartCheck
                },
                {
                    name:isEnglish ? 'Sales': 'Mauzo',
                    path:'/sales',
                    icon:LiaFileInvoiceDollarSolid
                },
                {
                    name:isEnglish ? 'Account': 'Akaunti',
                    path:'/account',
                    icon:RiAdminLine
                },
                
            ]
        },
        admin:{
            role:"admin",
            role_id: 1,
            menu:[
                {
                    name:isEnglish ? 'Dashboard': 'Dashibodi',
                    path:'/',
                    icon:BsGrid
                },
                {
                    name:isEnglish ? 'Suppliers': 'Wasambazaji',
                    path:'/suppliers',
                    icon:BsShop
                },
                {
                    name:isEnglish ? 'Customers': 'Wateja',
                    path:'/customers',
                    icon:BiGroup
                },
                {
                    name:'space',
                    path:"/",
                    icon:null
                },
                {
                    name:isEnglish ? 'Devices': 'Vifaa',
                    path:'/devices',
                    icon:BsCpu
                },
                {
                    name:isEnglish ?'Orders': 'Oda',
                    path:'/orders',
                    icon:BsCartCheck
                },
                {
                    name:isEnglish ? 'Sales': 'Mauzo',
                    path:'/sales',
                    icon:LiaFileInvoiceDollarSolid
                },
                {
                    name:'space',
                    path:"/",
                    icon:null
                },
                {
                    name:isEnglish ? 'Users': 'Watumiaji',
                    path:'/users',
                    icon:LiaUsersCogSolid
                },
                {
                    name:isEnglish ? 'Account': 'Akaunti',
                    path:'/account',
                    icon:RiAdminLine
                },
            ]
        },
    }

    return {
        menulist
    }
}