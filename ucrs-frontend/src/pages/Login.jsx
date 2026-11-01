import { useState } from 'react'
import { GraduationCap, Search, ShieldCheck, ClipboardCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../data/seed'

export default function Login() {
  const { login } = useApp()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const res = login(id, pw)
    if (!res.ok) setError(res.message)
  }
  const quick = (universityId) => {
    const res = login(universityId, DEMO_PASSWORD)
    if (!res.ok) setError(res.message)
  }

  return (
    <div className="login">
      <section className="login-art">
        <svg className="deco" width="520" height="520" viewBox="0 0 520 520" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
          {[60, 120, 180, 240].map((r) => <circle key={r} cx="260" cy="260" r={r} />)}
          <path d="M260 20v480M20 260h480" />
        </svg>
        <div className="brand">
          <div className="brand-mark" style={{ background: 'rgba(255,255,255,.16)' }}><GraduationCap size={22} color="#fff" /></div>
          <div>
            <div className="brand-name">UCRS</div>
            <div className="brand-sub" style={{ color: '#f3c6d0' }}>University Course Registration System</div>
          </div>
        </div>
        <div>
          <h1>Register for your courses in one place.</h1>
          <ul>
            <li><Search size={20} /> See every open course and how many seats are left.</li>
            <li><ShieldCheck size={20} /> Prerequisites and deadlines are checked before you register.</li>
            <li><ClipboardCheck size={20} /> Follow each registration from pending to approved.</li>
          </ul>
        </div>
        <p style={{ color: '#f3c6d0', fontSize: 13 }}>Binary Mind · Group 04 · SE3107</p>
      </section>

      <section className="login-panel">
        <div className="login-box">
          <h2>Sign in</h2>
          <p className="muted" style={{ marginBottom: 22 }}>Use your university credentials.</p>
          {error && <div className="alert error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="uid">University ID</label>
              <input id="uid" className="input" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. 23CSE0101" autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input id="pw" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
            </div>
            <button className="btn primary block" type="submit">Sign in</button>
          </form>

          <div className="demo">
            <strong>Try a demo account</strong>
            <p className="muted small">Password for all demo accounts: {DEMO_PASSWORD}</p>
            <div className="demo-grid">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.role} className="demo-btn" onClick={() => quick(a.universityId)}>
                  <strong>{a.label}</strong>
                  <span>{a.universityId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
