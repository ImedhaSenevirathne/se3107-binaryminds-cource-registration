import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, ClipboardList, ClipboardCheck, Settings, Users, CalendarRange,
  BarChart3, LogOut, Menu, GraduationCap, LibraryBig,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { fmtDate, initials, ROLE_LABEL } from '../utils'

const dash = { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }
const NAV = {
  student: [dash, { to: '/courses', label: 'Browse courses', icon: BookOpen }, { to: '/registrations', label: 'My registrations', icon: ClipboardList }],
  advisor: [dash, { to: '/approvals', label: 'Approvals', icon: ClipboardCheck }],
  staff: [dash, { to: '/manage-courses', label: 'Manage courses', icon: LibraryBig }],
  lecturer: [dash, { to: '/my-courses', label: 'My courses', icon: BookOpen }],
  head: [dash, { to: '/enrolment', label: 'Enrolment', icon: BarChart3 }],
  admin: [
    dash,
    { to: '/users', label: 'Users', icon: Users },
    { to: '/periods', label: 'Registration periods', icon: CalendarRange },
    { to: '/settings', label: 'Settings', icon: Settings },
  ],
}

export default function Layout() {
  const { user, logout, openPeriod, state } = useApp()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="app">
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={22} color="#fff" /></div>
          <div>
            <div className="brand-name">UCRS</div>
            <div className="brand-sub">Course registration</div>
          </div>
        </div>
        <nav className="nav" aria-label="Main">
          {NAV[user.role].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">Demo build · data is stored in this browser only</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
            <div className="period-pill">
              <span className={`dot ${openPeriod ? 'open' : ''}`} />
              {openPeriod ? (
                <>
                  Registration open<span className="long"> · closes {fmtDate(openPeriod.end)}</span>
                </>
              ) : (
                'Registration closed'
              )}
            </div>
          </div>
          <div className="user-box">
            <div className="user-meta">
              <strong>{user.name}</strong>
              <span>{ROLE_LABEL[user.role]}</span>
            </div>
            <div className="avatar" aria-hidden="true">{initials(user.name)}</div>
            <button className="btn sm" onClick={logout}><LogOut size={16} /> Sign out</button>
          </div>
        </header>
        {state.settings.notice && <div className="notice">{state.settings.notice}</div>}
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
