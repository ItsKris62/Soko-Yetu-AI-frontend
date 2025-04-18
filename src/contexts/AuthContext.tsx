'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { apiFetch } from '@/lib/api'
import { refreshToken } from '@/lib/auth'

interface User {
  id: string
  firstName: string
  lastName: string
  role: 'farmer' | 'buyer' | 'admin'
  county_id: number
  sub_county_id: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const login = async (jwt: string) => {
    localStorage.setItem('auth_token', jwt)
    setToken(jwt)
    await fetchUser(jwt)
  }

  const fetchUser = async (jwt: string) => {
    try {
      const userData = await apiFetch<User>('/auth/me', {}, jwt)
      setUser(userData)
    } catch {
      // Try refreshing token
      const newToken = await refreshToken()
      if (newToken) {
        setToken(newToken)
        fetchUser(newToken)
      } else {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const existingToken = localStorage.getItem('auth_token')
    if (existingToken) {
      setToken(existingToken)
      fetchUser(existingToken)
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
