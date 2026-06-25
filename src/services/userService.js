const API_URL = "https://fake-json-api.mock.beeceptor.com/users/"
const REGISTERED_USERS_KEY = "registeredUsers"

function getRegisteredUsersStore() {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveRegisteredUsersStore(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

export async function getUsers() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("No se pudo obtener la información")
  }

  return response.json()
}

export function getRegisteredUsers() {
  return getRegisteredUsersStore().map((user) => ({
    id: user.id,
    name: user.full_name || user.name,
    full_name: user.full_name || user.name,
    email: user.email,
    role: user.role || "user",
    company: user.company || "SportClub",
    coachPlan: user.coachPlan || null,
    source: "local",
  }))
}

export function getCoachClients() {
  return getRegisteredUsers().filter((user) => user.role === "user")
}

export function getClientById(id) {
  const user = getRegisteredUsersStore().find(
    (item) => String(item.id) === String(id),
  )

  if (!user || user.role !== "user") {
    return null
  }

  return {
    id: user.id,
    name: user.full_name || user.name,
    full_name: user.full_name || user.name,
    email: user.email,
    role: user.role,
    company: user.company || "SportClub",
    coachPlan: user.coachPlan || null,
  }
}

export function getUserCoachPlan(id, email) {
  const byId = getClientById(id)
  if (byId?.coachPlan) {
    return byId.coachPlan
  }

  if (!email) {
    return null
  }

  const user = getRegisteredUsersStore().find(
    (item) =>
      item.role === "user" &&
      item.email.toLowerCase() === email.toLowerCase(),
  )

  return user?.coachPlan || null
}

export function updateClientPlan(id, plan) {
  const users = getRegisteredUsersStore()
  const index = findRegisteredUserIndex(users, id)

  if (index === -1) {
    throw new Error("Cliente no encontrado")
  }

  if (users[index].role !== "user") {
    throw new Error("Solo puedes asignar plan a usuarios clientes")
  }

  users[index].coachPlan = {
    objectives: plan.objectives?.trim() || "",
    routine: plan.routine?.trim() || "",
    notes: plan.notes?.trim() || "",
    updatedAt: new Date().toISOString(),
  }

  saveRegisteredUsersStore(users)
  return getClientById(id)
}

function normalizeApiUsers(apiResponse) {
  const list = Array.isArray(apiResponse) ? apiResponse : apiResponse?.data || []

  return list.map((user) => ({
    id: user.id,
    name: user.full_name || user.name,
    full_name: user.full_name || user.name,
    email: user.email,
    role: user.role || "user",
    company: user.company?.name || user.company || "—",
    source: "api",
  }))
}

export async function getAllUsers() {
  const [apiResponse, localUsers] = await Promise.all([
    getUsers(),
    Promise.resolve(getRegisteredUsers()),
  ])

  return [...localUsers, ...normalizeApiUsers(apiResponse)]
}

function findRegisteredUserIndex(users, id, email) {
  const byId = users.findIndex((user) => String(user.id) === String(id))
  if (byId !== -1) {
    return byId
  }

  if (!email) {
    return -1
  }

  return users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  )
}

export async function createUser(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error("No se pudo crear el usuario")
  }

  return response.json()
}

export async function updateUser(id, formData) {
  const users = getRegisteredUsersStore()
  const index = findRegisteredUserIndex(users, id)

  if (index !== -1) {
    users[index] = {
      ...users[index],
      full_name: formData.full_name,
      name: formData.full_name,
      email: formData.email,
      role: formData.role || users[index].role,
      ...(formData.password ? { password: formData.password } : {}),
    }
    saveRegisteredUsersStore(users)
    return { ok: true }
  }

  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error("No se pudo actualizar el usuario")
  }

  return response.json()
}

export async function deleteUser(id, email) {
  const users = getRegisteredUsersStore()
  const index = findRegisteredUserIndex(users, id, email)

  if (index !== -1) {
    users.splice(index, 1)
    saveRegisteredUsersStore(users)
    return { ok: true }
  }

  const response = await fetch(`${API_URL}${id}`, { method: "DELETE" })

  if (!response.ok) {
    throw new Error("No se pudo eliminar el usuario")
  }

  return { ok: true }
}
