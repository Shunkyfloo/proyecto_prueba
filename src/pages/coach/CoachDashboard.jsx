import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { getCoachDashboard } from "../../services/coachService"
import { getUser } from "../../services/authService"

function CoachDashboard() {
  const coach = getUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getCoachDashboard()
        setStats(response.data)
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="coach-dashboard">
      <PageHeader
        title="Panel del coach"
        subtitle={`Hola, ${coach?.full_name || coach?.name}. Revisa tus clases y horarios asignados.`}
      />

      {loading ? (
        <LoadingState message="Cargando panel..." />
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-card-label">Clases asignadas</span>
              <strong className="stat-card-value">{stats?.total_classes ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card-label">Horarios activos</span>
              <strong className="stat-card-value">{stats?.total_schedules ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card-label">Salas</span>
              <strong className="stat-card-value">{stats?.total_rooms ?? 0}</strong>
            </article>
          </div>

          <div className="admin-dashboard-actions">
            <Link to="/coach/mis-clases" className="users-dashboard-list-wrapper admin-action-card admin-action-card--sports">
              <div className="admin-action-card-header">
                <h2>Mis clases</h2>
              </div>
              <div className="admin-action-card-body">
                <p>Consulta las clases que tienes asignadas con deporte, sala y horarios.</p>
                <span className="admin-action-link">Ver clases →</span>
              </div>
            </Link>

            <Link to="/coach/mi-horario" className="users-dashboard-list-wrapper admin-action-card admin-action-card--schedules">
              <div className="admin-action-card-header">
                <h2>Mi horario</h2>
              </div>
              <div className="admin-action-card-body">
                <p>Revisa tu agenda semanal con todos los bloques programados.</p>
                <span className="admin-action-link">Ver horario →</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default CoachDashboard
