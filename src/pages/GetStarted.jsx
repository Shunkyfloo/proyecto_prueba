import { Link } from "react-router-dom"

function GetStarted() {
  return (
    <div className="welcome-page">
      <div className="welcome-overlay" />

      <header className="welcome-header">
        <Link to="/" className="welcome-logo">
          SportClub
        </Link>
      </header>

      <main className="welcome-main">
        <p className="welcome-badge">Únete al club</p>
        <h1 className="welcome-title">
          ¿Cómo quieres <span>continuar</span>?
        </h1>
        <p className="welcome-text">
          Elige si ya tienes una cuenta o si deseas crear una nueva para empezar
          a entrenar con SportClub.
        </p>

        <div className="welcome-actions">
          <Link to="/login" className="welcome-btn welcome-btn-primary">
            Iniciar sesión
          </Link>
          <Link to="/registro" className="welcome-btn welcome-btn-secondary">
            Registrarse
          </Link>
        </div>
      </main>
    </div>
  )
}

export default GetStarted
