import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

const initialForm = {
  full_name: "",
  email: "",
  role: "user",
  password: "",
}

function UserFormModal({
  show,
  handleClose,
  handleSave,
  selectedUser,
}) {

  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {

    if (selectedUser) {

      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        password: "",
      })

    } else {

      setFormData(initialForm)

    }

    setErrors({})

  }, [selectedUser, show])

  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const validate = () => {

    const nextErrors = {}

    if (!formData.full_name.trim()) {

      nextErrors.full_name =
        "El nombre es obligatorio."

    } else if (
      formData.full_name.trim().length < 3
    ) {

      nextErrors.full_name =
        "Debe tener al menos 3 caracteres."
    }

    if (!formData.email.trim()) {

      nextErrors.email =
        "El correo es obligatorio."

    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {

      nextErrors.email =
        "Ingrese un correo válido."
    }

    if (
      !selectedUser &&
      formData.password.length < 8
    ) {

      nextErrors.password =
        "La contraseña debe tener mínimo 8 caracteres."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = (event) => {

    event.preventDefault()

    if (!validate()) return

    handleSave({
      ...formData,
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
    })
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title>
          {selectedUser
            ? "Editar Usuario"
            : "Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>

        <Modal.Body>

          <Form.Group className="mb-3">
            <Form.Label>
              Nombre Completo
            </Form.Label>

            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              isInvalid={!!errors.full_name}
            />

            <Form.Control.Feedback type="invalid">
              {errors.full_name}
            </Form.Control.Feedback>

          </Form.Group>

          <Form.Group className="mb-3">

            <Form.Label>
              Correo
            </Form.Label>

            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>

          </Form.Group>

          {!selectedUser && (

            <Form.Group className="mb-3">

              <Form.Label>
                Contraseña
              </Form.Label>

              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />

              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>

            </Form.Group>

          )}

          <Form.Group className="mb-3">

            <Form.Label>
              Rol
            </Form.Label>

            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">
                Usuario
              </option>

              <option value="coach">
                Coach
              </option>

              <option value="admin">
                Administrador
              </option>

            </Form.Select>

          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            className="theme-btn-outline"
            onClick={handleClose}
          >
            Cancelar
          </Button>

          <Button
            className="theme-btn"
            type="submit"
          >
            Guardar
          </Button>

        </Modal.Footer>

      </Form>

    </Modal>
  )
}

export default UserFormModal