import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Col, Row } from "react-bootstrap"
import BrandLogo from "../../components/BrandLogo"
import { getUser, logout } from "../../services/authService"
import { getUserCoachPlan } from "../../services/userService"

function formatTodayDate() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function UserDashboard() {
  const navigate = useNavigate()
  const sessionUser = getUser()
  const [coachPlan, setCoachPlan] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const plan = getUserCoachPlan(sessionUser?.id, sessionUser?.email)
    setCoachPlan(plan)
    setLoaded(true)
  }, [sessionUser?.id, sessionUser?.email])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const hasPlan =
    coachPlan &&
    (coachPlan.objectives || coachPlan.routine || coachPlan.notes)

  const todayLabel = formatTodayDate()

  return (
    <div className="user-dashboard">
      <header className="users-dashboard-header">
        <div>
          <BrandLogo to="/" size="lg" className="users-dashboard-logo" />
          <h1>Mi entrenamiento de hoy</h1>
          <p>
            Hola, <strong>{sessionUser?.full_name || sessionUser?.name}</strong>.
            Esto es lo que tu coach preparó para ti.
          </p>
        </div>
        <button
          type="button"
          className="welcome-btn welcome-btn-primary"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </header>

      <p className="users-dashboard-count user-dashboard-date">{todayLabel}</p>

      {!loaded ? null : !hasPlan ? (
        <Alert variant="secondary" className="user-plan-empty users-dashboard-alert">
          Tu coach aún no ha asignado un plan para hoy. Cuando lo haga, aparecerá
          aquí automáticamente.
        </Alert>
      ) : (
        <Row className="g-4 user-dashboard-grid">
          {coachPlan.objectives && (
            <Col md={12} lg={4}>
              <article className="users-dashboard-list-wrapper user-plan-card">
                <div className="user-plan-card-header">
                  <h2>Objetivos</h2>
                </div>
                <div className="user-plan-card-body">
                  <p>{coachPlan.objectives}</p>
                </div>
              </article>
            </Col>
          )}

          {coachPlan.routine && (
            <Col md={12} lg={coachPlan.objectives ? 4 : 6}>
              <article className="users-dashboard-list-wrapper user-plan-card user-plan-card--highlight">
                <div className="user-plan-card-header">
                  <h2>Qué hacer hoy</h2>
                </div>
                <div className="user-plan-card-body">
                  <p className="user-plan-routine">{coachPlan.routine}</p>
                </div>
              </article>
            </Col>
          )}

          {coachPlan.notes && (
            <Col md={12} lg={coachPlan.objectives && coachPlan.routine ? 4 : 6}>
              <article className="users-dashboard-list-wrapper user-plan-card">
                <div className="user-plan-card-header">
                  <h2>Notas del coach</h2>
                </div>
                <div className="user-plan-card-body">
                  <p>{coachPlan.notes}</p>
                </div>
              </article>
            </Col>
          )}
        </Row>
      )}

      {hasPlan && coachPlan.updatedAt && (
        <p className="user-plan-updated">
          Plan actualizado:{" "}
          {new Date(coachPlan.updatedAt).toLocaleString("es-CL")}
        </p>
      )}
    </div>
  )
}

export default UserDashboard
