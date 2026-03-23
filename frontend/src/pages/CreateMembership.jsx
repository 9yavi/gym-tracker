import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBranches, createMembership } from '../services/api'
import { useTheme } from '../ThemeContext'

export default function CreateMembership() {
  const T = useTheme()
  const navigate = useNavigate()
  const userId = parseInt(localStorage.getItem('user_id'))

  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    branch_id: '',
    membership_type: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      maxWidth: '440px',
      border: `1px solid ${T.border}`
    },
    icon: { textAlign: 'center', marginBottom: '24px' },
    title: { fontSize: '22px', fontWeight: '700', color: T.text, textAlign: 'center' },
    subtitle: { fontSize: '13px', color: T.mutedDark, textAlign: 'center', marginTop: '6px' },
    label: { display: 'block', fontSize: '13px', color: T.muted, marginBottom: '6px', marginTop: '14px' },
    input: {
      width: '100%',
      padding: '11px 13px',
      backgroundColor: T.input,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      color: T.text,
      fontSize: '14px',
      outline: 'none'
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
      marginTop: '24px'
    },
    error: {
      color: T.red,
      fontSize: '13px',
      marginTop: '12px',
      padding: '10px 14px',
      backgroundColor: T.redDim,
      border: `1px solid ${T.red}44`,
      borderRadius: '8px'
    },
    info: {
      fontSize: '13px',
      color: T.muted,
      backgroundColor: T.cardAlt,
      borderRadius: '8px',
      padding: '12px 14px',
      border: `1px solid ${T.border}`,
      marginTop: '16px'
    }
  }

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    getBranches()
      .then(data => {
        setBranches(data)
        if (data.length > 0) setForm(f => ({ ...f, branch_id: data[0].branch_id }))
      })
      .catch(err => setError('Could not load branches: ' + err.message))
  }, [])

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function computeEndDate(startDate, type) {
    const d = new Date(startDate)
    if (type === 'monthly') d.setMonth(d.getMonth() + 1)
    else if (type === 'quarterly') d.setMonth(d.getMonth() + 3)
    else if (type === 'yearly') d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split('T')[0]
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endDate = computeEndDate(form.start_date, form.membership_type)
      const payload = {
        user_id: userId,
        branch_id: parseInt(form.branch_id),
        membership_type: form.membership_type,
        start_date: form.start_date,
        end_date: endDate,
        status: 'active'
      }
      const result = await createMembership(payload)
      localStorage.setItem('membership_id', result.membership_id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}><span style={{ fontSize: '40px' }}>🏋️</span></div>
        <div style={s.title}>Create Membership</div>
        <div style={s.subtitle}>Set up your membership to start tracking</div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Branch</label>
          <select style={s.input} name="branch_id" value={form.branch_id} onChange={handle} required>
            {branches.map(b => (
              <option key={b.branch_id} value={b.branch_id}>{b.branch_name} — {b.city}</option>
            ))}
          </select>

          <label style={s.label}>Membership Type</label>
          <select style={s.input} name="membership_type" value={form.membership_type} onChange={handle}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <label style={s.label}>Start Date</label>
          <input style={s.input} type="date" name="start_date" value={form.start_date} onChange={handle} required />

          <div style={s.info}>
            End date is calculated automatically based on membership type.
          </div>

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Creating...' : 'Activate Membership'}
          </button>
        </form>
      </div>
    </div>
  )
}
