import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap"

import {
  registerUser,
  saveSession,
} from "../services/authService"

function Register() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    if (!fullName.trim()) {
      setError("Debe ingresar un nombre.")
      return
    }

    if (fullName.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.")
      return
    }

    const emailRegex = /\S+@\S+\.\S+/

    if (!emailRegex.test(email)) {
      setError("Ingrese un correo válido.")
      return
    }

    if (!password.trim()) {
      setError("Debe ingresar una contraseña.")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    try {
      const data = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      })

      saveSession(
        data.data.token,
        data.data.user
      )

      navigate("/user/dashboard")

    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-overlay" />

      <Container className="auth-page-container d-flex justify-content-center align-items-center min-vh-100">

        <Card className="auth-card shadow-lg">

          <Card.Body>

            <Card.Title className="auth-card-title text-center mb-4">
              Crear Cuenta
            </Card.Title>

            {error && (
              <Alert
                variant="danger"
                className="auth-alert"
              >
                {error}
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              <Form.Group className="mb-3">
                <Form.Label>
                  Nombre Completo
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Correo
                </Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Contraseña
                </Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Confirmar Contraseña
                </Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Repita su contraseña"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-btn w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      size="sm"
                      animation="border"
                    />
                    {" "}
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>

              <p className="text-center mb-0 auth-footer-text">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="auth-link"
                >
                  Iniciar sesión
                </Link>
              </p>

            </Form>

          </Card.Body>

        </Card>

      </Container>
    </div>
  )
}

export default Register