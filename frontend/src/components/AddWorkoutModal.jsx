import { useState, useEffect } from 'react'
import { createWorkout, getSports } from '../services/api'
import { useTheme } from '../ThemeContext'

export default function AddWorkoutModal({ onClose, onSuccess }) {
  const T = useTheme()
  const [sports, setSports] = useState([])
  const [form, setForm] = useState({
    workout_name: '',
    difficulty_level: 'beginner',
    sport_id: '',
    estimated_duration_minutes: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const overlay = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  }
  const modal = {
    backgroundColor: T.card, borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '480px', border: `1px solid ${T.border}`,
    display: 'flex', flexDirection: 'column', gap: '18px'
  }
  const inputStyle = {
    width: '100%', padding: '11px 13px', backgroundColor: T.input,
    border: `1px solid ${T.border}`, borderRadius: '8px', color: T.text,
    fontSize: '14px', outline: 'none'
  }
  const labelStyle = { fontSize: '13px', color: T.muted, marginBottom: '6px', display: 'block' }
  const submitBtn = {
    flex: 1, padding: '12px',
    background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  }
  const cancelBtn = {
    flex: 1, padding: '12px', backgroundColor: 'transparent',
    color: T.muted, border: `1px solid ${T.border}`, borderRadius: '8px',
    fontSize: '14px', fontWeight: '500', cursor: 'pointer'
  }
  const errorBox = {
    color: T.red, fontSize: '13px', padding: '10px 14px',
    backgroundColor: T.redDim, border: `1px solid ${T.red}44`, borderRadius: '8px'
  }

  useEffect(() => {
    getSports()
      .then(data => {
        setSports(data)
        if (data.length > 0) setForm(f => ({ ...f, sport_id: data[0].sport_id }))
      })
      .catch(() => setError('Could not load sports'))
  }, [])

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.workout_name.trim()) { setError('Workout name is required'); return }
    if (!form.sport_id) { setError('Please select a sport'); return }
    setLoading(true)
    setError('')
    try {
      const payload = {
        workout_name: form.workout_name.trim(),
        difficulty_level: form.difficulty_level,
        sport_id: parseInt(form.sport_id),
        estimated_duration_minutes: form.estimated_duration_minutes
          ? parseInt(form.estimated_duration_minutes) : null,
        description: form.description.trim() || null
      }
      const result = await createWorkout(payload)
      onSuccess(result)
    } catch (err) {
      setError(err.message || 'Failed to create workout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: T.text }}>
            Add New Workout
          </div>
          <div style={{ fontSize: '13px', color: T.mutedDark, marginTop: '4px' }}>
            Will appear here and in Swagger instantly
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Workout Name *</label>
            <input style={inputStyle} name="workout_name" value={form.workout_name}
              onChange={handle} placeholder="e.g. Push Day" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Difficulty *</label>
              <select style={inputStyle} name="difficulty_level" value={form.difficulty_level} onChange={handle}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Duration (min)</label>
              <input style={inputStyle} type="number" min="1" name="estimated_duration_minutes"
                value={form.estimated_duration_minutes} onChange={handle} placeholder="e.g. 60" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Sport *</label>
            <select style={inputStyle} name="sport_id" value={form.sport_id} onChange={handle} required>
              {sports.map(s => (
                <option key={s.sport_id} value={s.sport_id}>
                  {s.sport_name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
              name="description" value={form.description} onChange={handle}
              placeholder="Describe this workout..." />
          </div>

          {error && <div style={errorBox}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" style={cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={submitBtn} disabled={loading || sports.length === 0}>
              {loading ? 'Adding...' : 'Add Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
