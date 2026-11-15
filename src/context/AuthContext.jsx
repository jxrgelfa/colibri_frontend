import { createContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('colibri_token') || null)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('colibri_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar usuario autenticado si ya hay token
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await api.auth.getMe()
        setUser(userData)
        localStorage.setItem('colibri_user', JSON.stringify(userData))
      } catch (err) {
        console.error('Error al validar sesión existente:', err)
        setToken(null)
        setUser(null)
        localStorage.removeItem('colibri_token')
        localStorage.removeItem('colibri_user')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [token])

  const login = useCallback(async (username, password) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.auth.login(username, password)
      const accessToken = response.access_token

      setToken(accessToken)
      localStorage.setItem('colibri_token', accessToken)

      // Cargar datos del usuario
      const userData = await api.auth.getMe()
      setUser(userData)
      localStorage.setItem('colibri_user', JSON.stringify(userData))

      return { success: true }
    } catch (err) {
      const msg = err.message || 'Error al iniciar sesión'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('colibri_token')
    localStorage.removeItem('colibri_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
