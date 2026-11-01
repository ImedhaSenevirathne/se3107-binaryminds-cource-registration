import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DEPARTMENTS } from '../../data/seed'
import { PageHeader, StatusBadge, Modal } from '../../components/ui'
import { ROLE_LABEL } from '../../utils'

const blank = { name: '', universityId: '', email: '', role: 'student', department: DEPARTMENTS[0] }

export default function Users() {
  const { state, user, addUser, toggleUser, notify } = useApp()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  const list = state.users.filter(
    (u) => (role === 'all' || u.role === role) && `${u.name} ${u.universityId} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.universityId.trim() || !form.email.trim()) return setError('Fill in name, university ID and email.')
    const res = addUser({ ...form, name: form.name.trim(), universityId: form.universityId.trim(), email: form.email.trim() })
    if (!res.ok) return setError(res.message)
    notify(res.message)
    setForm(null)
  }
  const toggle = (id) => {
    const res = toggleUser(id)
    notify(res.message, res.ok ? 'success' : 'error')
  }

  return (
    <>
      <PageHeader title="Users" subtitle="Create accounts and control who can sign in.">
        <button className="btn primary" onClick={() => { setError(''); setForm(blank) }}><Plus size={17} /> Add user</button>
      </PageHeader>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input className="input" placeholder="Search name, ID or email" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
        </div>
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
          <option value="all">All roles</option>
          {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Name</th><th>University ID</th><th>Role</th><th>Department</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}<span className="sub">{u.email}</span></td>
                <td>{u.universityId}</td>
                <td>{ROLE_LABEL[u.role]}</td>
                <td>{u.department}</td>
                <td><StatusBadge status={u.active ? 'active' : 'inactive'} /></td>
                <td className="right">
                  <button className="btn sm" disabled={u.id === user.id} onClick={() => toggle(u.id)}>{u.active ? 'Deactivate' : 'Activate'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <Modal title="Add user" onClose={() => setForm(null)} footer={<><button className="btn" onClick={() => setForm(null)}>Cancel</button><button className="btn primary" form="user-form" type="submit">Create user</button></>}>
          <form id="user-form" onSubmit={submit}>
            {error && <div className="alert error" role="alert">{error}</div>}
            <div className="field"><label htmlFor="n">Full name</label><input id="n" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div className="grid-2">
              <div className="field"><label htmlFor="i">University ID</label><input id="i" className="input" value={form.universityId} onChange={(e) => set('universityId', e.target.value)} /></div>
              <div className="field"><label htmlFor="r">Role</label><select id="r" className="input" value={form.role} onChange={(e) => set('role', e.target.value)}>{Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            </div>
            <div className="field"><label htmlFor="e">Email</label><input id="e" type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div className="field"><label htmlFor="d">Department</label><select id="d" className="input" value={form.department} onChange={(e) => set('department', e.target.value)}>{[...DEPARTMENTS, 'Administration'].map((d) => <option key={d}>{d}</option>)}</select></div>
          </form>
        </Modal>
      )}
    </>
  )
}
