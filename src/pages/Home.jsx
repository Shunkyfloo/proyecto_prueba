import { Link } from "react-router-dom"
import BrandLogo from "../components/BrandLogo"

function Home() {
  return (
    <div className="welcome-page">
      <div className="welcome-overlay" />

      <header className="welcome-header">
        <BrandLogo to="/" size="lg" />
      </header>

      <main className="welcome-main">
        <p className="welcome-badge">Tu club, tu ritmo</p>
        <h1 className="welcome-title">
          Bienvenido a <span>SportClub</span>
        </h1>
        <p className="welcome-text">
          Reserva clases, entrena con los mejores coaches y lleva tu rendimiento
          al siguiente nivel desde una sola plataforma.
        </p>

        <div className="welcome-actions">
          <Link to="/comenzar" className="welcome-btn welcome-btn-primary">
            Comenzar ahora
          </Link>
        </div>
      </main>

      <section id="features" className="welcome-features">
        <article className="welcome-feature welcome-feature--user">
          <h3>Usuarios</h3>
          <p>Reserva clases y gestiona tu perfil deportivo.</p>
        </article>
        <article className="welcome-feature welcome-feature--coach">
          <h3>Coaches</h3>
          <p>Organiza horarios, alumnos y entrenamientos.</p>
        </article>
        <article className="welcome-feature welcome-feature--admin">
          <h3>Administración</h3>
          <p>Control total del club en un solo panel.</p>
        </article>
      </section>
    </div>
  )
}

export default Home
