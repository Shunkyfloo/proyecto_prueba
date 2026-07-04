import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { cancelReservation, getMyReservations } from "../../services/reservationService"
import { formatDayOfWeek, formatTime } from "../../utils/scheduleFormat"
import { formatSportDate } from "../../utils/dateFormat"

function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getMyReservations()
      setReservations(response.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  const handleCancel = async (reservation) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción liberará tu cupo en la clase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
      confirmButtonColor: "#d33",
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setCancellingId(reservation.id)
      await cancelReservation(reservation.id)
      Swal.fire("Cancelada", "Tu reserva fue cancelada correctamente.", "success")
      loadReservations()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setCancellingId(null)
    }
  }

  const getScheduleInfo = (reservation) => {
    const schedule = reservation.classSchedule
    if (!schedule) {
      return { sport: "—", room: "—", day: "—", time: "—" }
    }

    const sportRoom = schedule.sportRoom
    return {
      sport: sportRoom?.sport?.name || "—",
      room: sportRoom?.room?.name || "—",
      day: formatDayOfWeek(schedule.day_of_week),
      time: `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`,
    }
  }

  return (
    <div className="user-dashboard module-page">
      <PageHeader
        title="Mis reservas"
        subtitle="Consulta el estado de tus reservas y cancela cuando sea necesario."
      >
        <Link to="/user/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Link to="/user/clases" className="welcome-btn welcome-btn-primary">
          Nueva reserva
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingState message="Cargando reservas..." />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="Sin reservas"
          message="Aún no has reservado ninguna clase. Explora las clases disponibles."
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
                <th>Horario</th>
                <th>Estado</th>
                <th>Fecha reserva</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const info = getScheduleInfo(reservation)
                const isActive = reservation.status === "active"

                return (
                  <tr key={reservation.id}>
                    <td>{index + 1}</td>
                    <td>{info.sport}</td>
                    <td>{info.room}</td>
                    <td>{info.day}</td>
                    <td>{info.time}</td>
                    <td>
                      <span className={`status-pill status-pill--${isActive ? "active" : "inactive"}`}>
                        {isActive ? "Activa" : "Cancelada"}
                      </span>
                    </td>
                    <td>{formatSportDate(reservation.created_at)}</td>
                    <td>
                      {isActive && (
                        <Button
                          size="sm"
                          className="theme-btn-danger"
                          disabled={cancellingId === reservation.id}
                          onClick={() => handleCancel(reservation)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default MyReservationsPage
