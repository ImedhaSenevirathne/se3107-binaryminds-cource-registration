import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS } from '../../data/seed'
import { PageHeader, CapacityBar } from '../../components/ui'

export default function Enrolment() {
  const { state, user, approvedCount } = useApp()
  const [dept, setDept] = useState(user.department)
  const stats = DEPARTMENTS.map((d) => {
    const courses = state.courses.filter((c) => c.department === d)
    const seats = courses.reduce((n, c) => n + c.capacity, 0)
    const taken = courses.reduce((n, c) => n + approvedCount(c.code), 0)
    return { d, seats, taken }
  })
  const courses = state.courses.filter((c) => c.department === dept)
  const pending = (code) => state.registrations.filter((r) => r.courseCode === code && r.status === 'pending').length
  const lecturer = (id) => state.users.find((u) => u.id === id)?.name || 'Not assigned'

  return (
    <>
      <PageHeader title="Enrolment" subtitle="Approved registrations compared with available seats." />
      <div className="panel">
        <div className="panel-head"><h2>By department</h2></div>
        <div className="panel-body bars">
          {stats.map(({ d, seats, taken }) => (
            <div className="bar-row" key={d}>
              <div className="bar-top"><span>{d}</span><span className="muted">{taken} of {seats} seats · {Math.round((taken / seats) * 100)}%</span></div>
              <div className="cap-track"><div className="cap-fill" style={{ width: `${(taken / seats) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <h2>Courses</h2>
          <select className="input" style={{ width: 'auto' }} value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Course</th><th>Lecturer</th><th>Seats</th><th>Pending</th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.code}>
                  <td>{c.title}<span className="sub">{c.code}</span></td>
                  <td>{lecturer(c.lecturerId)}</td>
                  <td><CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} /></td>
                  <td>{pending(c.code)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
