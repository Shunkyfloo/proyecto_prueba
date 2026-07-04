import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { getMySchedules } from "../../services/coachService"
import { formatDayOfWeek, formatTime } from "../../utils/scheduleFormat"

function MySchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getMySchedules()
      setSchedules(response.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  return (
    <div className="coach-dashboard module-page">
      <PageHeader
        title="Mi horario"
        subtitle="Agenda semanal con todos tus bloques de entrenamiento."
      >
        <Link to="/coach/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando horario..." />
      ) : schedules.length === 0 ? (
        <EmptyState
          title="Sin horarios"
          message="Aún no tienes bloques horarios asignados en el club."
        />
      ) : (
        <div className="users-dashboard-list-wrapper">
          <Table responsive hover className="users-dashboard-list mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Deporte</th>
                <th>Sala</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Término</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{index + 1}</td>
                  <td>{schedule.sportRoom?.sport?.name || "—"}</td>
                  <td>{schedule.sportRoom?.room?.name || "—"}</td>
                  <td>{formatDayOfWeek(schedule.day_of_week)}</td>
                  <td>{formatTime(schedule.start_time)}</td>
                  <td>{formatTime(schedule.end_time)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default MySchedulePage
