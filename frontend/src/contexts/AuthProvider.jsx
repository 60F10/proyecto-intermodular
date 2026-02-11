import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch, { getToken, setToken, clearToken } from '../services/api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On mount try to fetch profile if token exists
    const token = getToken()
    if (token) {
      apiFetch('/auth/me')
        .then((u) => setUser(u))
        .catch(() => {
          clearToken()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async ({ email, password }) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data?.accessToken) {
      setToken(data.accessToken)
      const profile = await apiFetch('/auth/me')
      setUser(profile)
      return profile
    }
    throw new Error('No access token returned')
  }

  const register = async ({ email, password, nombre, apellido1, apellido2 }) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        nombre,
        apellido1,
        ...(apellido2 && { apellido2 })
      }),
    })
    return data
  }

  const logout = () => {
    clearToken()
    setUser(null)
    navigate('/login')
  }

  const value = { user, login, register, logout, loading, isAuthenticated: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
