import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  sport_id: "",
  room_id: "",
  coach_id: "",
  observation: "",
  status: true,
}

function SportRoomFormModal({
  show,
  handleClose,
  handleSave,
  selectedItem,
  sports,
  rooms,
  coaches,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        sport_id: String(selectedItem.sport_id ?? selectedItem.sport?.id ?? ""),
        room_id: String(selectedItem.room_id ?? selectedItem.room?.id ?? ""),
        coach_id: String(selectedItem.coach_id ?? selectedItem.coach?.id ?? ""),
        observation: selectedItem.observation || "",
        status: selectedItem.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedItem, show])

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

    if (!formData.sport_id) {
      nextErrors.sport_id = "Seleccione un deporte."
    }

    if (!formData.room_id) {
      nextErrors.room_id = "Seleccione una sala."
    }

    if (!formData.coach_id) {
      nextErrors.coach_id = "Seleccione un coach."
    }

    if (formData.observation.length > 255) {
      nextErrors.observation = "Máximo 255 caracteres."
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
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id),
      observation: formData.observation.trim() || null,
      status: formData.status,
    })
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedItem ? "Editar Asignación" : "Nueva Asignación"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Select
              name="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              isInvalid={Boolean(errors.sport_id)}
            >
              <option value="">Seleccionar deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.sport_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              isInvalid={Boolean(errors.room_id)}
            >
              <option value="">Seleccionar sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              isInvalid={Boolean(errors.coach_id)}
            >
              <option value="">Seleccionar coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.full_name} ({coach.email})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.coach_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              isInvalid={Boolean(errors.observation)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.observation}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="switch"
              id="sport-room-status"
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

export default SportRoomFormModal
