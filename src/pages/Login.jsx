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

    if (!email.trim()) {
      setError("Debe ingresar un correo.")
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

    setLoading(true)

    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      })

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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: 480 }}>
        <Card.Body>
          <h3 className="mb-3">Iniciar sesión</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
            </Button>
            <Form.Text className="d-block mt-3">
              ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </Form.Text>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
