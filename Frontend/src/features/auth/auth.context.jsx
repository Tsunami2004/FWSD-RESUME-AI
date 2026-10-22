import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on app load
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) setUser(data.user)
            } catch (err) {
                // not logged in — stay as null
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
