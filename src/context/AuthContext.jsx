import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import useLocalStorage, { readStorage } from '../hooks/useLocalStorage'

/**
 * Mock authentication. Accounts live in localStorage only — swap these functions
 * for real API calls when a backend is available.
 */
const AuthContext = createContext(null)

const sessionKey = 'stridevolt:session'

function loadSession() {
  try {
    const s = window.sessionStorage.getItem(sessionKey)
    return s ? JSON.parse(s) : readStorage(sessionKey, null)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)
  const [accounts, setAccounts] = useLocalStorage('stridevolt:accounts', [])
  const [orders, setOrders] = useLocalStorage('stridevolt:orders', [])

  const persist = (u, remember) => {
    try {
      window.localStorage.removeItem(sessionKey)
      window.sessionStorage.removeItem(sessionKey)
      if (u) (remember ? window.localStorage : window.sessionStorage).setItem(sessionKey, JSON.stringify(u))
    } catch {
      /* ignore */
    }
  }

  const login = useCallback(
    async ({ email, password, remember }) => {
      await new Promise((r) => setTimeout(r, 650))
      const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
      if (!account) throw new Error('No account found with that email. Create one to get started.')
      if (account.password !== password) throw new Error('That password doesn’t match. Please try again.')
      const u = { name: account.name, email: account.email, since: account.since }
      setUser(u)
      persist(u, remember)
      return u
    },
    [accounts],
  )

  const signup = useCallback(
    async ({ name, email, password }) => {
      await new Promise((r) => setTimeout(r, 750))
      if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists. Try logging in.')
      }
      const account = { name, email, password, since: new Date().toISOString() }
      setAccounts((prev) => [...prev, account])
      const u = { name, email, since: account.since }
      setUser(u)
      persist(u, true)
      return u
    },
    [accounts, setAccounts],
  )

  const logout = useCallback(() => {
    setUser(null)
    persist(null)
  }, [])

  const addOrder = useCallback((order) => setOrders((prev) => [order, ...prev]), [setOrders])

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      logout,
      orders: user ? orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase()) : [],
      addOrder,
    }),
    [user, login, signup, logout, orders, addOrder],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
