const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export function formatSportDate(dateString) {
  if (!dateString) {
    return "—"
  }

  const date = new Date(dateString)
  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = MONTHS[date.getUTCMonth()]
  const year = date.getUTCFullYear()

  return `${day} de ${month} de ${year}`
}
