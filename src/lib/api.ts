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

export async function fetchProductsSSR(filters: Record<string, any>) {
  const params = new URLSearchParams(filters).toString()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured?${params}`, {
    next: {
      revalidate: 60, // 60s cache
    },
  })
  return await res.json()
}
