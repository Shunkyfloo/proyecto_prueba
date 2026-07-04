import { apiRequest } from "./api"

export async function getReservations() {
  return apiRequest("/reservations")
}

export async function getMyReservations() {
  return apiRequest("/reservations/my-reservations")
}

export async function createReservation(classScheduleId) {
  return apiRequest("/reservations", {
    method: "POST",
    body: JSON.stringify({ class_schedule_id: classScheduleId }),
  })
}

export async function cancelReservation(id) {
  return apiRequest(`/reservations/${id}/cancel`, {
    method: "PATCH",
  })
}
