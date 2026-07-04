import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Dropdown, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import SportRoomFormModal from "../../components/sportRooms/SportRoomFormModal"
import { getRooms } from "../../services/roomService"
import { getSports } from "../../services/sportService"
import {
  createSportRoom,
  deleteSportRoom,
  getSportRooms,
  updateSportRoom,
} from "../../services/sportRoomService"
import { getCoaches } from "../../services/userService"

function SportRoomsPage() {
  const [assignments, setAssignments] = useState([])
  const [sports, setSports] = useState([])
  const [rooms, setRooms] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [assignmentsRes, sportsRes, roomsRes, coachesList] = await Promise.all([
        getSportRooms(),
        getSports(),
        getRooms(),
        getCoaches(),
      ])
      setAssignments(assignmentsRes.data || [])
      setSports(sportsRes.data || [])
      setRooms(roomsRes.data || [])
      setCoaches(coachesList)
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await updateSportRoom(selectedItem.id, formData)
        Swal.fire("Actualizado", "Asignación actualizada correctamente.", "success")
      } else {
        await createSportRoom(formData)
        Swal.fire("Creado", "Asignación creada correctamente.", "success")
      }
      setShowModal(false)
      setSelectedItem(null)
      loadData()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      text: "Se eliminará la relación deporte-sala-coach.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteSportRoom(item.id)
        Swal.fire("Eliminado", "Asignación eliminada correctamente.", "success")
        loadData()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  return (
    <div className="admin-dashboard module-page">
      <PageHeader
        title="Gestión de Asignaciones"
        subtitle="Vincula deportes, salas y coaches para habilitar clases."
      >
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Button className="theme-btn" onClick={() => { setSelectedItem(null); setShowModal(true) }}>
          Nueva asignación
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando asignaciones..." />
      ) : assignments.length === 0 ? (
        <EmptyState
          title="Sin asignaciones"
          message="Crea una asignación deporte + sala + coach para programar horarios."
        />
      ) : (
        <div className="users-dashboard-list-wrapper">
          <Table responsive hover className="users-dashboard-list mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Coach</th>
                <th>Observación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.sport?.name || "—"}</td>
                  <td>{item.room?.name || "—"}</td>
                  <td>{item.coach?.email || "—"}</td>
                  <td>{item.observation || "—"}</td>
                  <td>
                    <span className={`status-pill status-pill--${item.status ? "active" : "inactive"}`}>
                      {item.status ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="users-actions-toggle">
                        ⋮
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="users-actions-menu">
                        <Dropdown.Item onClick={() => { setSelectedItem(item); setShowModal(true) }}>
                          Editar
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(item)}>
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

      <SportRoomFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedItem(null) }}
        handleSave={handleSave}
        selectedItem={selectedItem}
        sports={sports}
        rooms={rooms}
        coaches={coaches}
      />
    </div>
  )
}

export default SportRoomsPage
