const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH !== "false"

const DEMO_USERS = {
  "admin1@demo.cl": {
    password: "123456",
    id: 5,
    full_name: "Demo Admin 1",
    role: "admin",
  },
  "coach1@demo.cl": {
    password: "123456",
    id: 3,
    full_name: "Demo Coach 1",
    role: "coach",
  },
  "user1@demo.cl": {
    password: "123456",
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

const REGISTERED_USERS_KEY = "registeredUsers"

function getRegisteredUsersStore() {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsersStore()
  users.push(user)
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

function mockRegister({ full_name, email, password }) {
  const existingDemo = DEMO_USERS[email]
  const existingRegistered = getRegisteredUsersStore().some((user) => user.email === email)

  if (existingDemo || existingRegistered) {
    throw new Error("Este correo ya está registrado")
  }

  const newUser = {
    id: Date.now(),
    full_name,
    name: full_name,
    email,
    password,
    role: "user",
    photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
    company: "SportClub",
    phone: "—",
  }

  saveRegisteredUser(newUser)

  return {
    ok: true,
    message: "Registro exitoso.",
    data: {
      token: `mock-token-user-${newUser.id}`,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  }
}

export async function registerUser(userData) {
  if (USE_MOCK) {
    return mockRegister(userData)
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Error al registrarse")
  }

  return data
}

export async function loginUser(credentials) {
  if (USE_MOCK) {
    const registeredUser = getRegisteredUsersStore().find(
      (user) => user.email === credentials.email && user.password === credentials.password,
    )

    if (registeredUser) {
      return {
        ok: true,
        message: "Login exitoso.",
        data: {
          token: `mock-token-user-${registeredUser.id}`,
          user: {
            id: registeredUser.id,
            full_name: registeredUser.full_name,
            name: registeredUser.full_name,
            email: registeredUser.email,
            role: registeredUser.role,
          },
        },
      }
    }

    return mockLogin(credentials)
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Error al iniciar sesión")
  }

  return data
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
