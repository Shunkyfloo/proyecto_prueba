import { apiRequest } from "./api"

export async function getSportRooms() {
  return apiRequest("/sport-rooms")
}

export async function getSportRoomById(id) {
  return apiRequest(`/sport-rooms/${id}`)
}

export async function createSportRoom(data) {
  return apiRequest("/sport-rooms", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateSportRoom(id, data) {
  return apiRequest(`/sport-rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteSportRoom(id) {
  return apiRequest(`/sport-rooms/${id}`, {
    method: "DELETE",
  })
}
