import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/use.auth"

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { loading, user, handleRegister } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true })
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    const data = await handleRegister({ username, email, password })
    setSubmitting(false)
    if (!data) {
      setError("Registration failed. Username or email may already be taken.")
    }
    // navigation handled by useEffect above when user state updates
  }

  return (
    <main>
      <div className="form-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text" id="username" name="username" placeholder='Enter Username' />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email" id="email" name="email" placeholder='Enter Email address' />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password" id="password" name="password" placeholder='Enter Password' />
          </div>

          {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', margin: '0.25rem 0' }}>{error}</p>}

          <button className='button primary-button' disabled={submitting || loading}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register