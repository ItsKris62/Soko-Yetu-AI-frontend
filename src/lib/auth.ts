// Refresh token Function

export async function refreshToken(): Promise<string | null> {
    try {
      const res = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Send cookies
      })
  
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
  
      localStorage.setItem('auth_token', data.accessToken)
      return data.accessToken
    } catch {
      return null
    }
  }
  