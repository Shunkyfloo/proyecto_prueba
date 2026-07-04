import { useEffect, useState } from "react"
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import DashboardNav from "../components/layout/DashboardNav"
import PageHeader from "../components/layout/PageHeader"
import { ADMIN_NAV, COACH_NAV, USER_NAV } from "../config/navigation"
import {
  changePassword,
  getMe,
  getUser,
  updateMe,
} from "../services/authService"

function getNavForRole(role) {
  if (role === "admin") {
    return ADMIN_NAV
  }
  if (role === "coach") {
    return COACH_NAV
  }
  return USER_NAV
}

function getThemeClass(role) {
  if (role === "admin") {
    return "theme-admin"
  }
  if (role === "coach") {
    return "theme-coach"
  }
  return "theme-user"
}

function ProfilePage() {
  const sessionUser = getUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    birth_date: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe()
        const user = response.data
        setProfile(user)
        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          birth_date: user.birth_date || "",
        })
      } catch (error) {
        Swal.fire("Error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()

    if (!formData.full_name.trim()) {
      Swal.fire("Validación", "El nombre es obligatorio.", "warning")
      return
    }

    try {
      setSaving(true)
      const response = await updateMe({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        birth_date: formData.birth_date || null,
      })
      setProfile(response.data)
      Swal.fire("Perfil actualizado", "Tus datos se guardaron correctamente.", "success")
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()

    if (passwords.new_password.length < 8) {
      Swal.fire("Validación", "La nueva contraseña debe tener al menos 8 caracteres.", "warning")
      return
    }

    if (passwords.new_password !== passwords.confirm_password) {
      Swal.fire("Validación", "Las contraseñas no coinciden.", "warning")
      return
    }

    try {
      setSaving(true)
      await changePassword(passwords)
      setPasswords({ current_password: "", new_password: "", confirm_password: "" })
      Swal.fire("Contraseña actualizada", "Tu contraseña se cambió correctamente.", "success")
    } catch (error) {
      Swal.fire("Error", error.message, "error")
    } finally {
      setSaving(false)
    }
  }

  const role = sessionUser?.role || profile?.role

  return (
    <div className={`users-dashboard profile-layout-page ${getThemeClass(role)}`}>
      <div className="welcome-overlay" />
      <div className="dashboard-shell">
        <DashboardNav items={getNavForRole(role)} />
        <div className="users-dashboard-content dashboard-main">
          <div className="module-page">
            <PageHeader
              title="Mi perfil"
              subtitle="Consulta y actualiza tu información personal de SportClub."
            />

            {loading ? (
              <div className="users-dashboard-state">
                <Spinner animation="border" />
                <p>Cargando perfil...</p>
              </div>
            ) : (
              <Row className="g-4">
                <Col lg={6}>
                  <Card className="profile-card shadow-sm">
                    <Card.Header>
                      <h4 className="mb-0">Datos personales</h4>
                    </Card.Header>
                    <Card.Body>
                      <p className="profile-role">
                        Rol:{" "}
                        <span className={`users-dashboard-role users-dashboard-role--${role}`}>
                          {role === "admin" ? "Administrador" : role === "coach" ? "Coach" : "Usuario"}
                        </span>
                      </p>
                      <Form onSubmit={handleSaveProfile}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo</Form.Label>
                          <Form.Control
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Correo</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de nacimiento</Form.Label>
                          <Form.Control
                            type="date"
                            name="birth_date"
                            value={formData.birth_date || ""}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                        <Button className="theme-btn" type="submit" disabled={saving}>
                          Guardar cambios
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="profile-card shadow-sm">
                    <Card.Header>
                      <h4 className="mb-0">Cambiar contraseña</h4>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contraseña actual</Form.Label>
                          <Form.Control
                            type="password"
                            name="current_password"
                            value={passwords.current_password}
                            onChange={handlePasswordChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Nueva contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            name="new_password"
                            value={passwords.new_password}
                            onChange={handlePasswordChange}
                            minLength={8}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirmar contraseña</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirm_password"
                            value={passwords.confirm_password}
                            onChange={handlePasswordChange}
                            minLength={8}
                            required
                          />
                        </Form.Group>
                        <Button className="theme-btn-outline" type="submit" disabled={saving}>
                          Actualizar contraseña
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
