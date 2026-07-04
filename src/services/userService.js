import { apiRequest } from "./api"

export async function getUsers() {
  return apiRequest("/users")
}

export async function getUserById(id) {
  return apiRequest(`/users/${id}`)
}

export async function getCoaches() {
  const response = await apiRequest("/users?role=coach")
  return response.data || []
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
