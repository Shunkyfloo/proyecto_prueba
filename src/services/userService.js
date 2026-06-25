import { apiRequest } from "./api"

const COACH_PLANS_KEY = "coachPlans"

function getCoachPlansStore() {
  const stored = localStorage.getItem(COACH_PLANS_KEY)
  return stored ? JSON.parse(stored) : {}
}

function saveCoachPlansStore(plans) {
  localStorage.setItem(COACH_PLANS_KEY, JSON.stringify(plans))
}

export async function getUsers() {
  return apiRequest("/users")
}

export async function getUserById(id) {
  return apiRequest(`/users/${id}`)
}

export async function getAllUsers() {
  const response = await getUsers()
  return response.data || []
}

export async function getCoachClients() {
  const response = await apiRequest("/users?role=user")
  return (response.data || []).map((user) => ({
    id: user.id,
    name: user.full_name,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    company: "SportClub",
    coachPlan: getUserCoachPlan(user.id, user.email),
  }))
}

export async function getClientById(id) {
  try {
    const response = await getUserById(id)
    const user = response.data

    if (!user || user.role !== "user") {
      return null
    }

    return {
      id: user.id,
      name: user.full_name,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      company: "SportClub",
      coachPlan: getUserCoachPlan(user.id, user.email),
    }
  } catch {
    return null
  }
}

export function getUserCoachPlan(id, email) {
  const plans = getCoachPlansStore()
  const byId = plans[String(id)]

  if (byId) {
    return byId
  }

  if (!email) {
    return null
  }

  const entry = Object.entries(plans).find(([, plan]) => plan.email === email)
  return entry ? entry[1] : null
}

export function updateClientPlan(id, plan, email) {
  const plans = getCoachPlansStore()

  plans[String(id)] = {
    email,
    objectives: plan.objectives?.trim() || "",
    routine: plan.routine?.trim() || "",
    notes: plan.notes?.trim() || "",
    updatedAt: new Date().toISOString(),
  }

  saveCoachPlansStore(plans)

  return {
    id,
    coachPlan: plans[String(id)],
  }
}

export async function createUser(formData) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(formData),
  })
}

export async function updateUser(id, formData) {
  const payload = { ...formData }
  if (!payload.password) {
    delete payload.password
  }

  return apiRequest(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: "DELETE",
  })
}
