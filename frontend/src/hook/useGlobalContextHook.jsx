import {useContext} from 'react'
import {GlobalContexts} from '../context/GlobalContext'

export const useGlobalContextHook = ()=>{
      const globalContexts = useContext(GlobalContexts)
  
      if(!globalContexts){
         throw Error("globalContexts must be used inside the globalcontext provider")
      }
      return globalContexts
}