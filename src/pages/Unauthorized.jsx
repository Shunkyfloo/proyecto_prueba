import { Link } from "react-router-dom"
import { Alert, Button, Container } from "react-bootstrap"

function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <Container className="d-flex justify-content-center align-items-center">
        <Alert variant="warning" className="text-center shadow unauthorized-alert">
          <Alert.Heading>Acceso no autorizado</Alert.Heading>
          <p className="mb-4">No tienes permisos para ver esta página.</p>
          <Button as={Link} to="/login" className="auth-btn">
            Volver al login
          </Button>
        </Alert>
      </Container>
    </div>
  )
}

export default Unauthorized
