import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  Form,
  Spinner,
  Table,
} from "react-bootstrap"
import Swal from "sweetalert2"
import BrandLogo from "../../components/BrandLogo"
import SportFormModal from "../../components/sports/SportFormModal"
import {
  createSport,
  deleteSport,
  getSports,
  updateSport,
  updateSportStatus,
} from "../../services/sportService"
import { formatSportDate } from "../../utils/dateFormat"

function SportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  const loadSports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getSports()
      setSports(response.data || [])
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSports()
  }, [loadSports])

  const openCreateModal = () => {
    setSelectedSport(null)
    setShowModal(true)
  }

  const openEditModal = (sport) => {
    setSelectedSport(sport)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSport(null)
  }

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire("Actualizado", "Deporte actualizado correctamente.", "success")
      } else {
        await createSport(formData)
        Swal.fire("Creado", "Deporte creado correctamente.", "success")
      }
      closeModal()
      loadSports()
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    }
  }

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar este deporte?",
      text: `Se eliminará "${sport.name}" del sistema.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    })

    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id)
        Swal.fire("Eliminado", "Deporte eliminado correctamente.", "success")
        loadSports()
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      }
    }
  }

  const handleStatusChange = async (sport, nextStatus) => {
    try {
      setUpdatingStatusId(sport.id)
      await updateSportStatus(sport.id, nextStatus)
      setSports((current) =>
        current.map((item) =>
          item.id === sport.id ? { ...item, status: nextStatus } : item,
        ),
      )
      Swal.fire(
        "Estado actualizado",
        `El deporte ahora está ${nextStatus ? "activo" : "inactivo"}.`,
        "success",
      )
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setUpdatingStatusId(null)
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="users-dashboard-header">
        <div>
          <BrandLogo to="/admin/dashboard" size="lg" className="users-dashboard-logo" />
          <h1>Gestión de Deportes</h1>
          <p>Administra los deportes ofrecidos por el club deportivo.</p>
        </div>
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
      </header>

      <Card className="shadow-sm admin-module-card admin-module-card--sports">
        <Card.Header className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h4 className="mb-0">Listado de deportes</h4>
          <div className="d-flex gap-2">
            <Button className="theme-btn-outline" onClick={loadSports}>
              Refrescar
            </Button>
            <Button className="theme-btn" onClick={openCreateModal}>
              Nuevo Deporte
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p className="mt-2">Cargando deportes...</p>
            </div>
          ) : sports.length === 0 ? (
            <p className="text-center module-empty mb-0">
              No hay deportes registrados todavía.
            </p>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sports.map((sport) => (
                  <tr key={sport.id}>
                    <td>{sport.name}</td>
                    <td>{sport.objective}</td>
                    <td>{sport.duration} min</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Form.Check
                          type="switch"
                          id={`sport-status-${sport.id}`}
                          label={sport.status ? "Activo" : "Inactivo"}
                          checked={sport.status}
                          disabled={updatingStatusId === sport.id}
                          onChange={(event) =>
                            handleStatusChange(sport, event.target.checked)
                          }
                        />
                        <span
                          className={`status-pill ${
                            sport.status ? "status-pill--active" : "status-pill--inactive"
                          }`}
                        >
                          {sport.status ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </td>
                    <td>{formatSportDate(sport.created_at)}</td>
                    <td>
                      <Button
                        className="theme-btn-warning btn-sm me-2"
                        onClick={() => openEditModal(sport)}
                      >
                        Editar
                      </Button>
                      <Button
                        className="theme-btn-danger btn-sm"
                        onClick={() => handleDelete(sport)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <SportFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSport={selectedSport}
      />
    </div>
  )
}

export default SportsPage
