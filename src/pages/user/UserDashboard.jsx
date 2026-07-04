import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { getMemberDashboard } from "../../services/memberService"
import { getUser } from "../../services/authService"

function UserDashboard() {
  const user = getUser()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getMemberDashboard()
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
    <div className="user-dashboard">
      <PageHeader
        title="Mi panel"
        subtitle={`Hola, ${user?.full_name || user?.name}. Reserva clases y gestiona tus entrenamientos.`}
      />

      {loading ? (
        <LoadingState message="Cargando panel..." />
      ) : (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <span className="stat-card-label">Clases disponibles</span>
              <strong className="stat-card-value">{stats?.available_classes ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card-label">Deportes</span>
              <strong className="stat-card-value">{stats?.available_sports ?? 0}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card-label">Horarios</span>
              <strong className="stat-card-value">{stats?.available_schedules ?? 0}</strong>
            </article>
          </div>

          <div className="admin-dashboard-actions">
            <Link to="/user/clases" className="users-dashboard-list-wrapper admin-action-card admin-action-card--sports">
              <div className="admin-action-card-header">
                <h2>Clases disponibles</h2>
              </div>
              <div className="admin-action-card-body">
                <p>Explora las clases del club y reserva tu cupo en segundos.</p>
                <span className="admin-action-link">Ver clases →</span>
              </div>
            </Link>

            <Link to="/user/reservas" className="users-dashboard-list-wrapper admin-action-card admin-action-card--rooms">
              <div className="admin-action-card-header">
                <h2>Mis reservas</h2>
              </div>
              <div className="admin-action-card-body">
                <p>Consulta y cancela tus reservas activas cuando lo necesites.</p>
                <span className="admin-action-link">Ver reservas →</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default UserDashboard
