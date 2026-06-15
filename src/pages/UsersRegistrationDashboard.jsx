import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Spinner } from "react-bootstrap"
import UserCard from "../components/UserCard"
import { getRegisteredUsers, getUsers } from "../services/userService"

function UsersRegistrationDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUsers() {
      try {
        const [apiUsers, localUsers] = await Promise.all([
          getUsers(),
          Promise.resolve(getRegisteredUsers()),
        ])

        const normalizedApiUsers = Array.isArray(apiUsers) ? apiUsers : []
        const allUsers = [...localUsers, ...normalizedApiUsers]

        setUsers(allUsers)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return (
    <div className="users-dashboard">
      <header className="users-dashboard-header">
        <div>
          <Link to="/" className="users-dashboard-logo">
            SportClub
          </Link>
          <h1>Dashboard de registros de usuarios</h1>
          <p>Consulta los usuarios registrados en la plataforma.</p>
        </div>
        <Link to="/comenzar" className="welcome-btn welcome-btn-primary">
          Acceder
        </Link>
      </header>

      {loading && (
        <div className="users-dashboard-state">
          <Spinner animation="border" variant="primary" />
          <p>Cargando registros...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="users-dashboard-alert">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <p className="users-dashboard-count">
            {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
          </p>
          <div className="users-dashboard-grid">
            {users.map((user) => (
              <UserCard key={user.id || user.email} user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default UsersRegistrationDashboard
