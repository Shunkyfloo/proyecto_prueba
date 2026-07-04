import { API_URL, apiRequest } from "./api"

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === "true"

const DEMO_USERS = {
  "admin1@demo.cl": {
    password: "12345678",
    id: 5,
    full_name: "Demo Admin 1",
    role: "admin",
  },
  "coach1@demo.cl": {
    password: "12345678",
    id: 3,
    full_name: "Demo Coach 1",
    role: "coach",
  },
  "user1@demo.cl": {
    password: "12345678",
    id: 1,
    full_name: "Demo User 1",
    role: "user",
  },
}

function mockLogin({ email, password }) {
  const demoUser = DEMO_USERS[email]

  if (!demoUser || demoUser.password !== password) {
    throw new Error("Credenciales inválidas")
  }

  return {
    ok: true,
    message: "Login exitoso.",
    data: {
      token: `mock-token-${demoUser.role}-${demoUser.id}`,
      user: {
        id: demoUser.id,
        full_name: demoUser.full_name,
        name: demoUser.full_name,
        email,
        role: demoUser.role,
      },
    },
  }
}

export async function registerUser(userData) {
  if (USE_MOCK) {
    return mockLogin(userData)
  }

  await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })

  return loginUser({ email: userData.email, password: userData.password })
}

export async function loginUser(credentials) {
  if (USE_MOCK) {
    return mockLogin(credentials)
  }

  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function saveSession(token, user) {
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}

export function getToken() {
  return localStorage.getItem("token")
}

export function getUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export async function getMe() {
  if (USE_MOCK) {
    const user = getUser()
    if (!user) {
      throw new Error("No autenticado")
    }
    return { ok: true, data: user }
  }

  return apiRequest("/auth/me")
}

export async function updateMe(profileData) {
  if (USE_MOCK) {
    const user = { ...getUser(), ...profileData }
    saveSession(getToken(), user)
    return { ok: true, data: user }
  }

  const response = await apiRequest("/auth/me", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
  saveSession(getToken(), response.data)
  return response
}

export async function changePassword(passwords) {
  if (USE_MOCK) {
    return { ok: true, message: "Contraseña actualizada correctamente." }
  }

  return apiRequest("/auth/me/password", {
    method: "PUT",
    body: JSON.stringify(passwords),
  })
}

export { API_URL }
