import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import { Toast } from './components/ui'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/student/Courses'
import MyRegistrations from './pages/student/MyRegistrations'
import Approvals from './pages/advisor/Approvals'
import ManageCourses from './pages/staff/ManageCourses'
import MyCourses from './pages/lecturer/MyCourses'
import Enrolment from './pages/head/Enrolment'
import Users from './pages/admin/Users'
import Periods from './pages/admin/Periods'
import SettingsPage from './pages/admin/Settings'

function Guard({ roles, children }) {
  const { user } = useApp()
  return roles.includes(user.role) ? children : <Navigate to="/" replace />
}

export default function App() {
  const { user, toast } = useApp()
  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Guard roles={['student']}><Courses /></Guard>} />
          <Route path="registrations" element={<Guard roles={['student']}><MyRegistrations /></Guard>} />
          <Route path="approvals" element={<Guard roles={['advisor']}><Approvals /></Guard>} />
          <Route path="manage-courses" element={<Guard roles={['staff']}><ManageCourses /></Guard>} />
          <Route path="my-courses" element={<Guard roles={['lecturer']}><MyCourses /></Guard>} />
          <Route path="enrolment" element={<Guard roles={['head']}><Enrolment /></Guard>} />
          <Route path="users" element={<Guard roles={['admin']}><Users /></Guard>} />
          <Route path="periods" element={<Guard roles={['admin']}><Periods /></Guard>} />
          <Route path="settings" element={<Guard roles={['admin']}><SettingsPage /></Guard>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast toast={toast} />
    </>
  )
}
