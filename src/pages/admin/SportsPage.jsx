import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Button, Dropdown, Form, Spinner, Table } from "react-bootstrap"
import Swal from "sweetalert2"
import PageHeader from "../../components/layout/PageHeader"
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

  const sortedSports = useMemo(
    () => [...sports].sort((a, b) => a.id - b.id),
    [sports],
  )

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
    <div className="admin-dashboard sports-page module-page">
      <PageHeader
        title="Gestión de deportes"
        subtitle="Administra los deportes ofrecidos por el club."
      >
        <Link to="/admin/dashboard" className="welcome-btn welcome-btn-secondary">
          Volver al panel
        </Link>
        <Button className="theme-btn-outline" onClick={loadSports}>
          Refrescar
        </Button>
        <Button className="theme-btn" onClick={openCreateModal}>
          Nuevo deporte
        </Button>
      </PageHeader>

      {loading ? (
        <div className="users-dashboard-state">
          <Spinner animation="border" />
          <p>Cargando deportes...</p>
        </div>
      ) : (
        <>
          <p className="users-dashboard-count">
            {sortedSports.length}{" "}
            {sortedSports.length === 1
              ? "deporte registrado"
              : "deportes registrados"}
          </p>

          <div className="users-dashboard-list-wrapper sports-list-wrapper">
            {sortedSports.length === 0 ? (
              <p className="sports-list-empty">No hay deportes registrados todavía.</p>
            ) : (
              <Table responsive hover className="users-dashboard-list sports-list mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Objetivo</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Fecha de creación</th>
                    <th className="sports-list-actions-col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSports.map((sport, index) => (
                    <tr key={sport.id}>
                      <td className="sports-list-index">{index + 1}</td>
                      <td className="sports-list-name">{sport.name}</td>
                      <td className="sports-list-objective" title={sport.objective}>
                        {sport.objective}
                      </td>
                      <td className="sports-list-duration">{sport.duration} min</td>
                      <td className="sports-list-status">
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
                      </td>
                      <td className="sports-list-date">
                        {formatSportDate(sport.created_at)}
                      </td>
                      <td className="sports-list-actions-col">
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="link"
                            className="users-actions-toggle"
                            aria-label={`Opciones de ${sport.name}`}
                          >
                            ⋮
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="users-actions-menu">
                            <Dropdown.Item onClick={() => openEditModal(sport)}>
                              Editar
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => handleDelete(sport)}
                            >
                              Eliminar
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </>
      )}

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
