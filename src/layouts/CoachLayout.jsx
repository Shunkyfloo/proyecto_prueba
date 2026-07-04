import { Outlet } from "react-router-dom"
import DashboardNav from "../components/layout/DashboardNav"
import { COACH_NAV } from "../config/navigation"

function CoachLayout() {
  return (
    <div className="users-dashboard coach-layout-page theme-coach">
      <div className="welcome-overlay" />
      <div className="dashboard-shell">
        <DashboardNav items={COACH_NAV} />
        <div className="users-dashboard-content dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CoachLayout
