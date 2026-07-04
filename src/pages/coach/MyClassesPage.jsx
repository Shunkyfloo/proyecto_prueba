import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { getMyClasses } from "../../services/coachService"
import { formatDayOfWeek, formatTime } from "../../utils/scheduleFormat"

function MyClassesPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getMyClasses()
      setClasses(response.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  return (
    <div className="coach-dashboard module-page">
      <PageHeader
        title="Mis clases"
        subtitle="Clases asignadas a ti con deporte, sala y horarios disponibles."
      >
        <Link to="/coach/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando clases..." />
      ) : classes.length === 0 ? (
        <EmptyState
          title="Sin clases asignadas"
          message="Un administrador debe crear una asignación deporte-sala-coach para ti."
        />
      ) : (
        <div className="class-cards-grid">
          {classes.map((item) => (
            <article key={item.id} className="class-card">
              <div className="class-card-header">
                <h3>{item.sport?.name}</h3>
                <span className="status-pill status-pill--active">Activa</span>
              </div>
              <div className="class-card-body">
                <p><strong>Sala:</strong> {item.room?.name}</p>
                <p><strong>Ubicación:</strong> {item.room?.location || "—"}</p>
                <p><strong>Capacidad:</strong> {item.room?.capacity} personas</p>
                {item.observation && (
                  <p><strong>Observación:</strong> {item.observation}</p>
                )}
              </div>
              {item.schedules?.length > 0 && (
                <div className="class-card-schedules">
                  <h4>Horarios</h4>
                  <Table size="sm" className="users-dashboard-list mb-0">
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Inicio</th>
                        <th>Término</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.schedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td>{formatDayOfWeek(schedule.day_of_week)}</td>
                          <td>{formatTime(schedule.start_time)}</td>
                          <td>{formatTime(schedule.end_time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyClassesPage
