import { apiRequest } from "./api"

export async function getSports() {
  return apiRequest("/sports")
}

export async function getSportById(id) {
  return apiRequest(`/sports/${id}`)
}

export async function createSport(sportData) {
  return apiRequest("/sports", {
    method: "POST",
    body: JSON.stringify(sportData),
  })
}

export async function updateSport(id, sportData) {
  return apiRequest(`/sports/${id}`, {
    method: "PUT",
    body: JSON.stringify(sportData),
  })
}

export async function deleteSport(id) {
  return apiRequest(`/sports/${id}`, {
    method: "DELETE",
  })
}

export async function updateSportStatus(id, status) {
  return apiRequest(`/sports/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
