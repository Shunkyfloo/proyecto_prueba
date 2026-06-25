import { Outlet } from "react-router-dom"

function UserLayout() {
  return (
    <div className="users-dashboard user-layout-page theme-user">
      <div className="welcome-overlay" />
      <div className="users-dashboard-content">
        <Outlet />
      </div>
    </div>
  )
}

export default UserLayout
