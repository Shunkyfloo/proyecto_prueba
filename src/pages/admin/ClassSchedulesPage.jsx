import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Dropdown, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import ScheduleFormModal from "../../components/schedules/ScheduleFormModal"
import {
  createClassSchedule,
  deleteClassSchedule,
  getClassSchedules,
  updateClassSchedule,
} from "../../services/classScheduleService"
import { getSportRooms } from "../../services/sportRoomService"
import { formatDayOfWeek, formatTime } from "../../utils/scheduleFormat"

function ClassSchedulesPage() {
  const [schedules, setSchedules] = useState([])
  const [sportRooms, setSportRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [schedulesRes, sportRoomsRes] = await Promise.all([
        getClassSchedules(),
        getSportRooms(),
      ])
      setSchedules(schedulesRes.data || [])
      setSportRooms(sportRoomsRes.data || [])
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
      if (selectedSchedule) {
        await updateClassSchedule(selectedSchedule.id, formData)
        Swal.fire("Actualizado", "Horario actualizado correctamente.", "success")
      } else {
        await createClassSchedule(formData)
        Swal.fire("Creado", "Horario creado correctamente.", "success")
      }
      setShowModal(false)
      setSelectedSchedule(null)
      loadData()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: "¿Eliminar horario?",
      text: "Los usuarios ya no podrán reservar este bloque.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteClassSchedule(schedule.id)
        Swal.fire("Eliminado", "Horario eliminado correctamente.", "success")
        loadData()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  const getAssignmentLabel = (schedule) => {
    const sportRoom = schedule.sportRoom
    if (!sportRoom) {
      return "—"
    }
    return `${sportRoom.sport?.name || "Deporte"} · ${sportRoom.room?.name || "Sala"}`
  }

  return (
    <div className="admin-dashboard module-page">
      <PageHeader
        title="Gestión de Horarios"
        subtitle="Programa los bloques horarios de cada clase del club."
      >
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Button className="theme-btn" onClick={() => { setSelectedSchedule(null); setShowModal(true) }}>
          Nuevo horario
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando horarios..." />
      ) : schedules.length === 0 ? (
        <EmptyState
          title="Sin horarios"
          message="Crea horarios para que los usuarios puedan reservar clases."
        />
      ) : (
        <div className="users-dashboard-list-wrapper">
          <Table responsive hover className="users-dashboard-list mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Asignación</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{index + 1}</td>
                  <td>{getAssignmentLabel(schedule)}</td>
                  <td>{formatDayOfWeek(schedule.day_of_week)}</td>
                  <td>{formatTime(schedule.start_time)}</td>
                  <td>{formatTime(schedule.end_time)}</td>
                  <td>
                    <span className={`status-pill status-pill--${schedule.status ? "active" : "inactive"}`}>
                      {schedule.status ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="users-actions-toggle">
                        ⋮
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="users-actions-menu">
                        <Dropdown.Item onClick={() => { setSelectedSchedule(schedule); setShowModal(true) }}>
                          Editar
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(schedule)}>
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

      <ScheduleFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedSchedule(null) }}
        handleSave={handleSave}
        selectedSchedule={selectedSchedule}
        sportRooms={sportRooms}
      />
    </div>
  )
}

export default ClassSchedulesPage
