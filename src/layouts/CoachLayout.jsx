import { Outlet } from "react-router-dom"

function CoachLayout() {
  return (
    <div className="users-dashboard coach-layout-page theme-coach">
      <div className="welcome-overlay" />
      <div className="users-dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default CoachLayout
