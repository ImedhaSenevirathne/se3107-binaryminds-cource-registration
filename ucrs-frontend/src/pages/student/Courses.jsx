import { useState } from 'react'
import { Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS } from '../../data/seed'
import { PageHeader, StatusBadge, CapacityBar, Modal, Check, Empty } from '../../components/ui'

export default function Courses() {
  const { state, user, approvedCount, checkRegistration, registerCourse, notify } = useApp()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('all')
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [target, setTarget] = useState(null)
  const [failed, setFailed] = useState(false)

  const list = state.courses.filter((c) => {
    const text = `${c.code} ${c.title}`.toLowerCase()
    return (
      text.includes(q.toLowerCase()) &&
      (dept === 'all' || c.department === dept) &&
      (!onlyOpen || approvedCount(c.code) < c.capacity)
    )
  })

  const myStatus = (code) =>
    state.registrations.find((r) => r.studentId === user.id && r.courseCode === code && ['pending', 'approved'].includes(r.status))?.status

  const close = () => { setTarget(null); setFailed(false) }
  const confirm = () => {
    const res = registerCourse(target)
    if (res.ok) { notify(res.message); close() } else setFailed(true)
  }
  const check = target ? checkRegistration(target) : null

  return (
    <>
      <PageHeader title="Browse courses" subtitle="Check the requirements, then register. An advisor approves each registration." />
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input className="input" placeholder="Search by code or title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
        </div>
        <select className="input" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <label className="check"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /> Only courses with seats</label>
      </div>

      {list.length === 0 ? (
        <div className="panel"><Empty title="No courses match" text="Try a different search or department." /></div>
      ) : (
        <div className="course-grid">
          {list.map((c) => {
            const mine = myStatus(c.code)
            return (
              <article className="course-card" key={c.code}>
                <header>
                  <div>
                    <div className="course-code">{c.code}</div>
                    <h3>{c.title}</h3>
                  </div>
                  <span className="chip">{c.credits} credits</span>
                </header>
                <div className="course-meta"><span>{c.department}</span></div>
                <div>
                  <div className="prereq-label">Prerequisites</div>
                  {c.prerequisites.length === 0 ? (
                    <span className="muted small">None</span>
                  ) : (
                    <div className="chips">
                      {c.prerequisites.map((p) => (
                        <span key={p} className={`chip ${user.completed.includes(p) ? 'ok' : 'bad'}`}>{p}{user.completed.includes(p) ? ' · done' : ' · missing'}</span>
                      ))}
                    </div>
                  )}
                </div>
                <CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} />
                <div className="course-foot">
                  {mine ? <StatusBadge status={mine} /> : <span />}
                  <button className="btn primary" disabled={!!mine} onClick={() => setTarget(c.code)}>
                    {mine ? 'Registered' : 'Register'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {target && (
        <Modal
          title={`Register for ${check.course.code}`}
          onClose={close}
          footer={
            <>
              <button className="btn" onClick={close}>Cancel</button>
              <button className="btn primary" onClick={confirm} disabled={!check.ok}>Confirm registration</button>
            </>
          }
        >
          <p style={{ marginBottom: 16 }}><strong>{check.course.title}</strong> · {check.course.credits} credits</p>
          <ul className="checklist">
            {check.checks.map((c) => (
              <li key={c.key}>
                <Check ok={c.ok} />
                <div><strong>{c.label}</strong><span>{c.detail}</span></div>
              </li>
            ))}
          </ul>
          {check.ok && !failed && <div className="result good">All checks passed. Your registration will be pending until an advisor approves it.</div>}
          {(!check.ok || failed) && <div className="result bad">Registration failed. Fix the items marked above, then try again.</div>}
        </Modal>
      )}
    </>
  )
}
