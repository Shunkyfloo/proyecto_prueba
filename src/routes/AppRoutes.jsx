import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import GetStarted from "../pages/GetStarted"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Unauthorized from "../pages/Unauthorized"
import ProfilePage from "../pages/ProfilePage"
import UserDashboard from "../pages/user/UserDashboard"
import AvailableClassesPage from "../pages/user/AvailableClassesPage"
import MyReservationsPage from "../pages/user/MyReservationsPage"
import CoachDashboard from "../pages/coach/CoachDashboard"
import MyClassesPage from "../pages/coach/MyClassesPage"
import MySchedulePage from "../pages/coach/MySchedulePage"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UsersPage from "../pages/admin/UsersPage"
import SportsPage from "../pages/admin/SportsPage"
import RoomsPage from "../pages/admin/RoomsPage"
import SportRoomsPage from "../pages/admin/SportRoomsPage"
import ClassSchedulesPage from "../pages/admin/ClassSchedulesPage"
import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"

function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comenzar" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="clases" element={<AvailableClassesPage />} />
          <Route path="reservas" element={<MyReservationsPage />} />
        </Route>

        <Route
          path="/coach"
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="mis-clases" element={<MyClassesPage />} />
          <Route path="mi-horario" element={<MySchedulePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="deportes" element={<SportsPage />} />
          <Route path="salas" element={<RoomsPage />} />
          <Route path="asignaciones" element={<SportRoomsPage />} />
          <Route path="horarios" element={<ClassSchedulesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
