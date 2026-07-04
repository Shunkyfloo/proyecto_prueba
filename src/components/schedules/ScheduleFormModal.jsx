import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { formatDayOfWeek } from "../../utils/scheduleFormat"

const initialForm = {
  sport_room_id: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
  status: true,
}

const DAYS = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
]

function ScheduleFormModal({
  show,
  handleClose,
  handleSave,
  selectedSchedule,
  sportRooms,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedSchedule) {
      setFormData({
        sport_room_id: String(
          selectedSchedule.sport_room_id ?? selectedSchedule.sportRoom?.id ?? "",
        ),
        day_of_week: String(selectedSchedule.day_of_week ?? ""),
        start_time: selectedSchedule.start_time?.slice(0, 5) || "",
        end_time: selectedSchedule.end_time?.slice(0, 5) || "",
        status: selectedSchedule.status ?? true,
      })
    } else {
      setFormData(initialForm)
    }
    setErrors({})
  }, [selectedSchedule, show])

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

    if (!formData.sport_room_id) {
      nextErrors.sport_room_id = "Seleccione una asignación."
    }

    if (!formData.day_of_week) {
      nextErrors.day_of_week = "Seleccione un día."
    }

    if (!formData.start_time) {
      nextErrors.start_time = "Ingrese hora de inicio."
    }

    if (!formData.end_time) {
      nextErrors.end_time = "Ingrese hora de término."
    }

    if (
      formData.start_time &&
      formData.end_time &&
      formData.start_time >= formData.end_time
    ) {
      nextErrors.end_time = "La hora de término debe ser posterior al inicio."
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
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
    })
  }

  const getAssignmentLabel = (item) => {
    const sport = item.sport?.name || "Deporte"
    const room = item.room?.name || "Sala"
    return `${sport} · ${room}`
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSchedule ? "Editar Horario" : "Nuevo Horario"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Asignación (Deporte + Sala)</Form.Label>
            <Form.Select
              name="sport_room_id"
              value={formData.sport_room_id}
              onChange={handleChange}
              isInvalid={Boolean(errors.sport_room_id)}
            >
              <option value="">Seleccionar asignación</option>
              {sportRooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {getAssignmentLabel(item)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.sport_room_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              isInvalid={Boolean(errors.day_of_week)}
            >
              <option value="">Seleccionar día</option>
              {DAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.day_of_week}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Hora inicio</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.start_time)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.start_time}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Hora término</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.end_time)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.end_time}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {formData.day_of_week && formData.start_time && formData.end_time && (
            <p className="schedule-preview">
              Vista previa: {formatDayOfWeek(formData.day_of_week)}{" "}
              {formData.start_time} - {formData.end_time}
            </p>
          )}

          <Form.Group>
            <Form.Check
              type="switch"
              id="schedule-status"
              name="status"
              label={formData.status ? "Activo" : "Inactivo"}
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

export default ScheduleFormModal
