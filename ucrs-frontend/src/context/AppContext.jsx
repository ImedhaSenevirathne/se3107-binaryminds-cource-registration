import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { seed, DEMO_PASSWORD } from '../data/seed'
import { fmtDate } from '../utils'

const Ctx = createContext(null)
const KEY = 'ucrs-demo-state-v1'

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    return saved && saved.users ? saved : seed()
  } catch {
    return seed()
  }
}

const ok = (message) => ({ ok: true, message })
const fail = (message) => ({ ok: false, message })
const ACTIVE = ['pending', 'approved']

export function AppProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])

  const patch = (fn) => setState((s) => fn(s))

  const user = state.users.find((u) => u.id === state.currentUserId) || null
  const openPeriod = state.periods.find((p) => p.status === 'open') || null
  const userById = (id) => state.users.find((u) => u.id === id)
  const courseByCode = (code) => state.courses.find((c) => c.code === code)
  const approvedCount = (code) =>
    state.registrations.filter((r) => r.courseCode === code && r.status === 'approved').length

  // ---- authentication -------------------------------------------------
  const login = (universityId, password) => {
    const found = state.users.find((u) => u.universityId.toLowerCase() === universityId.trim().toLowerCase())
    if (!found) return fail('We could not find that university ID. Check it and try again.')
    if (!found.active) return fail('This account is deactivated. Contact the system administrator.')
    if (password !== DEMO_PASSWORD) return fail('Incorrect password. In this demo, the password is demo123.')
    patch((s) => ({ ...s, currentUserId: found.id }))
    return ok('Signed in')
  }
  const logout = () => patch((s) => ({ ...s, currentUserId: null }))

  // ---- registration rules (BR01–BR03) ------------------------------------
  const checkRegistration = (code, student = user) => {
    const course = courseByCode(code)
    const existing = state.registrations.find(
      (r) => r.studentId === student.id && r.courseCode === code && ACTIVE.includes(r.status),
    )
    const missing = course.prerequisites.filter((p) => !student.completed.includes(p))
    const taken = approvedCount(code)
    const checks = [
      {
        key: 'period',
        label: 'Registration period is open',
        ok: !!openPeriod,
        detail: openPeriod ? `${openPeriod.name} closes on ${fmtDate(openPeriod.end)}.` : 'No registration period is open right now.',
      },
      {
        key: 'prereq',
        label: 'Prerequisites completed',
        ok: missing.length === 0,
        detail: missing.length
          ? `Complete ${missing.join(', ')} first.`
          : course.prerequisites.length
            ? `You have completed ${course.prerequisites.join(', ')}.`
            : 'No prerequisites for this course.',
      },
      {
        key: 'capacity',
        label: 'Seats available',
        ok: taken < course.capacity,
        detail: `${taken} of ${course.capacity} seats are taken.`,
      },
    ]
    return { course, existing, checks, ok: !existing && checks.every((c) => c.ok) }
  }

  const registerCourse = (code) => {
    const result = checkRegistration(code)
    if (result.existing) return fail('You already have a registration for this course.')
    if (!result.ok) return fail('Registration failed. Fix the items marked below and try again.')
    patch((s) => ({
      ...s,
      registrations: [
        ...s.registrations,
        { id: 'r' + Date.now(), studentId: user.id, courseCode: code, status: 'pending', requestedAt: new Date().toISOString(), decidedAt: null, decidedBy: null },
      ],
    }))
    return ok('Registration submitted. An academic advisor will review it.')
  }

  const dropRegistration = (id) => {
    if (!state.settings.allowDrop) return fail('Dropping courses is turned off right now.')
    if (!openPeriod) return fail('You can drop courses only while a registration period is open.')
    patch((s) => ({ ...s, registrations: s.registrations.map((r) => (r.id === id ? { ...r, status: 'dropped' } : r)) }))
    return ok('Course dropped.')
  }

  const decideRegistration = (id, decision) => {
    const r = state.registrations.find((x) => x.id === id)
    if (decision === 'approved' && approvedCount(r.courseCode) >= courseByCode(r.courseCode).capacity)
      return fail(`${r.courseCode} is full. Ask department staff to raise its capacity first.`)
    patch((s) => ({
      ...s,
      registrations: s.registrations.map((x) =>
        x.id === id ? { ...x, status: decision, decidedAt: new Date().toISOString(), decidedBy: user.id } : x,
      ),
    }))
    return ok(decision === 'approved' ? 'Registration approved.' : 'Registration rejected.')
  }

  // ---- courses (department staff) -----------------------------------------
  const saveCourse = (course, isNew) => {
    if (isNew && state.courses.some((c) => c.code.toLowerCase() === course.code.toLowerCase()))
      return fail(`A course with code ${course.code} already exists.`)
    if (!isNew && course.capacity < approvedCount(course.code))
      return fail(`Capacity cannot be lower than the ${approvedCount(course.code)} approved registrations.`)
    patch((s) => ({
      ...s,
      courses: isNew ? [...s.courses, course] : s.courses.map((c) => (c.code === course.code ? course : c)),
    }))
    return ok(isNew ? 'Course added.' : 'Course updated.')
  }
  const removeCourse = (code) => {
    if (state.registrations.some((r) => r.courseCode === code && ACTIVE.includes(r.status)))
      return fail('This course has active registrations. Ask students to drop or reject them first.')
    patch((s) => ({
      ...s,
      courses: s.courses.filter((c) => c.code !== code).map((c) => ({ ...c, prerequisites: c.prerequisites.filter((p) => p !== code) })),
      registrations: s.registrations.filter((r) => r.courseCode !== code),
    }))
    return ok('Course removed.')
  }

  // ---- administration ----------------------------------------------------
  const addUser = (u) => {
    if (state.users.some((x) => x.universityId.toLowerCase() === u.universityId.toLowerCase()))
      return fail(`University ID ${u.universityId} is already in use.`)
    patch((s) => ({ ...s, users: [...s.users, { ...u, id: 'u' + Date.now(), active: true, completed: [] }] }))
    return ok('User created.')
  }
  const toggleUser = (id) => {
    if (id === user.id) return fail('You cannot deactivate your own account.')
    patch((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) }))
    return ok('Account updated.')
  }
  const addPeriod = (p) => {
    patch((s) => ({ ...s, periods: [{ ...p, id: 'p' + Date.now(), status: 'closed' }, ...s.periods] }))
    return ok('Registration period created.')
  }
  const setPeriodStatus = (id, status) => {
    patch((s) => ({
      ...s,
      periods: s.periods.map((p) => (p.id === id ? { ...p, status } : status === 'open' ? { ...p, status: 'closed' } : p)),
    }))
    return ok(status === 'open' ? 'Registration is now open. Any other open period was closed.' : 'Registration period closed.')
  }
  const updateSettings = (settings) => patch((s) => ({ ...s, settings: { ...s.settings, ...settings } }))
  const resetData = () => {
    setState({ ...seed(), currentUserId: state.currentUserId })
    return ok('Demo data has been reset.')
  }

  const value = {
    state, user, openPeriod, toast, notify,
    userById, courseByCode, approvedCount,
    login, logout,
    checkRegistration, registerCourse, dropRegistration, decideRegistration,
    saveCourse, removeCourse,
    addUser, toggleUser, addPeriod, setPeriodStatus, updateSettings, resetData,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
