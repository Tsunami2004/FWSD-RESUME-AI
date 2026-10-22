import { useContext } from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, register, logout } from "../services/auth.api.js"

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    // throws on failure so the calling component can show the real error message
    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (!data?.user) throw new Error(data?.message || "Login failed")
            setUser(data.user)
            return data
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Login failed"
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    // throws on failure so the calling component can show the real error message
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (!data?.user) throw new Error(data?.message || "Registration failed")
            setUser(data.user)
            return data
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Registration failed"
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout failed:", err)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleLogin, handleRegister, handleLogout }
}
