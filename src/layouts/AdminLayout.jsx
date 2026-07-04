import { Outlet } from "react-router-dom"
import DashboardNav from "../components/layout/DashboardNav"
import { ADMIN_NAV } from "../config/navigation"

function AdminLayout() {
  return (
    <div className="users-dashboard admin-layout-page theme-admin">
      <div className="welcome-overlay" />
      <div className="dashboard-shell">
        <DashboardNav items={ADMIN_NAV} />
        <div className="users-dashboard-content dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
