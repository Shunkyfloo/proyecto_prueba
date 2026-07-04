import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  observation: "",
  status: true,
}

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || "",
        description: selectedRoom.description || "",
        capacity: String(selectedRoom.capacity ?? ""),
        location: selectedRoom.location || "",
        observation: selectedRoom.observation || "",
        status: selectedRoom.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedRoom, show])

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

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      nextErrors.name = "El nombre debe tener al menos 3 caracteres."
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      nextErrors.description = "La descripción debe tener al menos 5 caracteres."
    }

    const capacity = Number(formData.capacity)
    if (!formData.capacity || Number.isNaN(capacity) || capacity < 1) {
      nextErrors.capacity = "La capacidad debe ser mayor a 0."
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
      description: formData.description.trim(),
      capacity: Number(formData.capacity),
      location: formData.location.trim() || null,
      observation: formData.observation.trim() || null,
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedRoom ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={Boolean(errors.name)}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={Boolean(errors.description)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              isInvalid={Boolean(errors.capacity)}
            />
            <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observation"
              value={formData.observation}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="switch"
              id="room-status"
              name="status"
              label={formData.status ? "Activa" : "Inactiva"}
              checked={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="theme-btn-outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="theme-btn" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default RoomFormModal
