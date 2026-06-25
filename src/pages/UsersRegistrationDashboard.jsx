import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BrandLogo from "../components/BrandLogo"
import { Alert, Dropdown, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import UserFormModal from "../components/users/UserFormModal"
import { getUser, logout } from "../services/authService"
import {
  deleteUser,
  getRegisteredUsers,
  updateUser,
} from "../services/userService"

function UsersRegistrationDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const currentUser = getUser()
  const isAdmin = currentUser?.role === "admin"

  const loadUsers = () => {
    setUsers(getRegisteredUsers())
  }

  useEffect(() => {
    setLoading(true)
    setError("")
    loadUsers()
    setLoading(false)
  }, [])

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const confirmAction = async ({ title, text, confirmText }) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancelar",
      confirmButtonColor: isAdmin ? "#9333ea" : "#6b7280",
    })

    return result.isConfirmed
  }

  const showSuccess = (message) => {
    Swal.fire({
      title: "Aprobado",
      text: message,
      icon: "success",
      confirmButtonColor: "#16a34a",
    })
  }

  const showError = (message) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonColor: "#dc2626",
    })
  }

  const handleEditRequest = async (user) => {
    const displayName = user.full_name || user.name

    const confirmed = await confirmAction({
      title: "¿Editar usuario?",
      text: `¿Está seguro de editar a ${displayName}?`,
      confirmText: "Sí, editar",
    })

    if (!confirmed) {
      return
    }

    setSelectedUser({
      id: user.id,
      full_name: user.full_name || user.name,
      email: user.email,
      role: user.role || "user",
    })
    setShowModal(true)
  }

  const handleSave = async (formData) => {
    try {
      await updateUser(selectedUser.id, formData)
      closeModal()
      loadUsers()
      showSuccess("Usuario actualizado correctamente")
    } catch (saveError) {
      showError(saveError.message)
    }
  }

  const handleDeleteRequest = async (user) => {
    const displayName = user.full_name || user.name

    const confirmed = await confirmAction({
      title: "¿Eliminar usuario?",
      text: `¿Está seguro de eliminar a ${displayName}? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
    })

    if (!confirmed) {
      return
    }

    try {
      await deleteUser(user.id, user.email)
      loadUsers()
      showSuccess("Usuario eliminado permanentemente")
    } catch (deleteError) {
      showError(deleteError.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="users-dashboard">
      <div className="welcome-overlay" />

      <header className="users-dashboard-header">
        <div>
          <BrandLogo to="/" size="lg" className="users-dashboard-logo" />
          <h1>Dashboard de registros de usuarios</h1>
          <p>Usuarios registrados en la plataforma. Solo aparecen registros reales.</p>
        </div>
        <button
          type="button"
          className="welcome-btn welcome-btn-primary"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </header>

      {loading && (
        <div className="users-dashboard-state">
          <Spinner animation="border" variant="primary" />
          <p>Cargando registros...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="users-dashboard-alert">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <p className="users-dashboard-count">
            {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
          </p>

          <div className="users-dashboard-list-wrapper">
            <Table responsive hover className="users-dashboard-list">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Empresa</th>
                  <th>Rol</th>
                  {isAdmin && <th className="users-dashboard-actions-col">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="users-dashboard-empty">
                      No hay usuarios registrados todavía.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={`${user.source}-${user.id}-${user.email}`}>
                      <td>{index + 1}</td>
                      <td>{user.full_name || user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.company}</td>
                      <td>
                        <span className={`users-dashboard-role users-dashboard-role--${user.role}`}>
                          {user.role === "admin"
                            ? "Administrador"
                            : user.role === "coach"
                              ? "Entrenador"
                              : "Usuario"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="users-dashboard-actions-col">
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              variant="link"
                              className="users-actions-toggle"
                              aria-label="Opciones del usuario"
                            >
                              ⋮
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="users-actions-menu">
                              <Dropdown.Item onClick={() => handleEditRequest(user)}>
                                Editar
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDeleteRequest(user)}
                              >
                                Eliminar
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {isAdmin && (
        <UserFormModal
          show={showModal}
          handleClose={closeModal}
          handleSave={handleSave}
          selectedUser={selectedUser}
        />
      )}
    </div>
  )
}

export default UsersRegistrationDashboard
