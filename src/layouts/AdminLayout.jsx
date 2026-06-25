import { Outlet } from "react-router-dom"

function AdminLayout() {
  return (
    <div className="users-dashboard admin-layout-page">
      <div className="welcome-overlay" />
      <div className="users-dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
