import { apiRequest } from "./api"

export async function getClassSchedules() {
  return apiRequest("/class-schedules")
}

export async function getClassScheduleById(id) {
  return apiRequest(`/class-schedules/${id}`)
}

export async function createClassSchedule(data) {
  return apiRequest("/class-schedules", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateClassSchedule(id, data) {
  return apiRequest(`/class-schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteClassSchedule(id) {
  return apiRequest(`/class-schedules/${id}`, {
    method: "DELETE",
  })
}
