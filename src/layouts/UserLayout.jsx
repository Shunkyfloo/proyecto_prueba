import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { getUser, logout } from "../services/authService"

function UserLayout() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>SportClub Usuario</Navbar.Brand>
          <Nav className="me-auto">
            <Link className="nav-link" to="/user/dashboard">
              Dashboard
            </Link>
          </Nav>
          <span className="text-white me-3">
            {user?.full_name || user?.name}
          </span>
          <Button variant="outline-light" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  )
}

export default UserLayout
