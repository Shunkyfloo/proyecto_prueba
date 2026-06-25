import { Form } from "react-bootstrap"

const emptyPlan = {
  objectives: "",
  routine: "",
  notes: "",
}

function ClientDetailPanel({ client, onSave, saving }) {
  const plan = client.coachPlan || emptyPlan

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    onSave({
      objectives: formData.get("objectives"),
      routine: formData.get("routine"),
      notes: formData.get("notes"),
    })
  }

  return (
    <div className="coach-client-detail">
      <div className="coach-client-detail-header">
        <h2>{client.full_name || client.name}</h2>
        <span className="coach-client-badge">Cliente</span>
      </div>

      <section className="coach-client-section">
        <h3>Datos del cliente</h3>
        <dl className="coach-client-data">
          <div>
            <dt>Nombre</dt>
            <dd>{client.full_name || client.name}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{client.email}</dd>
          </div>
          <div>
            <dt>Empresa / Club</dt>
            <dd>{client.company}</dd>
          </div>
        </dl>
      </section>

      <section className="coach-client-section">
        <h3>Plan asignado al cliente</h3>
        <p className="coach-client-section-desc">
          Define qué debe hacer el usuario: objetivos, rutina y observaciones.
        </p>

        <Form
          key={`${client.id}-${plan.updatedAt || "new"}`}
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3">
            <Form.Label>Objetivos</Form.Label>
            <Form.Control
              as="textarea"
              name="objectives"
              rows={3}
              defaultValue={plan.objectives}
              placeholder="Ej: Mejorar resistencia cardiovascular y bajar 3 kg en 8 semanas."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rutina / Qué debe hacer</Form.Label>
            <Form.Control
              as="textarea"
              name="routine"
              rows={5}
              defaultValue={plan.routine}
              placeholder="Ej: Lunes y miércoles cardio 30 min. Martes y jueves fuerza (piernas y core)."
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Notas del coach</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              rows={3}
              defaultValue={plan.notes}
              placeholder="Ej: Evitar impacto fuerte en rodilla derecha. Hidratación antes de cada sesión."
            />
          </Form.Group>

          {plan.updatedAt && (
            <p className="coach-client-updated">
              Última actualización:{" "}
              {new Date(plan.updatedAt).toLocaleString("es-CL")}
            </p>
          )}

          <button
            type="submit"
            className="welcome-btn welcome-btn-primary"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar plan del cliente"}
          </button>
        </Form>
      </section>
    </div>
  )
}

export default ClientDetailPanel
