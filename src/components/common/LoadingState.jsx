import { Spinner } from "react-bootstrap"

function LoadingState({ message = "Cargando..." }) {
  return (
    <div className="users-dashboard-state">
      <Spinner animation="border" />
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
