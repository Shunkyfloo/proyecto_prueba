const DAYS = [
  "",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]

export function formatDayOfWeek(day) {
  return DAYS[Number(day)] || "—"
}

export function formatTime(time) {
  if (!time) {
    return "—"
  }

  return time.slice(0, 5)
}

export function formatScheduleRange(schedule) {
  if (!schedule) {
    return "—"
  }

  return `${formatDayOfWeek(schedule.day_of_week)} ${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
}
