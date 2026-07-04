export const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Panel", end: true },
  { to: "/admin/usuarios", label: "Usuarios" },
  { to: "/admin/deportes", label: "Deportes" },
  { to: "/admin/salas", label: "Salas" },
  { to: "/admin/asignaciones", label: "Asignaciones" },
  { to: "/admin/horarios", label: "Horarios" },
  { to: "/perfil", label: "Mi perfil" },
]

export const COACH_NAV = [
  { to: "/coach/dashboard", label: "Panel", end: true },
  { to: "/coach/mis-clases", label: "Mis clases" },
  { to: "/coach/mi-horario", label: "Mi horario" },
  { to: "/perfil", label: "Mi perfil" },
]

export const USER_NAV = [
  { to: "/user/dashboard", label: "Panel", end: true },
  { to: "/user/clases", label: "Clases disponibles" },
  { to: "/user/reservas", label: "Mis reservas" },
  { to: "/perfil", label: "Mi perfil" },
]
