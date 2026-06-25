import { getToken } from "./authService"

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export async function apiRequest(endpoint, options = {}) {
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

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const message =
      data.message ||
      (data.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().join(". ")
        : null) ||
      "Error en la solicitud"
    throw new Error(message)
  }

  return data
}
