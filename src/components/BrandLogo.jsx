import { Link } from "react-router-dom"
import logoSportclub from "../assets/logo-sportclub.png"

function BrandLogo({ to = "/", className = "", size = "md" }) {
  const image = (
    <img
      src={logoSportclub}
      alt="SportClub"
      className={`brand-logo brand-logo--${size} ${className}`.trim()}
    />
  )

  if (to) {
    return (
      <Link to={to} className="brand-logo-link">
        {image}
      </Link>
    )
  }

  return image
}

export default BrandLogo
