import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

 const handleSubmit = async (event) => {
  event.preventDefault()

  setError("")

  if (!email.trim()) {
    setError("Debe ingresar un correo.")
    return
  }

  const emailRegex = /\S+@\S+\.\S+/

  if (!emailRegex.test(email)) {
    setError("Ingrese un correo válido.")
    return
  }

  if (!password.trim()) {
    setError("Debe ingresar una contraseña.")
    return
  }

  setLoading(true)

  try {

    const data = await loginUser({
      email: email.trim(),
      password,
    })

    saveSession(
      data.data.token,
      data.data.user
    )

    if (data.data.user.role === "admin") {

      navigate("/admin/dashboard")

    } else if (
      data.data.user.role === "coach"
    ) {

      navigate("/coach/dashboard")

    } else {

      navigate("/user/dashboard")
    }

  } catch (loginError) {

    setError(loginError.message)

  } finally {

    setLoading(false)
  }
}
