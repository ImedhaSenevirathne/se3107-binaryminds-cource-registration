import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { PageHeader, StatusBadge, Modal, Empty } from '../../components/ui'
import { fmtDate } from '../../utils'

const TABS = [['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['dropped', 'Dropped']]

export default function MyRegistrations() {
  const { state, user, courseByCode, userById, dropRegistration, notify } = useApp()
  const [tab, setTab] = useState('all')
  const [dropId, setDropId] = useState(null)

  const mine = state.registrations.filter((r) => r.studentId === user.id).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
  const list = tab === 'all' ? mine : mine.filter((r) => r.status === tab)
  const count = (s) => (s === 'all' ? mine.length : mine.filter((r) => r.status === s).length)
  const credits = mine.filter((r) => r.status === 'approved').reduce((n, r) => n + courseByCode(r.courseCode).credits, 0)

  const drop = () => {
    const res = dropRegistration(dropId)
    notify(res.message, res.ok ? 'success' : 'error')
    setDropId(null)
  }
  const dropping = state.registrations.find((r) => r.id === dropId)

  return (
    <>
      <PageHeader title="My registrations" subtitle={`${credits} credits approved so far.`}>
        <Link className="btn primary" to="/courses">Register for a course</Link>
      </PageHeader>
      <div className="tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`tab ${tab === key ? 'on' : ''}`} onClick={() => setTab(key)}>
            {label}<span className="count">{count(key)}</span>
          </button>
        ))}
      </div>
      <div className="panel">
        {list.length === 0 ? (
          <Empty title="Nothing here yet" text="Registrations with this status will appear here." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Credits</th><th>Requested</th><th>Status</th><th>Decision</th><th /></tr></thead>
              <tbody>
                {list.map((r) => {
                  const c = courseByCode(r.courseCode)
                  return (
                    <tr key={r.id}>
                      <td>{c.title}<span className="sub">{c.code}</span></td>
                      <td>{c.credits}</td>
                      <td className="nowrap">{fmtDate(r.requestedAt)}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="muted small">{r.decidedBy ? `${userById(r.decidedBy).name}, ${fmtDate(r.decidedAt)}` : '—'}</td>
                      <td className="right">
                        {['pending', 'approved'].includes(r.status) && (
                          <button className="btn sm danger" onClick={() => setDropId(r.id)}>Drop</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dropping && (
        <Modal
          title="Drop this course?"
          onClose={() => setDropId(null)}
          footer={<><button className="btn" onClick={() => setDropId(null)}>Keep course</button><button className="btn danger" onClick={drop}>Drop course</button></>}
        >
          <p>You are about to drop <strong>{courseByCode(dropping.courseCode).title}</strong> ({dropping.courseCode}). You can register again while the registration period is open.</p>
        </Modal>
      )}
    </>
  )
}
