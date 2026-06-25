import { Link, useNavigate } from "react-router-dom"
import BrandLogo from "../../components/BrandLogo"
import { getUser, logout } from "../../services/authService"

function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="admin-dashboard">
      <header className="users-dashboard-header">
        <div>
          <BrandLogo to="/" size="lg" className="users-dashboard-logo" />
          <h1>Panel de administración</h1>
          <p>
            Bienvenido, <strong>{admin?.full_name || admin?.name}</strong>.
            Gestiona usuarios, deportes, entrenadores y clases del club.
          </p>
        </div>
        <button
          type="button"
          className="welcome-btn welcome-btn-primary"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </header>

      <div className="admin-dashboard-actions">
        <Link
          to="/dashboard/registros"
          className="users-dashboard-list-wrapper admin-action-card"
        >
          <div className="admin-action-card-header">
            <h2>Registros de usuarios</h2>
          </div>
          <div className="admin-action-card-body">
            <p>
              Consulta, edita y elimina los usuarios registrados en la
              plataforma.
            </p>
            <span className="admin-action-link">Ir al dashboard →</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
