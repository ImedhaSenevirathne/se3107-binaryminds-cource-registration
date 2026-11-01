import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageHeader, StatusBadge, CapacityBar, Empty } from '../components/ui'
import { daysUntil, fmtDate } from '../utils'

const Stats = ({ items }) => (
  <div className="panel stat-row">
    {items.map(([label, value]) => (
      <div className="stat" key={label}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    ))}
  </div>
)

function Student() {
  const { state, user, openPeriod, courseByCode } = useApp()
  const mine = state.registrations.filter((r) => r.studentId === user.id)
  const approved = mine.filter((r) => r.status === 'approved')
  const pending = mine.filter((r) => r.status === 'pending')
  const credits = approved.reduce((n, r) => n + courseByCode(r.courseCode).credits, 0)
  const recent = [...mine].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)).slice(0, 5)
  return (
    <>
      <div className={`banner ${openPeriod ? '' : 'closed'}`}>
        <div>
          {openPeriod ? (
            <>
              <h2>Registration is open</h2>
              <p className="muted">{openPeriod.name} · {fmtDate(openPeriod.start)} to {fmtDate(openPeriod.end)} · {daysUntil(openPeriod.end)} days left</p>
            </>
          ) : (
            <>
              <h2>Registration is closed</h2>
              <p className="muted">You can still view your registrations. Watch for the next registration period.</p>
            </>
          )}
        </div>
        <Link className="btn primary" to="/courses">Browse courses</Link>
      </div>
      <div className="section" style={{ marginTop: 20 }}>
        <Stats items={[['Approved courses', approved.length], ['Waiting for approval', pending.length], ['Approved credits', credits]]} />
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Recent registrations</h2><Link to="/registrations">View all</Link></div>
        {recent.length === 0 ? (
          <Empty title="No registrations yet" text="Pick a course to start registering." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Requested</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>{courseByCode(r.courseCode).title}<span className="sub">{r.courseCode}</span></td>
                    <td>{fmtDate(r.requestedAt)}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function Advisor() {
  const { state, user, userById, courseByCode } = useApp()
  const pending = state.registrations.filter((r) => r.status === 'pending').sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))
  const mine = state.registrations.filter((r) => r.decidedBy === user.id)
  return (
    <>
      <Stats items={[['Waiting for your decision', pending.length], ['Approved by you', mine.filter((r) => r.status === 'approved').length], ['Rejected by you', mine.filter((r) => r.status === 'rejected').length]]} />
      <div className="panel">
        <div className="panel-head"><h2>Oldest pending requests</h2><Link to="/approvals">Open approvals</Link></div>
        {pending.length === 0 ? (
          <Empty title="Nothing to review" text="New registrations will appear here." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Course</th><th>Requested</th></tr></thead>
              <tbody>
                {pending.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td>{userById(r.studentId).name}<span className="sub">{userById(r.studentId).universityId}</span></td>
                    <td>{courseByCode(r.courseCode).title}<span className="sub">{r.courseCode}</span></td>
                    <td>{fmtDate(r.requestedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function Staff() {
  const { state, user, approvedCount } = useApp()
  const mine = state.courses.filter((c) => c.department === user.department)
  const fill = (c) => approvedCount(c.code) / c.capacity
  const watch = [...mine].sort((a, b) => fill(b) - fill(a)).slice(0, 5)
  return (
    <>
      <Stats items={[['Courses in your department', mine.length], ['Full courses', mine.filter((c) => fill(c) >= 1).length], ['Almost full (85%+)', mine.filter((c) => fill(c) >= 0.85 && fill(c) < 1).length]]} />
      <div className="panel">
        <div className="panel-head"><h2>Courses filling up</h2><Link to="/manage-courses">Manage courses</Link></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Course</th><th>Seats</th></tr></thead>
            <tbody>
              {watch.map((c) => (
                <tr key={c.code}>
                  <td>{c.title}<span className="sub">{c.code}</span></td>
                  <td><CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Lecturer() {
  const { state, user, approvedCount } = useApp()
  const mine = state.courses.filter((c) => c.lecturerId === user.id)
  const pend = (code) => state.registrations.filter((r) => r.courseCode === code && r.status === 'pending').length
  return (
    <>
      <Stats items={[['Courses you teach', mine.length], ['Registered students', mine.reduce((n, c) => n + approvedCount(c.code), 0)], ['Awaiting approval', mine.reduce((n, c) => n + pend(c.code), 0)]]} />
      <div className="panel">
        <div className="panel-head"><h2>Your courses</h2><Link to="/my-courses">View student lists</Link></div>
        {mine.length === 0 ? (
          <Empty title="No courses assigned" text="Department staff can assign you to a course." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Registered</th><th>Seats</th></tr></thead>
              <tbody>
                {mine.map((c) => (
                  <tr key={c.code}>
                    <td>{c.title}<span className="sub">{c.code}</span></td>
                    <td>{approvedCount(c.code)} students</td>
                    <td><CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function Head() {
  const { state, user, approvedCount } = useApp()
  const mine = state.courses.filter((c) => c.department === user.department)
  const seats = mine.reduce((n, c) => n + c.capacity, 0)
  const taken = mine.reduce((n, c) => n + approvedCount(c.code), 0)
  const pending = state.registrations.filter((r) => r.status === 'pending' && mine.some((c) => c.code === r.courseCode)).length
  return (
    <>
      <Stats items={[[`${user.department} courses`, mine.length], ['Approved seats filled', `${seats ? Math.round((taken / seats) * 100) : 0}%`], ['Pending requests', pending]]} />
      <div className="panel">
        <div className="panel-head"><h2>Department enrolment</h2><Link to="/enrolment">See details</Link></div>
        <div className="panel-body bars">
          {mine.map((c) => (
            <div className="bar-row" key={c.code}>
              <div className="bar-top"><span>{c.code} · {c.title}</span><span className="muted">{approvedCount(c.code)} / {c.capacity}</span></div>
              <div className="cap-track"><div className={`cap-fill ${approvedCount(c.code) >= c.capacity ? 'full' : ''}`} style={{ width: `${Math.min(100, (approvedCount(c.code) / c.capacity) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Admin() {
  const { state, openPeriod } = useApp()
  return (
    <>
      <Stats items={[['User accounts', state.users.length], ['Active accounts', state.users.filter((u) => u.active).length], ['Open registration period', openPeriod ? openPeriod.name : 'None']]} />
      <div className="panel">
        <div className="panel-head"><h2>Quick actions</h2></div>
        <div className="link-list">
          <Link to="/users">Add or deactivate a user</Link>
          <Link to="/periods">Open or close a registration period</Link>
          <Link to="/settings">Change system settings</Link>
        </div>
      </div>
    </>
  )
}

const VIEWS = { student: Student, advisor: Advisor, staff: Staff, lecturer: Lecturer, head: Head, admin: Admin }

export default function Dashboard() {
  const { user } = useApp()
  const View = VIEWS[user.role]
  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} subtitle="Here is what needs your attention today." />
      <View />
    </>
  )
}
