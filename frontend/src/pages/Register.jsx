import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { useTheme, useThemeToggle, useThemeMode } from '../ThemeContext'

export default function Register() {
  const T = useTheme()
  const toggle = useThemeToggle()
  const mode = useThemeMode()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    gender: 'male'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone || null,
        gender: form.gender || null,
        date_of_birth: null // 🔥 شلنا المشكلة بالكامل
      }

      console.log("PAYLOAD:", payload)

      await register(payload)

      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      console.log("FULL ERROR:", err)

      if (err.response?.data) {
        const data = err.response.data

        if (Array.isArray(data.detail)) {
          const messages = data.detail.map(e => e.msg).join(" | ")
          setError(messages)
        } else {
          setError(data.detail || "Error")
        }

      } else {
        setError(err.message)
      }

    } finally {
      setLoading(false)
    }
  }

  const s = {
    page: {
      minHeight: '100vh',
      backgroundColor: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    card: {
      backgroundColor: T.card,
      borderRadius: '16px',
      padding: '40px 36px',
      width: '100%',
      maxWidth: '420px',
      border: `1px solid ${T.border}`
    },
    input: {
      width: '100%',
      padding: '11px 13px',
      backgroundColor: T.input,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      color: T.text,
      fontSize: '14px',
      outline: 'none',
      marginBottom: '14px'
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    btn: {
      width: '100%',
      padding: '12px',
      background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '8px'
    },
    error: {
      color: 'red',
      marginBottom: '10px'
    },
    success: {
      color: 'green',
      marginBottom: '10px'
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div style={s.row}>
            <input style={s.input} name="username"
              value={form.username} onChange={handle} placeholder="Username" required />

            <input style={s.input} name="full_name"
              value={form.full_name} onChange={handle} placeholder="Full Name" required />
          </div>

          <input style={s.input} name="email"
            value={form.email} onChange={handle} placeholder="Email" required />

          <input style={s.input} type="password" name="password"
            value={form.password} onChange={handle} placeholder="Password" required />

          <div style={s.row}>
            <input style={s.input} name="phone"
              value={form.phone} onChange={handle} placeholder="Phone" />

            <select style={s.input} name="gender"
              value={form.gender} onChange={handle}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {error && <div style={s.error}>{error}</div>}
          {success && <div style={s.success}>{success}</div>}

          <button style={s.btn} type="submit">
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p style={{ marginTop: '10px' }}>
          <Link to="/login">Go to Login</Link>
        </p>
      </div>
    </div>
  )
}
