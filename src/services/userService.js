const API_URL = "https://fake-json-api.mock.beeceptor.com/users/"
const REGISTERED_USERS_KEY = "registeredUsers"

export async function getUsers() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("No se pudo obtener la información")
  }

  return response.json()
}

export function getRegisteredUsers() {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY)
  if (!stored) {
    return []
  }

  return JSON.parse(stored).map((user) => ({
    id: user.id,
    name: user.full_name || user.name,
    email: user.email,
    photo: user.photo,
    company: user.company || "SportClub",
    phone: user.phone || "—",
  }))
}