import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getStreaks, getRankings, getWorkoutLogs, getWorkouts } from '../services/api'
import { useTheme } from '../ThemeContext'

const WEEKLY_GOAL = 5

export default function Dashboard() {
  const T = useTheme()
  const [streaks, setStreaks] = useState([])
  const [rankings, setRankings] = useState([])
  const [logs, setLogs] = useState([])
  const [workoutsMap, setWorkoutsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const userId = parseInt(localStorage.getItem('user_id'))
  const membershipId = parseInt(localStorage.getItem('membership_id'))
  const userName = localStorage.getItem('user_name') || 'Athlete'

  const s = {
    page: { minHeight: '100vh', backgroundColor: T.bg, color: T.text },
    content: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
    header: { marginBottom: '32px' },
    title: { fontSize: '26px', fontWeight: '700', color: T.text },
    subtitle: { fontSize: '14px', color: T.mutedDark, marginTop: '4px' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: T.card,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${T.border}`
    },
    cardLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: T.mutedDark,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '12px'
    },
    cardValue: { fontSize: '32px', fontWeight: '700', color: T.text },
    cardSub: { fontSize: '13px', color: T.mutedDark, marginTop: '4px' },
    progressBar: {
      height: '8px',
      backgroundColor: T.cardAlt,
      borderRadius: '99px',
      marginTop: '16px',
      overflow: 'hidden'
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: T.mutedDark,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '16px'
    },
    logList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    logItem: {
      backgroundColor: T.card,
      borderRadius: '10px',
      padding: '14px 20px',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logDate: { fontSize: '12px', color: T.mutedDark },
    logLabel: { fontSize: '14px', fontWeight: '500', color: T.text, marginTop: '2px' },
    logDuration: { fontSize: '13px', color: T.primary, fontWeight: '600' },
    rankList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    rankItem: {
      backgroundColor: T.card,
      borderRadius: '10px',
      padding: '14px 20px',
      border: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    rankPos: { fontSize: '20px', fontWeight: '700', color: T.yellow, minWidth: '36px' },
    rankInfo: { flex: 1, marginLeft: '12px' },
    rankLabel: { fontSize: '13px', color: T.muted },
    rankScore: { fontSize: '13px', color: T.pink, fontWeight: '600' },
    empty: {
      color: T.mutedDark,
      fontSize: '14px',
      textAlign: 'center',
      padding: '28px',
      backgroundColor: T.card,
      borderRadius: '12px',
      border: `1px solid ${T.border}`
    },
    noMembership: {
      backgroundColor: T.card,
      border: `1px solid ${T.pink}44`,
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    },
    noMembershipText: { color: T.pink, fontSize: '14px' },
    noMembershipBtn: {
      padding: '8px 16px',
      background: `linear-gradient(135deg, ${T.primary}, ${T.pink})`,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }

  useEffect(() => {
    if (!userId) { navigate('/login'); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [streakData, rankData, logData, workoutData] = await Promise.all([
        getStreaks(), getRankings(), getWorkoutLogs(), getWorkouts()
      ])
      const wMap = {}
      workoutData.forEach(w => { wMap[w.workout_id] = w.workout_name })
      setWorkoutsMap(wMap)
      setStreaks(streakData)
      setRankings(rankData)
      setLogs(logData)
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const myStreaks  = membershipId ? streaks.filter(s => s.membership_id === membershipId)   : streaks
  const myRankings = membershipId ? rankings.filter(r => r.membership_id === membershipId) : rankings
  const myLogs     = membershipId ? logs.filter(l => l.membership_id === membershipId)     : logs

  const currentStreak = myStreaks.length > 0 ? Math.max(...myStreaks.map(s => s.current_streak || 0)) : 0
  const longestStreak = myStreaks.length > 0 ? Math.max(...myStreaks.map(s => s.longest_streak || 0)) : 0
  const topRank       = myRankings.length > 0 ? Math.min(...myRankings.map(r => r.rank_position)) : null

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const weeklyLogs  = myLogs.filter(l => l.log_date && new Date(l.log_date) >= oneWeekAgo)
  const weeklyCount = weeklyLogs.length
  const weeklyPct   = Math.min((weeklyCount / WEEKLY_GOAL) * 100, 100)

  const lastThreeLogs = [...myLogs]
    .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
    .slice(0, 3)

  if (loading) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center', color: T.mutedDark }}>
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <div style={s.title}>Welcome back, {userName} 👋</div>
          <div style={s.subtitle}>Here's your fitness overview</div>
        </div>

        {!membershipId && (
          <div style={s.noMembership}>
            <div style={s.noMembershipText}>
              ⚠️ You don't have an active membership yet. Create one to start logging workouts and tracking streaks.
            </div>
            <button style={s.noMembershipBtn} onClick={() => navigate('/create-membership')}>
              Create Membership
            </button>
          </div>
        )}

        <div style={s.grid}>
          <div style={s.card}>
            <div style={s.cardLabel}>Current Streak</div>
            <div style={s.cardValue}><span style={{ color: T.red }}>🔥</span> {currentStreak}</div>
            <div style={s.cardSub}>{currentStreak === 1 ? 'day' : 'days'} in a row</div>
          </div>

          <div style={s.card}>
            <div style={s.cardLabel}>Longest Streak</div>
            <div style={s.cardValue}><span style={{ color: T.pink }}>⚡</span> {longestStreak}</div>
            <div style={s.cardSub}>personal best</div>
          </div>

          <div style={s.card}>
            <div style={s.cardLabel}>Ranking</div>
            <div style={s.cardValue}>
              {topRank !== null
                ? <><span style={{ color: T.yellow }}>🏆</span> #{topRank}</>
                : <span style={{ fontSize: '18px', color: T.mutedDark }}>—</span>
              }
            </div>
            <div style={s.cardSub}>{topRank !== null ? 'your rank' : 'log workouts to rank'}</div>
          </div>

          <div style={s.card}>
            <div style={s.cardLabel}>Weekly Progress</div>
            <div style={s.cardValue}>
              <span style={{ color: T.primary }}>{weeklyCount}</span>
              <span style={{ fontSize: '18px', color: T.mutedDark }}> / {WEEKLY_GOAL}</span>
            </div>
            <div style={s.cardSub}>workouts this week</div>
            <div style={s.progressBar}>
              <div style={{
                height: '100%',
                width: `${weeklyPct}%`,
                background: `linear-gradient(90deg, ${T.primary}, ${T.pink})`,
                borderRadius: '99px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={s.sectionTitle}>Recent Workouts</div>
          {lastThreeLogs.length === 0 ? (
            <div style={s.empty}>No workouts logged yet — head to Workouts to get started!</div>
          ) : (
            <div style={s.logList}>
              {lastThreeLogs.map((log, i) => (
                <div key={log.log_id || i} style={s.logItem}>
                  <div>
                    <div style={s.logDate}>{log.log_date}</div>
                    <div style={s.logLabel}>
                      {workoutsMap[log.workout_id]
                        ? workoutsMap[log.workout_id]
                        : log.notes
                          ? `"${log.notes}"`
                          : `Workout #${log.workout_id}`}
                    </div>
                    {log.notes && workoutsMap[log.workout_id] && (
                      <div style={{ fontSize: '12px', color: T.mutedDark, marginTop: '2px' }}>
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                  <div style={s.logDuration}>{log.duration_minutes} min</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {myRankings.length > 0 && (
          <div>
            <div style={s.sectionTitle}>Your Rankings</div>
            <div style={s.rankList}>
              {myRankings.slice(0, 5).map((r, i) => (
                <div key={r.ranking_id || i} style={s.rankItem}>
                  <div style={s.rankPos}>#{r.rank_position}</div>
                  <div style={s.rankInfo}>
                    <div style={s.rankLabel}>{r.period_type} · {r.period_start} → {r.period_end}</div>
                  </div>
                  <div style={s.rankScore}>{r.score} pts · {r.ranking_percent}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
