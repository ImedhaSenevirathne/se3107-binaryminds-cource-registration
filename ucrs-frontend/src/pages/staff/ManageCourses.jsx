import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS } from '../../data/seed'
import { PageHeader, CapacityBar, Modal, Empty } from '../../components/ui'

const blank = (dept) => ({ code: '', title: '', department: dept, credits: 3, capacity: 60, lecturerId: '', prerequisites: [] })

export default function ManageCourses() {
  const { state, user, approvedCount, saveCourse, removeCourse, notify } = useApp()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState(user.department)
  const [form, setForm] = useState(null) // { data, isNew }
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)

  const lecturers = state.users.filter((u) => u.role === 'lecturer')
  const list = state.courses.filter(
    (c) => (dept === 'all' || c.department === dept) && `${c.code} ${c.title}`.toLowerCase().includes(q.toLowerCase()),
  )
  const lecturerName = (id) => state.users.find((u) => u.id === id)?.name || 'Not assigned'

  const set = (k, v) => setForm((f) => ({ ...f, data: { ...f.data, [k]: v } }))
  const togglePre = (code) =>
    set('prerequisites', form.data.prerequisites.includes(code) ? form.data.prerequisites.filter((p) => p !== code) : [...form.data.prerequisites, code])

  const open = (data, isNew) => { setError(''); setForm({ data: { ...data }, isNew }) }
  const submit = (e) => {
    e.preventDefault()
    const d = form.data
    const course = { ...d, code: d.code.trim().toUpperCase(), title: d.title.trim(), credits: Number(d.credits), capacity: Number(d.capacity) }
    if (!course.code || !course.title) return setError('Enter a course code and title.')
    if (course.capacity < 1 || course.credits < 1) return setError('Credits and capacity must be at least 1.')
    const res = saveCourse(course, form.isNew)
    if (!res.ok) return setError(res.message)
    notify(res.message)
    setForm(null)
  }
  const remove = () => {
    const res = removeCourse(removing)
    notify(res.message, res.ok ? 'success' : 'error')
    setRemoving(null)
  }

  return (
    <>
      <PageHeader title="Manage courses" subtitle="Add courses, set prerequisites and capacity, and keep course details up to date.">
        <button className="btn primary" onClick={() => open(blank(user.department), true)}><Plus size={17} /> Add course</button>
      </PageHeader>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input className="input" placeholder="Search by code or title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
        </div>
        <select className="input" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="panel">
        {list.length === 0 ? (
          <Empty title="No courses found" text="Add a course or change the filters." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Lecturer</th><th>Credits</th><th>Prerequisites</th><th>Seats</th><th /></tr></thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.code}>
                    <td>{c.title}<span className="sub">{c.code} · {c.department}</span></td>
                    <td>{lecturerName(c.lecturerId)}</td>
                    <td>{c.credits}</td>
                    <td>{c.prerequisites.length ? <div className="chips">{c.prerequisites.map((p) => <span className="chip" key={p}>{p}</span>)}</div> : <span className="muted">None</span>}</td>
                    <td><CapacityBar taken={approvedCount(c.code)} capacity={c.capacity} /></td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn" aria-label={`Edit ${c.code}`} onClick={() => open(c, false)}><Pencil size={18} /></button>
                        <button className="icon-btn" aria-label={`Remove ${c.code}`} onClick={() => setRemoving(c.code)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && (
        <Modal
          wide
          title={form.isNew ? 'Add course' : `Edit ${form.data.code}`}
          onClose={() => setForm(null)}
          footer={<><button className="btn" onClick={() => setForm(null)}>Cancel</button><button className="btn primary" form="course-form" type="submit">{form.isNew ? 'Add course' : 'Save changes'}</button></>}
        >
          <form id="course-form" onSubmit={submit}>
            {error && <div className="alert error" role="alert">{error}</div>}
            <div className="grid-2">
              <div className="field"><label htmlFor="code">Course code</label><input id="code" className="input" value={form.data.code} onChange={(e) => set('code', e.target.value)} disabled={!form.isNew} placeholder="e.g. SE3108" /></div>
              <div className="field"><label htmlFor="credits">Credits</label><input id="credits" type="number" min="1" max="12" className="input" value={form.data.credits} onChange={(e) => set('credits', e.target.value)} /></div>
            </div>
            <div className="field"><label htmlFor="title">Title</label><input id="title" className="input" value={form.data.title} onChange={(e) => set('title', e.target.value)} /></div>
            <div className="grid-2">
              <div className="field"><label htmlFor="dep">Department</label><select id="dep" className="input" value={form.data.department} onChange={(e) => set('department', e.target.value)}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></div>
              <div className="field"><label htmlFor="cap">Capacity</label><input id="cap" type="number" min="1" className="input" value={form.data.capacity} onChange={(e) => set('capacity', e.target.value)} /></div>
            </div>
            <div className="field">
              <label htmlFor="lec">Lecturer</label>
              <select id="lec" className="input" value={form.data.lecturerId} onChange={(e) => set('lecturerId', e.target.value)}>
                <option value="">Not assigned</option>
                {lecturers.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="field">
              <span className="label">Prerequisites</span>
              <div className="chips" style={{ gap: 10 }}>
                {state.courses.filter((c) => c.code !== form.data.code).map((c) => (
                  <label className="check" key={c.code}>
                    <input type="checkbox" checked={form.data.prerequisites.includes(c.code)} onChange={() => togglePre(c.code)} /> {c.code}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {removing && (
        <Modal title="Remove this course?" onClose={() => setRemoving(null)} footer={<><button className="btn" onClick={() => setRemoving(null)}>Cancel</button><button className="btn danger" onClick={remove}>Remove course</button></>}>
          <p>This removes <strong>{removing}</strong> and its past registration records. Courses with active registrations cannot be removed.</p>
        </Modal>
      )}
    </>
  )
}
