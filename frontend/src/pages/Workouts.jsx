import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import WorkoutCard from '../components/WorkoutCard'
import LogModal from '../components/LogModal'
import AddWorkoutModal from '../components/AddWorkoutModal'
import { getWorkouts } from '../services/api'
import { useTheme } from '../ThemeContext'

export default function Workouts() {
  const T = useTheme()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState('')
  const navigate = useNavigate()

  const userId = localStorage.getItem('user_id')
  const membershipId = localStorage.getItem('membership_id')

  const s = {
    page: { minHeight: '100vh', backgroundColor: T.bg, color: T.text },
    content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
    headerRow: {
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: '32px', gap: '16px'
    },
    title: { fontSize: '26px', fontWeight: '700', color: T.text },
    subtitle: { fontSize: '14px', color: T.mutedDark, marginTop: '4px' },
    actions: { display: 'flex', gap: '10px', flexShrink: 0 },
    addBtn: {
      padding: '10px 18px',
      background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
      color: 'white', border: 'none', borderRadius: '8px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
    },
    refreshBtn: {
      padding: '10px 14px', backgroundColor: 'transparent',
      color: T.muted, border: `1px solid ${T.border}`,
      borderRadius: '8px', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px'
    },
    empty: {
      color: T.mutedDark, fontSize: '14px', textAlign: 'center',
      padding: '64px 32px', backgroundColor: T.card,
      borderRadius: '12px', border: `1px solid ${T.border}`
    },
    errorBox: {
      color: T.red, fontSize: '14px', textAlign: 'center',
      padding: '32px', backgroundColor: T.card,
      borderRadius: '12px', border: `1px solid ${T.red}44`
    },
    loading: { textAlign: 'center', padding: '80px 32px', color: T.mutedDark },
    noMembership: {
      backgroundColor: T.card, border: `1px solid ${T.pink}44`,
      borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
    },
    noMembershipText: { color: T.pink, fontSize: '14px' },
    noMembershipBtn: {
      padding: '8px 16px',
      background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
      color: 'white', border: 'none', borderRadius: '8px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
    },
    toast: {
      position: 'fixed', bottom: '24px', right: '24px',
      backgroundColor: T.card, border: `1px solid ${T.primary}`,
      borderRadius: '10px', padding: '14px 20px',
      color: T.text, fontSize: '14px', fontWeight: '500',
      zIndex: 999, boxShadow: `0 4px 24px ${T.primary}33`
    }
  }

  const loadWorkouts = useCallback(() => {
    setLoading(true)
    setError(null)
    getWorkouts()
      .then(data => setWorkouts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    loadWorkouts()
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function handleWorkoutAdded(newWorkout) {
    setWorkouts(prev => [...prev, newWorkout])
    setShowAddModal(false)
    showToast(`✅ "${newWorkout.workout_name}" added — visible in Swagger now!`)
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.headerRow}>
          <div>
            <div style={s.title}>Workouts</div>
            <div style={s.subtitle}>
              {loading
                ? 'Loading...'
                : `${workouts.length} workout${workouts.length !== 1 ? 's' : ''} — live from the database`}
            </div>
          </div>
          <div style={s.actions}>
            <button style={s.refreshBtn} onClick={loadWorkouts} title="Reload from server">
              ↻ Refresh
            </button>
            <button style={s.addBtn} onClick={() => setShowAddModal(true)}>
              + Add Workout
            </button>
          </div>
        </div>

        {!membershipId && (
          <div style={s.noMembership}>
            <div style={s.noMembershipText}>
              ⚠️ You need a membership to log workouts.
            </div>
            <button style={s.noMembershipBtn} onClick={() => navigate('/create-membership')}>
              Create Membership
            </button>
          </div>
        )}

        {loading && <div style={s.loading}>Loading workouts from database...</div>}
        {!loading && error && <div style={s.errorBox}>Failed to load: {error}</div>}
        {!loading && !error && workouts.length === 0 && (
          <div style={s.empty}>
            No workouts in the database yet. Add one using the button above, or via Swagger.
          </div>
        )}
        {!loading && !error && workouts.length > 0 && (
          <div style={s.grid}>
            {workouts.map(w => (
              <WorkoutCard key={w.workout_id} workout={w} onLog={setSelectedWorkout} />
            ))}
          </div>
        )}
      </div>

      {selectedWorkout && (
        <LogModal
          workout={selectedWorkout}
          membershipId={membershipId ? parseInt(membershipId) : null}
          onClose={() => setSelectedWorkout(null)}
          onSuccess={() => {
            setSelectedWorkout(null)
            navigate('/dashboard')
          }}
        />
      )}

      {showAddModal && (
        <AddWorkoutModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleWorkoutAdded}
        />
      )}

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  )
}
