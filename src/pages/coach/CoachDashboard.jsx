import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Col, Row, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import BrandLogo from "../../components/BrandLogo"
import ClientDetailPanel from "../../components/coach/ClientDetailPanel"
import { getUser, logout } from "../../services/authService"
import {
  getClientById,
  getCoachClients,
  updateClientPlan,
} from "../../services/userService"

function CoachDashboard() {
  const navigate = useNavigate()
  const coach = getUser()
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadClients = () => {
    const clientList = getCoachClients()
    setClients(clientList)

    if (selectedClientId) {
      setSelectedClient(getClientById(selectedClientId))
    }
  }

  useEffect(() => {
    loadClients()
    setLoading(false)
  }, [])

  const handleSelectClient = (client) => {
    setSelectedClientId(client.id)
    setSelectedClient(getClientById(client.id))
  }

  const handleSavePlan = async (plan) => {
    if (!selectedClient) {
      return
    }

    try {
      setSaving(true)
      const updated = updateClientPlan(selectedClient.id, plan)
      setSelectedClient(updated)
      loadClients()

      Swal.fire({
        title: "Plan guardado",
        text: "El plan del cliente se actualizó correctamente.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      })
    } finally {
      setSaving(false)
    }
  }

  const hasPlan = (client) =>
    Boolean(
      client.coachPlan?.objectives ||
        client.coachPlan?.routine ||
        client.coachPlan?.notes,
    )

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="coach-dashboard">
      <header className="users-dashboard-header">
        <div>
          <BrandLogo to="/" size="lg" className="users-dashboard-logo" />
          <h1>Mis clientes</h1>
          <p>
            Gestiona a los usuarios registrados y asigna qué deben hacer en su
            entrenamiento. Coach:{" "}
            <strong>{coach?.full_name || coach?.name}</strong>
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

      {loading ? (
        <div className="users-dashboard-state">
          <Spinner animation="border" variant="primary" />
          <p>Cargando clientes...</p>
        </div>
      ) : (
        <>
          <p className="users-dashboard-count">
            {clients.length}{" "}
            {clients.length === 1 ? "cliente registrado" : "clientes registrados"}
          </p>

          <Row className="g-4 coach-dashboard-grid">
            <Col lg={5} xl={4}>
              <div className="users-dashboard-list-wrapper coach-panel">
                <div className="coach-panel-header">
                  <h2>Lista de clientes</h2>
                </div>

                {clients.length === 0 ? (
                  <Alert variant="secondary" className="coach-empty-alert m-3">
                    No hay usuarios registrados disponibles. Los administradores
                    y coaches no aparecen en esta lista.
                  </Alert>
                ) : (
                  <div className="coach-client-list-wrapper">
                    <Table hover className="users-dashboard-list coach-client-list mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client, index) => (
                          <tr
                            key={client.id}
                            className={
                              selectedClientId === client.id
                                ? "coach-client-row coach-client-row--active"
                                : "coach-client-row"
                            }
                            onClick={() => handleSelectClient(client)}
                          >
                            <td>{index + 1}</td>
                            <td>
                              <span className="coach-client-name">
                                {client.full_name || client.name}
                              </span>
                              <span className="coach-client-email">
                                {client.email}
                              </span>
                            </td>
                            <td>
                              <span
                                className={
                                  hasPlan(client)
                                    ? "users-dashboard-role users-dashboard-role--admin"
                                    : "users-dashboard-role users-dashboard-role--coach"
                                }
                              >
                                {hasPlan(client) ? "Con plan" : "Sin plan"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </Col>

            <Col lg={7} xl={8}>
              <div className="users-dashboard-list-wrapper coach-panel coach-panel-detail">
                {!selectedClient ? (
                  <div className="coach-dashboard-placeholder">
                    <h2>Selecciona un cliente</h2>
                    <p>
                      Haz clic en un usuario de la lista para ver sus datos y
                      editar el plan que debe seguir.
                    </p>
                  </div>
                ) : (
                  <ClientDetailPanel
                    client={selectedClient}
                    onSave={handleSavePlan}
                    saving={saving}
                  />
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default CoachDashboard
