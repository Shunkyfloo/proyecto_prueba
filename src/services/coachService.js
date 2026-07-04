import { apiRequest } from "./api"

export async function getCoachDashboard() {
  return apiRequest("/coach/dashboard")
}

export async function getMyClasses() {
  return apiRequest("/coach/my-classes")
}

export async function getMySchedules() {
  return apiRequest("/coach/my-schedules")
}

export async function getMyRooms() {
  return apiRequest("/coach/my-rooms")
}
