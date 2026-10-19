import {useContext} from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, register, logout } from "../services/auth.api.js"

export const useAuth = () => {
    const context=useContext(AuthContext)
    const{user,setUser,loading,setLoading} = context


    const handleLogin = async ({email,password}) => {
        setLoading(true)
        try{
            const data = await login({email,password})
            if (!data?.user) {
                throw new Error(data?.message || "Login failed")
            }
            setUser(data.user)
            return data
        }catch(err){
            console.error("Login failed:", err)
            return null
        }finally{
            setLoading(false)
        }
    }
    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
        const data = await register({username,email,password})
        setUser(data.user)
        return data
        }catch(err){
            console.error("Registration failed:", err)
        }finally{
        setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true)
        try{
            const data=await logout()
            setUser(null)
        }catch(err){
            console.error("Logout failed:", err)
        }finally{
            setLoading(false)
        }
    }

     return { user, loading, handleLogin, handleRegister, handleLogout }

}
