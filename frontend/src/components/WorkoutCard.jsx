import { useTheme } from '../ThemeContext'

export default function WorkoutCard({ workout, onLog }) {
  const T = useTheme()

  const styles = {
    card: {
      backgroundColor: T.card,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    name: { fontSize: '18px', fontWeight: '600', color: T.text },
    meta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    badge: { fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' },
    difficultyBadge: (level) => {
      const isDark = T.bg === '#0d0118'
      const colors = {
        beginner:     isDark ? { bg: '#2e0a4a', color: '#d8b4fe' } : { bg: '#f3e8ff', color: '#7e22ce' },
        intermediate: isDark ? { bg: '#4a0a2e', color: '#f9a8d4' } : { bg: '#fce7f3', color: '#be185d' },
        hard:         isDark ? { bg: '#4a0a0a', color: '#fca5a5' } : { bg: '#fee2e2', color: '#b91c1c' },
      }
      const key = (level || '').toLowerCase()
      const c = colors[key] || { bg: T.cardAlt, color: T.muted }
      return { backgroundColor: c.bg, color: c.color }
    },
    durationBadge: {
      backgroundColor: T.bg === '#0d0118' ? '#1e0a4a' : '#ede9fe',
      color: T.bg === '#0d0118' ? '#c4b5fd' : '#6d28d9'
    },
    description: { fontSize: '13px', color: T.mutedDark, lineHeight: '1.5' },
    btn: {
      marginTop: '4px',
      padding: '10px 0',
      background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.15s ease'
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.name}>{workout.workout_name}</div>
      <div style={styles.meta}>
        <span style={{ ...styles.badge, ...styles.difficultyBadge(workout.difficulty_level) }}>
          {workout.difficulty_level || 'N/A'}
        </span>
        <span style={{ ...styles.badge, ...styles.durationBadge }}>
          ⏱ {workout.estimated_duration_minutes} min
        </span>
      </div>
      {workout.description && (
        <div style={styles.description}>{workout.description}</div>
      )}
      <button
        style={styles.btn}
        onClick={() => onLog(workout)}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        Log Workout
      </button>
    </div>
  )
}
