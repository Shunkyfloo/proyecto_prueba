import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Form, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import EmptyState from "../../components/common/EmptyState"
import LoadingState from "../../components/common/LoadingState"
import PageHeader from "../../components/layout/PageHeader"
import { getAvailableClasses, getAvailableSports } from "../../services/memberService"
import { createReservation } from "../../services/reservationService"
import { formatDayOfWeek, formatTime } from "../../utils/scheduleFormat"

function AvailableClassesPage() {
  const [classes, setClasses] = useState([])
  const [sports, setSports] = useState([])
  const [sportFilter, setSportFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [reservingId, setReservingId] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const filters = sportFilter ? { sport_id: sportFilter } : {}
      const [classesRes, sportsRes] = await Promise.all([
        getAvailableClasses(filters),
        getAvailableSports(),
      ])
      setClasses(classesRes.data || [])
      setSports(sportsRes.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [sportFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleReserve = async (schedule) => {
    const result = await Swal.fire({
      title: "¿Confirmar reserva?",
      text: `Reservarás la clase del ${formatDayOfWeek(schedule.day_of_week)} ${formatTime(schedule.start_time)}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3b82f6",
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setReservingId(schedule.id)
      await createReservation(schedule.id)
      Swal.fire("Reserva creada", "Tu cupo fue confirmado correctamente.", "success")
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setReservingId(null)
    }
  }

  return (
    <div className="user-dashboard module-page">
      <PageHeader
        title="Clases disponibles"
        subtitle="Filtra por deporte y reserva el horario que prefieras."
      >
        <Link to="/user/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
      </PageHeader>

      <div className="filter-bar">
        <Form.Select
          value={sportFilter}
          onChange={(event) => setSportFilter(event.target.value)}
          className="filter-select"
        >
          <option value="">Todos los deportes</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </Form.Select>
      </div>

      {loading ? (
        <LoadingState message="Cargando clases..." />
      ) : classes.length === 0 ? (
        <EmptyState
          title="Sin clases disponibles"
          message="No hay clases publicadas con los filtros seleccionados."
        />
      ) : (
        <div className="class-cards-grid">
          {classes.map((item) => (
            <article key={item.id} className="class-card">
              <div className="class-card-header">
                <h3>{item.sport?.name}</h3>
                <span className="users-dashboard-role users-dashboard-role--coach">
                  Coach: {item.coach?.email || "—"}
                </span>
              </div>
              <div className="class-card-body">
                <p><strong>Sala:</strong> {item.room?.name}</p>
                <p><strong>Ubicación:</strong> {item.room?.location || "—"}</p>
                <p><strong>Capacidad:</strong> {item.room?.capacity} personas</p>
              </div>
              {item.schedules?.length > 0 ? (
                <div className="class-card-schedules">
                  <h4>Horarios para reservar</h4>
                  <Table size="sm" className="users-dashboard-list mb-0">
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Horario</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.schedules.map((schedule) => (
                        <tr key={schedule.id}>
                          <td>{formatDayOfWeek(schedule.day_of_week)}</td>
                          <td>
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </td>
                          <td>
                            <Button
                              size="sm"
                              className="theme-btn"
                              disabled={reservingId === schedule.id}
                              onClick={() => handleReserve(schedule)}
                            >
                              Reservar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="class-card-empty">Sin horarios disponibles.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailableClassesPage
