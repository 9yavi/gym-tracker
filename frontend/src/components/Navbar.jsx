import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme, useThemeToggle, useThemeMode } from '../ThemeContext'

export default function Navbar() {
  const T = useTheme()
  const toggle = useThemeToggle()
  const mode = useThemeMode()
  const navigate = useNavigate()
  const location = useLocation()
  const userName = localStorage.getItem('user_name') || ''
  const membershipId = localStorage.getItem('membership_id')

  const s = {
    nav: {
      backgroundColor: T.card,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      borderBottom: `1px solid ${T.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    logo: { fontSize: '18px', fontWeight: '700', color: T.primary, letterSpacing: '-0.5px' },
    links: { display: 'flex', gap: '8px', alignItems: 'center' },
    link: {
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      background: 'transparent',
      color: T.muted
    },
    activeLink: { backgroundColor: T.primaryDim, color: T.primary },
    logoutBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      border: `1px solid ${T.border}`,
      background: 'transparent',
      color: T.muted
    },
    userBadge: {
      fontSize: '12px',
      color: T.mutedDark,
      padding: '4px 10px',
      borderRadius: '20px',
      backgroundColor: T.bg,
      border: `1px solid ${T.border}`
    },
    themeBtn: {
      padding: '7px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      border: `1px solid ${T.border}`,
      background: T.cardAlt,
      color: T.text,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      lineHeight: 1
    }
  }

  function handleLogout() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    localStorage.removeItem('membership_id')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={s.nav}>
      <span style={s.logo}>💪 GymTracker</span>
      <div style={s.links}>
        {userName && (
          <span style={s.userBadge}>
            {userName} {membershipId ? `· #${membershipId}` : ''}
          </span>
        )}
        <button style={{ ...s.link, ...(isActive('/dashboard') ? s.activeLink : {}) }}
          onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
        <button style={{ ...s.link, ...(isActive('/workouts') ? s.activeLink : {}) }}
          onClick={() => navigate('/workouts')}>
          Workouts
        </button>
        <button style={s.themeBtn} onClick={toggle} title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {mode === 'dark' ? '☀️' : '🌙'}
        </button>
        <button style={s.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
