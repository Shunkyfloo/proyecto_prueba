import { Outlet } from "react-router-dom"
import DashboardNav from "../components/layout/DashboardNav"
import { USER_NAV } from "../config/navigation"

function UserLayout() {
  return (
    <div className="users-dashboard user-layout-page theme-user">
      <div className="welcome-overlay" />
      <div className="dashboard-shell">
        <DashboardNav items={USER_NAV} />
        <div className="users-dashboard-content dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserLayout
