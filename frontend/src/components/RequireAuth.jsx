import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.loading) {
    return null
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
