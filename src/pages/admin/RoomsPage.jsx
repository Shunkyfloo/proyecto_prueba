import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Dropdown, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import RoomFormModal from "../../components/rooms/RoomFormModal"
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "../../services/roomService"

function RoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getRooms()
      setRooms(response.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRooms()
  }, [loadRooms])

  const handleSave = async (formData) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, formData)
        Swal.fire("Actualizado", "Sala actualizada correctamente.", "success")
      } else {
        await createRoom(formData)
        Swal.fire("Creado", "Sala creada correctamente.", "success")
      }
      setShowModal(false)
      setSelectedRoom(null)
      loadRooms()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (room) => {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Se eliminará "${room.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteRoom(room.id)
        Swal.fire("Eliminado", "Sala eliminada correctamente.", "success")
        loadRooms()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  return (
    <div className="admin-dashboard module-page">
      <PageHeader
        title="Gestión de Salas"
        subtitle="Administra las salas disponibles del club deportivo."
      >
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Button className="theme-btn" onClick={() => { setSelectedRoom(null); setShowModal(true) }}>
          Nueva sala
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando salas..." />
      ) : rooms.length === 0 ? (
        <EmptyState
          title="Sin salas registradas"
          message="Crea la primera sala para comenzar a asignar clases."
        />
      ) : (
        <div className="users-dashboard-list-wrapper">
          <Table responsive hover className="users-dashboard-list mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Capacidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.id}>
                  <td>{index + 1}</td>
                  <td>{room.name}</td>
                  <td>{room.description}</td>
                  <td>{room.capacity}</td>
                  <td>{room.location || "—"}</td>
                  <td>
                    <span className={`status-pill status-pill--${room.status ? "active" : "inactive"}`}>
                      {room.status ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="users-actions-toggle">
                        ⋮
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="users-actions-menu">
                        <Dropdown.Item onClick={() => { setSelectedRoom(room); setShowModal(true) }}>
                          Editar
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(room)}>
                          Eliminar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <RoomFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedRoom(null) }}
        handleSave={handleSave}
        selectedRoom={selectedRoom}
      />
    </div>
  )
}

export default RoomsPage
