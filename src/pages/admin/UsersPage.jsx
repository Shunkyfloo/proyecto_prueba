import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Card, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import PageHeader from "../../components/layout/PageHeader"
import UserFormModal from "../../components/users/UserFormModal"
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/userService"

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data.data)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreateModal = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData)
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success")
      } else {
        await createUser(formData)
        Swal.fire("Creado", "Usuario creado correctamente", "success")
      }
      closeModal()
      loadUsers()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id)
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success")
        loadUsers()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  return (
    <div className="admin-dashboard module-page">
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Administra los usuarios del club desde la API."
      >
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Button className="theme-btn" onClick={openCreateModal}>
          Nuevo usuario
        </Button>
      </PageHeader>

    <Card className="shadow-sm admin-module-card admin-module-card--users">

      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando usuarios...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`users-dashboard-role users-dashboard-role--${user.role}`}>
                      {user.role === "admin"
                        ? "Administrador"
                        : user.role === "user"
                        ? "Usuario"
                        : "Entrenador"}
                    </span>
                  </td>
                  <td>
                    <Button
                      className="theme-btn-warning btn-sm me-2"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      className="theme-btn-danger btn-sm"
                      onClick={() => handleDelete(user)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </Card>
    </div>
  )
}

export default UsersPage
