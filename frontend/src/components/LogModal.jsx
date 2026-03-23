import { useState } from 'react'
import { postWorkoutLog } from '../services/api'
import { useTheme } from '../ThemeContext'

export default function LogModal({ workout, membershipId, onClose, onSuccess }) {
  const T = useTheme()
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const overlay = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  }
  const modal = {
    backgroundColor: T.card, borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '440px', border: `1px solid ${T.border}`,
    display: 'flex', flexDirection: 'column', gap: '20px'
  }
  const inputStyle = {
    width: '100%', padding: '12px 14px', backgroundColor: T.input,
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
  const successBox = {
    color: T.success, fontSize: '14px', textAlign: 'center',
    padding: '14px', backgroundColor: T.successDim,
    border: `1px solid ${T.successBorder}`, borderRadius: '8px'
  }
  const errorBox = {
    color: T.red, fontSize: '13px', padding: '10px 14px',
    backgroundColor: T.redDim, border: `1px solid ${T.red}44`, borderRadius: '8px'
  }

  const effectiveMembershipId = membershipId || parseInt(localStorage.getItem('membership_id')) || null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!effectiveMembershipId) {
      setError('No membership found. Please create a membership first.')
      return
    }
    if (!duration || parseInt(duration) <= 0) {
      setError('Please enter a valid duration.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const today = new Date().toISOString().split('T')[0]
      const payload = {
        membership_id: effectiveMembershipId,
        workout_id: workout.workout_id,
        log_date: today,
        duration_minutes: parseInt(duration),
        calories_burned: 0,
        notes: notes || null
      }
      await postWorkoutLog(payload)
      setSuccess(true)
      setTimeout(() => { onSuccess() }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to log workout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: T.text }}>
            Log Workout
          </div>
          <div style={{ fontSize: '14px', color: T.mutedDark, marginTop: '4px' }}>
            {workout.workout_name}
          </div>
          {effectiveMembershipId ? (
            <div style={{ fontSize: '12px', color: T.mutedDark, marginTop: '4px' }}>
              Membership #{effectiveMembershipId}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: T.pink, marginTop: '6px' }}>
              ⚠️ No active membership found. Please create a membership before logging a workout.
            </div>
          )}
        </div>

        {success ? (
          <div style={successBox}>✅ Workout logged successfully! Streak updated.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Duration (minutes)</label>
              <input
                type="number" min="1" style={inputStyle}
                value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 45" required
              />
            </div>
            <div>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="How did it go?"
              />
            </div>

            {error && <div style={errorBox}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" style={cancelBtn} onClick={onClose}>Cancel</button>
              <button type="submit" style={submitBtn} disabled={loading}>
                {loading ? 'Logging...' : 'Log Workout'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
