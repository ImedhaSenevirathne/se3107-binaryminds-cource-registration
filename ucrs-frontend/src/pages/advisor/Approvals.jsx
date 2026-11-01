import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PageHeader, StatusBadge, CapacityBar, Empty } from '../../components/ui'
import { fmtDate } from '../../utils'

const TABS = [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']]

export default function Approvals() {
  const { state, userById, courseByCode, approvedCount, decideRegistration, notify } = useApp()
  const [tab, setTab] = useState('pending')
  const rows = state.registrations.filter((r) => r.status === tab).sort((a, b) => a.requestedAt.localeCompare(b.requestedAt))
  const count = (s) => state.registrations.filter((r) => r.status === s).length

  const decide = (id, decision) => {
    const res = decideRegistration(id, decision)
    notify(res.message, res.ok ? 'success' : 'error')
  }

  return (
    <>
      <PageHeader title="Approvals" subtitle="Review student registrations. Approving a registration takes one seat." />
      <div className="tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`tab ${tab === key ? 'on' : ''}`} onClick={() => setTab(key)}>
            {label}<span className="count">{count(key)}</span>
          </button>
        ))}
      </div>
      <div className="panel">
        {rows.length === 0 ? (
          <Empty title={tab === 'pending' ? 'All caught up' : 'Nothing here yet'} text={tab === 'pending' ? 'There are no registrations waiting for a decision.' : 'Decisions you make will be listed here.'} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Course</th><th>Requested</th><th>Seats</th><th>{tab === 'pending' ? '' : 'Status'}</th></tr></thead>
              <tbody>
                {rows.map((r) => {
                  const s = userById(r.studentId)
                  const c = courseByCode(r.courseCode)
                  return (
                    <tr key={r.id}>
                      <td>{s.name}<span className="sub">{s.universityId}</span></td>
                      <td>{c.title}<span className="sub">{c.code}</span></td>
                      <td className="nowrap">{fmtDate(r.requestedAt)}</td>
                      <td><CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} /></td>
                      <td>
                        {tab === 'pending' ? (
                          <div className="actions">
                            <button className="btn sm danger" onClick={() => decide(r.id, 'rejected')}>Reject</button>
                            <button className="btn sm good" onClick={() => decide(r.id, 'approved')}>Approve</button>
                          </div>
                        ) : (
                          <StatusBadge status={r.status} />
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
    </>
  )
}
