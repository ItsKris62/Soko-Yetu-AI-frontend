import { useAuthContext } from '@/context/AuthContext'

export function useAuth() {
  const { user, token, login, logout, loading } = useAuthContext()

  return {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    loading,
  }
}
