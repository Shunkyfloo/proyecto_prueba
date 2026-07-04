import { apiRequest } from "./api"

export async function getRooms() {
  return apiRequest("/rooms")
}

export async function getRoomById(id) {
  return apiRequest(`/rooms/${id}`)
}

export async function createRoom(roomData) {
  return apiRequest("/rooms", {
    method: "POST",
    body: JSON.stringify(roomData),
  })
}

export async function updateRoom(id, roomData) {
  return apiRequest(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(roomData),
  })
}

export async function deleteRoom(id) {
  return apiRequest(`/rooms/${id}`, {
    method: "DELETE",
  })
}
