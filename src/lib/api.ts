import axios from 'axios'

// Axios instance for client-side forms, with cookies (auth/session)
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

// Set a base URL for SSR or edge requests using native fetch.
// The NEXT_PUBLIC_API_URL environment variable can override this value.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Make a request to the API.
 *
 * @param {string} endpoint The API endpoint to hit, without the leading '/api'.
 * @param {RequestInit} [options] Options to pass to the fetch function.
 * @param {string} [authToken] An optional auth token to include in the Authorization header.
 * @returns {Promise<T>} A promise that resolves to the parsed JSON response.
 * @throws {Error} If the response was not OK, with a message from the API.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${endpoint}`, {
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

// SSR Optimized Featured Product Fetch
export async function fetchProductsSSR(filters: Record<string, unknown> = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).map(([key, value]) => [key, String(value)])
  ).toString();
  const res = await fetch(`${API_BASE_URL}/api/products/featured?${params}`, {
    next: { revalidate: 60 },
  });
  return await res.json()
}
