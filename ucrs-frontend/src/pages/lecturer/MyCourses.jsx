import { useState } from 'react'
import { Download } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader, Empty } from '../../components/ui'
import { downloadCsv, fmtDate } from '../../utils'

export default function MyCourses() {
  const { state, user, approvedCount, userById } = useApp()
  const mine = state.courses.filter((c) => c.lecturerId === user.id)
  const [code, setCode] = useState(mine[0]?.code)
  const course = mine.find((c) => c.code === code)
  const students = course
    ? state.registrations.filter((r) => r.courseCode === course.code && r.status === 'approved').map((r) => ({ ...userById(r.studentId), approvedAt: r.decidedAt }))
    : []
  const pending = course ? state.registrations.filter((r) => r.courseCode === course.code && r.status === 'pending').length : 0

  const exportCsv = () =>
    downloadCsv(`${course.code}-students.csv`, [['University ID', 'Name', 'Email'], ...students.map((s) => [s.universityId, s.name, s.email])])

  if (mine.length === 0)
    return (<><PageHeader title="My courses" /><div className="panel"><Empty title="No courses assigned" text="Department staff can assign you to a course." /></div></>)

  return (
    <>
      <PageHeader title="My courses" subtitle="See who is registered for the courses you teach." />
      <div className="split">
        <div className="panel pick-list">
          {mine.map((c) => (
            <button key={c.code} className={`pick ${c.code === code ? 'on' : ''}`} onClick={() => setCode(c.code)}>
              <strong>{c.title}</strong>
              <span>{c.code} · {approvedCount(c.code)} students</span>
            </button>
          ))}
        </div>
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>{course.title}</h2>
              <p className="muted small">{course.code} · {students.length} registered of {course.capacity} seats{pending ? ` · ${pending} waiting for approval` : ''}</p>
            </div>
            <button className="btn" onClick={exportCsv} disabled={!students.length}><Download size={16} /> Download CSV</button>
          </div>
          {students.length === 0 ? (
            <Empty title="No registered students yet" text="Approved registrations will appear here." />
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>University ID</th><th>Approved on</th></tr></thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}><td>{s.name}<span className="sub">{s.email}</span></td><td>{s.universityId}</td><td>{fmtDate(s.approvedAt)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
