import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PageHeader, Modal } from '../../components/ui'

export default function Settings() {
  const { state, updateSettings, resetData, notify } = useApp()
  const [notice, setNotice] = useState(state.settings.notice)
  const [confirm, setConfirm] = useState(false)

  const saveNotice = () => { updateSettings({ notice: notice.trim() }); notify('Announcement saved.') }
  const reset = () => { notify(resetData().message); setConfirm(false) }

  return (
    <>
      <PageHeader title="Settings" subtitle="System-wide options for course registration." />
      <div className="panel">
        <div className="panel-head"><h2>Announcement</h2></div>
        <div className="panel-body">
          <div className="field">
            <label htmlFor="notice">Message shown at the top of every page</label>
            <textarea id="notice" className="input" value={notice} onChange={(e) => setNotice(e.target.value)} />
            <span className="hint">Leave it empty to hide the announcement.</span>
          </div>
          <button className="btn primary" onClick={saveNotice}>Save announcement</button>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Registration options</h2></div>
        <div className="panel-body">
          <div className="switch-row">
            <div><strong>Allow students to drop courses</strong><p className="muted small">Dropping is possible only while a registration period is open.</p></div>
            <input className="check" type="checkbox" style={{ width: 20, height: 20, accentColor: '#8a1c34' }} checked={state.settings.allowDrop} onChange={(e) => updateSettings({ allowDrop: e.target.checked })} aria-label="Allow students to drop courses" />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Demo data</h2></div>
        <div className="panel-body">
          <p className="muted" style={{ marginBottom: 14 }}>All data is stored in this browser. Reset it to return to the original sample users, courses and registrations.</p>
          <button className="btn danger" onClick={() => setConfirm(true)}>Reset demo data</button>
        </div>
      </div>
      {confirm && (
        <Modal title="Reset demo data?" onClose={() => setConfirm(false)} footer={<><button className="btn" onClick={() => setConfirm(false)}>Cancel</button><button className="btn danger" onClick={reset}>Reset data</button></>}>
          <p>This replaces every change you made with the original sample data. You will stay signed in.</p>
        </Modal>
      )}
    </>
  )
}
