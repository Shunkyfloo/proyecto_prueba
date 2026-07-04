import { NavLink, useNavigate } from "react-router-dom"
import BrandLogo from "../BrandLogo"
import { getUser, logout } from "../../services/authService"

function DashboardNav({ items }) {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className="dashboard-nav">
      <div className="dashboard-nav-brand">
        <BrandLogo to="/" size="sm" />
        <p className="dashboard-nav-user">{user?.full_name || user?.name}</p>
        <span className={`users-dashboard-role users-dashboard-role--${user?.role}`}>
          {user?.role === "admin"
            ? "Administrador"
            : user?.role === "coach"
              ? "Coach"
              : "Usuario"}
        </span>
      </div>

      <nav className="dashboard-nav-links">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `dashboard-nav-link${isActive ? " dashboard-nav-link--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="dashboard-nav-logout welcome-btn welcome-btn-secondary"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </aside>
  )
}

export default DashboardNav
