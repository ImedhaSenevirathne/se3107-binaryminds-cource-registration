import { useState } from 'react'
import './App.css'

const COURSES = [
  'Programming Fundamentals',
  'Discrete Mathematics',
  'Data Structures and Algorithms',
  'Database Systems',
  'Object-Oriented Programming',
  'Web Systems and Technologies',
  'Software Engineering Foundations',
  'Computer Networks',
]

function App() {
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [courseName, setCourseName] = useState('')
  const [message, setMessage] = useState(null)
  const [registrations, setRegistrations] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = studentName.trim()
    const id = studentId.trim()

    const alreadyRegistered = registrations.some(
      (r) => r.studentId.toLowerCase() === id.toLowerCase() && r.courseName === courseName,
    )
    if (alreadyRegistered) {
      setMessage({ type: 'error', text: `${name} is already registered for ${courseName}.` })
      return
    }

    setRegistrations([...registrations, { studentName: name, studentId: id, courseName }])
    setMessage({ type: 'success', text: `${name} (${id}) is now registered for ${courseName}.` })
    setCourseName('')
  }

  return (
    <main className="page">
      <header className="header">
        <h1>University Course Registration System</h1>
        <p>Enter your details and choose a course to register.</p>
      </header>

      <section className="card">
        <h2>Course registration</h2>

        {message && (
          <div className={`alert ${message.type}`} role="status">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="studentName">Student Name</label>
            <input
              id="studentName"
              type="text"
              placeholder="e.g. Kavindu Silva"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="studentId">Student ID</label>
            <input
              id="studentId"
              type="text"
              placeholder="e.g. 23CSE0101"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="courseName">Course Name</label>
            <select
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a course
              </option>
              {COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </section>

      {registrations.length > 0 && (
        <section className="card">
          <h2>Registered courses</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r, i) => (
                <tr key={i}>
                  <td>{r.studentName}</td>
                  <td>{r.studentId}</td>
                  <td>{r.courseName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer className="footer">Binary Mind</footer>
    </main>
  )
}

export default App
