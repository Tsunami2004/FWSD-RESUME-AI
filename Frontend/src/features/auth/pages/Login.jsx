import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router"
import "../auth.form.scss"
import { useAuth } from "../hooks/use.auth.js"

const Login = () => {
    const { loading, user, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Once user is set in context, go to home
    useEffect(() => {
        if (!loading && user) {
            navigate("/", { replace: true })
        }
    }, [user, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await handleLogin({ email, password })
            // navigation is handled by the useEffect above
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <div className="form-container">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name="email"
                            placeholder="Enter Email address" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name="password"
                            placeholder="Enter Password" />
                    </div>

                    {error && (
                        <p style={{ color: '#ff4d4d', fontSize: '0.85rem', margin: '0.25rem 0' }}>
                            {error}
                        </p>
                    )}

                    <button className="button primary-button" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login
