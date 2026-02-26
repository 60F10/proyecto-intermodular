import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()

  // Debugging: log auth state on every render
  console.debug('[RequireAuth] loading=', auth.loading, 'isAuthenticated=', auth.isAuthenticated)

  if (auth.loading) {
    return null
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
