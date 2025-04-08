const API_BASE_URL = 'http://localhost:8000/api'

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
