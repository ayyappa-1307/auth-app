import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getStoredToken, setStoredToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getStoredToken()))

  const applySession = useCallback((nextToken, nextUser) => {
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    applySession(null, null)
  }, [applySession])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    api
      .get('/api/user/me')
      .then((res) => {
        if (!cancelled) {
          setUser(res.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          applySession(null, null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token, applySession])

  const login = useCallback(
    async ({ email, password }) => {
      const { data } = await api.post('/api/auth/login', { email, password })
      applySession(data.token, data.user)
      return data
    },
    [applySession],
  )

  const register = useCallback(
    async ({ email, password, fullName }) => {
      const { data } = await api.post('/api/auth/register', { email, password, fullName })
      applySession(data.token, data.user)
      return data
    },
    [applySession],
  )

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [token, user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
