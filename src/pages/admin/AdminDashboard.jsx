import { Link } from "react-router-dom"
import { getUser } from "../../services/authService"
import PageHeader from "../../components/layout/PageHeader"

const ADMIN_MODULES = [
  {
    to: "/admin/usuarios",
    title: "Gestión de usuarios",
    description: "Consulta, crea, edita y elimina usuarios del club.",
    className: "admin-action-card--users",
  },
  {
    to: "/admin/deportes",
    title: "Gestión de deportes",
    description: "Administra deportes, objetivos, duración y estado.",
    className: "admin-action-card--sports",
  },
  {
    to: "/admin/salas",
    title: "Gestión de salas",
    description: "Controla capacidad, ubicación y disponibilidad de salas.",
    className: "admin-action-card--rooms",
  },
  {
    to: "/admin/asignaciones",
    title: "Asignaciones",
    description: "Vincula deporte, sala y coach para cada clase.",
    className: "admin-action-card--assignments",
  },
  {
    to: "/admin/horarios",
    title: "Horarios",
    description: "Programa los bloques horarios de las clases.",
    className: "admin-action-card--schedules",
  },
]

function AdminDashboard() {
  const admin = getUser()

  return (
    <div className="admin-dashboard">
      <PageHeader
        title="Panel de administración"
        subtitle={`Bienvenido, ${admin?.full_name || admin?.name}. Gestiona todos los módulos del club.`}
      />

      <div className="admin-dashboard-actions">
        {ADMIN_MODULES.map((module) => (
          <Link
            key={module.to}
            to={module.to}
            className={`users-dashboard-list-wrapper admin-action-card ${module.className}`}
          >
            <div className="admin-action-card-header">
              <h2>{module.title}</h2>
            </div>
            <div className="admin-action-card-body">
              <p>{module.description}</p>
              <span className="admin-action-link">Ir al módulo →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
