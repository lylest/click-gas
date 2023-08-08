import { useEffect, useState  } from "react"
import sagaGreen  from '../../theme-md-saga-green.scss'

export const useSiderHook =() => {
  const [checked, setChecked] = useState(false)
  const [ selectedThemeModule, setSelectedThemeModule] = useState(sagaGreen)
 
    const toggleTheme = async() =>{
        try {
          const currentTheme  = await localStorage.getItem('theme')
          if(currentTheme === 'light') {

            document.body.classList.add('dark-theme')
            document.body.classList.remove('light-theme')
            localStorage.setItem('theme','dark')
            setChecked(true)
            changeprimeTheme('theme-md-dark-indigo')
    
          } 
          if(currentTheme === 'dark') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme','light')
            setChecked(false)
            changeprimeTheme('theme-md-saga-green')

          }
          if(currentTheme === null) {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme','light')
            changeprimeTheme('theme-md-saga-green')
            setChecked(false)
          }
         } catch( err) {
          console.log(err)
        }  
      }

      const changeprimeTheme = (theme) => {
        import(`../../${theme}.scss`).then((module) => {
          if (selectedThemeModule) {
            selectedThemeModule.unuse()
          }
          module.use()
          setSelectedThemeModule(module)
        })
      }
 
    return {
        toggleTheme,
        checked
    }
}