import { apiRequest } from "./api"

export async function getMemberDashboard() {
  return apiRequest("/member/dashboard")
}

export async function getAvailableClasses(filters = {}) {
  const params = new URLSearchParams()

  if (filters.sport_id) {
    params.set("sport_id", filters.sport_id)
  }

  if (filters.room_id) {
    params.set("room_id", filters.room_id)
  }

  const query = params.toString()
  return apiRequest(`/member/classes${query ? `?${query}` : ""}`)
}

export async function getClassById(id) {
  return apiRequest(`/member/classes/${id}`)
}

export async function getAvailableSports() {
  return apiRequest("/member/sports")
}

export async function getAvailableRooms() {
  return apiRequest("/member/rooms")
}
