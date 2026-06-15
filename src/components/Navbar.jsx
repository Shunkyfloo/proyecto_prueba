import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="home-nav">
      <Link to="/">Inicio</Link> | <Link to="/login">Login</Link>
    </nav>
  )
}

export default Navbar
