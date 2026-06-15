import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { registerUser, saveSession } from "../services/authService"

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

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const data = await registerUser({ full_name: fullName, email, password })
      saveSession(data.data.token, data.data.user)
      navigate("/user/dashboard")
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "26rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Crear cuenta</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repita su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
            <p className="text-center mb-0">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Iniciar sesión</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register
