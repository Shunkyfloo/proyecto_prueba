import { getToken } from "./authService"

export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api"

async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch (e) {
    return null
  }
}

export async function apiRequest(endpoint, options = {}) {
  try {
    const token = getToken()

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await parseJsonSafe(response)

    if (!response.ok || (data && data.ok === false)) {
      // Prefer server message if available, otherwise use status text or response body
      const serverMessage = data && (data.message || (data.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().join('. ') : null))
      const fallback = response.statusText || 'Error en la solicitud'
      const message = serverMessage || fallback
      throw new Error(message)
    }

    return data || {}
  } catch (error) {
    console.error('Error API:', error.message)
    throw error
  }
}
