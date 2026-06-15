import { Link } from "react-router-dom"
import { Alert, Button, Container } from "react-bootstrap"

function Unauthorized() {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Alert variant="warning" className="text-center shadow">
        <Alert.Heading>Acceso no autorizado</Alert.Heading>
        <p className="mb-4">No tienes permisos para ver esta página.</p>
        <Button as={Link} to="/login" variant="primary">
          Volver al login
        </Button>
      </Alert>
    </Container>
  )
}

export default Unauthorized
