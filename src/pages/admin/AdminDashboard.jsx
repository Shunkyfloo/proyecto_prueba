import { Link } from "react-router-dom"

function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard Administrador</h1>
      <p>Gestión de usuarios, deportes, entrenadores y clases.</p>
      <Link to="/dashboard/registros" className="welcome-btn welcome-btn-primary d-inline-flex mt-3">
        Ver registros de usuarios
      </Link>
    </div>
  )
}

export default AdminDashboard
