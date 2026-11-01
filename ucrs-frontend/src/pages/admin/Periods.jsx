import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageHeader, StatusBadge, Modal } from '../../components/ui'
import { fmtDate } from '../../utils'

export default function Periods() {
  const { state, addPeriod, setPeriodStatus, notify } = useApp()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.start || !form.end) return setError('Enter a name, start date and end date.')
    if (form.end < form.start) return setError('The end date must be after the start date.')
    notify(addPeriod({ ...form, name: form.name.trim() }).message)
    setForm(null)
  }
  const change = (id, status) => notify(setPeriodStatus(id, status).message)

  return (
    <>
      <PageHeader title="Registration periods" subtitle="Students can register and drop courses only while a period is open. One period can be open at a time.">
        <button className="btn primary" onClick={() => { setError(''); setForm({ name: '', start: '', end: '' }) }}><Plus size={17} /> New period</button>
      </PageHeader>
      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Period</th><th>Starts</th><th>Ends</th><th>Status</th><th /></tr></thead>
          <tbody>
            {state.periods.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="nowrap">{fmtDate(p.start)}</td>
                <td className="nowrap">{fmtDate(p.end)}</td>
                <td><StatusBadge status={p.status} /></td>
                <td className="right">
                  {p.status === 'open'
                    ? <button className="btn sm danger" onClick={() => change(p.id, 'closed')}>Close registration</button>
                    : <button className="btn sm good" onClick={() => change(p.id, 'open')}>Open registration</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <Modal title="New registration period" onClose={() => setForm(null)} footer={<><button className="btn" onClick={() => setForm(null)}>Cancel</button><button className="btn primary" form="period-form" type="submit">Create period</button></>}>
          <form id="period-form" onSubmit={submit}>
            {error && <div className="alert error" role="alert">{error}</div>}
            <div className="field"><label htmlFor="pn">Name</label><input id="pn" className="input" placeholder="e.g. Semester 2 · 2026/27" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div className="grid-2">
              <div className="field"><label htmlFor="ps">Start date</label><input id="ps" type="date" className="input" value={form.start} onChange={(e) => set('start', e.target.value)} /></div>
              <div className="field"><label htmlFor="pe">End date</label><input id="pe" type="date" className="input" value={form.end} onChange={(e) => set('end', e.target.value)} /></div>
            </div>
            <p className="muted small">New periods start closed. Open them when registration should begin.</p>
          </form>
        </Modal>
      )}
    </>
  )
}
