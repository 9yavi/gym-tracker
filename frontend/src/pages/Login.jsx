import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getUsers, getMemberships } from '../services/api'
import { useTheme, useThemeToggle, useThemeMode } from '../ThemeContext'

export default function Login() {
  const T = useTheme()
  const toggle = useThemeToggle()
  const mode = useThemeMode()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      maxWidth: '400px',
      border: `1px solid ${T.border}`
    },
    logo: { textAlign: 'center', marginBottom: '32px' },
    logoIcon: { fontSize: '36px' },
    logoText: { fontSize: '22px', fontWeight: '700', color: T.primary, marginTop: '6px' },
    subtitle: { fontSize: '13px', color: T.mutedDark, marginTop: '4px' },
    label: { display: 'block', fontSize: '13px', color: T.muted, marginBottom: '6px' },
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
      color: T.red,
      fontSize: '13px',
      marginBottom: '12px',
      padding: '10px 14px',
      backgroundColor: T.redDim,
      border: `1px solid ${T.red}44`,
      borderRadius: '8px'
    },
    link: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: T.mutedDark },
    linkA: { color: T.pink, textDecoration: 'none', fontWeight: '600' },
    themeBtn: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      padding: '7px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      border: `1px solid ${T.border}`,
      background: T.card,
      color: T.text
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      const users = await getUsers()
      const me = users.find(u => u.email === email)
      if (!me) throw new Error('User not found')

      localStorage.setItem('user_id', me.user_id)
      localStorage.setItem('user_email', me.email)
      localStorage.setItem('user_name', me.full_name || me.username)

      const memberships = await getMemberships()
      const myMembership = memberships.find(m => m.user_id === me.user_id)
      if (myMembership) {
        localStorage.setItem('membership_id', myMembership.membership_id)
        navigate('/dashboard')
      } else {
        localStorage.removeItem('membership_id')
        navigate('/create-membership')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ ...s.page, position: 'relative' }}>
      <button style={s.themeBtn} onClick={toggle} title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
        {mode === 'dark' ? '☀️' : '🌙'}
      </button>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoIcon}>💪</div>
          <div style={s.logoText}>GymTracker</div>
          <div style={s.subtitle}>Track your workouts, build your streak</div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required autoComplete="email" />

          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password" />

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={s.link}>
          No account?{' '}
          <Link to="/register" style={s.linkA}>Create one</Link>
        </div>
      </div>
    </div>
  )
}
