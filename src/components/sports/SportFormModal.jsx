import { useEffect, useState } from "react"
import { Alert, Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  name: "",
  objective: "",
  duration: "",
  status: true,
}

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || "",
        objective: selectedSport.objective || "",
        duration: String(selectedSport.duration ?? ""),
        status: selectedSport.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSport, show])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = "El nombre es obligatorio."
    } else if (formData.name.trim().length < 3) {
      nextErrors.name = "El nombre debe tener al menos 3 caracteres."
    }

    if (!formData.objective.trim()) {
      nextErrors.objective = "El objetivo es obligatorio."
    } else if (formData.objective.trim().length < 5) {
      nextErrors.objective = "El objetivo debe tener al menos 5 caracteres."
    }

    const duration = Number(formData.duration)
    if (!formData.duration) {
      nextErrors.duration = "La duración es obligatoria."
    } else if (Number.isNaN(duration) || duration < 1) {
      nextErrors.duration = "La duración debe ser un número mayor a 0."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    handleSave({
      name: formData.name.trim(),
      objective: formData.objective.trim(),
      duration: Number(formData.duration),
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSport ? "Editar Deporte" : "Nuevo Deporte"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={Boolean(errors.name)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              isInvalid={Boolean(errors.objective)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.objective}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              isInvalid={Boolean(errors.duration)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.duration}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="sport-status"
              name="status"
              label={formData.status ? "Activo" : "Inactivo"}
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default SportFormModal
