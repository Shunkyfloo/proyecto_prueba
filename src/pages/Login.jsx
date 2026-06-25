import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      saveSession(data.data.token, data.data.user)

      if (data.data.user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (data.data.user.role === "coach") {
        navigate("/coach/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    } catch (loginError) {
      setError(loginError.message)
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
              SportClub Login
            </Card.Title>
            {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="auth-btn w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
            <p className="text-center mb-0 auth-footer-text">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="auth-link">Registrarse</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
  )
}

export default Login
