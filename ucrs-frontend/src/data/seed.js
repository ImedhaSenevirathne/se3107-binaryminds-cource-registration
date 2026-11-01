// Demo data. Everything lives in the browser (localStorage) so the project runs without a backend.
export const DEPARTMENTS = ['Software Engineering', 'Information Systems', 'Computer Science']

export const DEMO_PASSWORD = 'demo123'

export const DEMO_ACCOUNTS = [
  { role: 'student', label: 'Student', universityId: '23CSE0101' },
  { role: 'advisor', label: 'Academic advisor', universityId: 'ADV001' },
  { role: 'staff', label: 'Department staff', universityId: 'STF001' },
  { role: 'lecturer', label: 'Lecturer', universityId: 'LEC001' },
  { role: 'head', label: 'Department head', universityId: 'HOD001' },
  { role: 'admin', label: 'System administrator', universityId: 'ADM001' },
]

const SE = 'Software Engineering'
const IS = 'Information Systems'
const CS = 'Computer Science'

const student = (n, name, completed) => ({
  id: `s${n}`,
  universityId: `23CSE010${n}`,
  name,
  email: `${name.split(' ')[0].toLowerCase()}@std.univ.example`,
  role: 'student',
  department: SE,
  active: true,
  completed,
})

const staffUser = (id, universityId, name, role, department) => ({
  id,
  universityId,
  name,
  email: `${universityId.toLowerCase()}@univ.example`,
  role,
  department,
  active: true,
  completed: [],
})

const reg = (id, studentId, courseCode, status, requestedAt, decidedAt = null) => ({
  id,
  studentId,
  courseCode,
  status,
  requestedAt,
  decidedAt,
  decidedBy: decidedAt ? 'adv1' : null,
})

export const seed = () => ({
  currentUserId: null,
  settings: {
    allowDrop: true,
    notice: 'Registration for Semester 1 closes on 10 November 2026 at 4.30 pm.',
  },
  users: [
    student(1, 'Kavindu Silva', ['SE1101', 'SE1102', 'SE2102', 'IS2101']),
    student(2, 'Nadeesha Perera', ['SE1101', 'SE1102', 'SE2102', 'SE2103']),
    student(3, 'Tharindu Fernando', ['SE1101', 'SE1102', 'SE2101']),
    student(4, 'Sachini Wijesinghe', ['SE1101', 'SE1102', 'IS2101']),
    student(5, 'Isuru Bandara', ['SE1101', 'CS2101']),
    student(6, 'Hiruni Jayawardena', ['SE1101', 'SE1102']),
    student(7, 'Dinuka Rajapaksha', ['SE1101']),
    student(8, 'Amaya Gunawardena', ['SE1101', 'SE1102']),
    staffUser('adv1', 'ADV001', 'Dr. Ishara Fernando', 'advisor', SE),
    staffUser('stf1', 'STF001', 'Ms. Thilini Perera', 'staff', SE),
    staffUser('lec1', 'LEC001', 'Dr. Nuwan Jayasinghe', 'lecturer', SE),
    staffUser('lec2', 'LEC002', 'Dr. Sanduni Rathnayake', 'lecturer', SE),
    staffUser('lec3', 'LEC003', 'Dr. Dilan Gunasekara', 'lecturer', IS),
    staffUser('lec4', 'LEC004', 'Dr. Menaka Herath', 'lecturer', CS),
    staffUser('hod1', 'HOD001', 'Prof. Rohan Wijesekara', 'head', SE),
    staffUser('adm1', 'ADM001', 'Mr. Chamara Bandara', 'admin', 'Administration'),
  ],
  courses: [
    { code: 'SE1101', title: 'Programming Fundamentals', department: SE, credits: 3, capacity: 120, lecturerId: 'lec1', prerequisites: [] },
    { code: 'SE1102', title: 'Discrete Mathematics', department: SE, credits: 3, capacity: 120, lecturerId: 'lec2', prerequisites: [] },
    { code: 'SE2101', title: 'Data Structures and Algorithms', department: SE, credits: 3, capacity: 100, lecturerId: 'lec1', prerequisites: ['SE1101'] },
    { code: 'SE2102', title: 'Database Systems', department: SE, credits: 3, capacity: 100, lecturerId: 'lec2', prerequisites: ['SE1101'] },
    { code: 'SE2103', title: 'Object-Oriented Programming', department: SE, credits: 3, capacity: 100, lecturerId: 'lec1', prerequisites: ['SE1101'] },
    { code: 'SE3106', title: 'Web Systems and Technologies', department: SE, credits: 3, capacity: 80, lecturerId: 'lec2', prerequisites: ['SE2102', 'SE2103'] },
    { code: 'SE3107', title: 'Software Engineering Foundations', department: SE, credits: 3, capacity: 4, lecturerId: 'lec1', prerequisites: ['SE1101'] },
    { code: 'IS2101', title: 'Systems Analysis and Design', department: IS, credits: 3, capacity: 80, lecturerId: 'lec3', prerequisites: [] },
    { code: 'IS3102', title: 'Enterprise Information Systems', department: IS, credits: 3, capacity: 60, lecturerId: 'lec3', prerequisites: ['IS2101'] },
    { code: 'CS2101', title: 'Computer Networks', department: CS, credits: 3, capacity: 90, lecturerId: 'lec4', prerequisites: [] },
    { code: 'CS3101', title: 'Operating Systems', department: CS, credits: 4, capacity: 90, lecturerId: 'lec4', prerequisites: ['CS2101'] },
  ],
  registrations: [
    reg('r1', 's1', 'SE2101', 'approved', '2026-10-21T09:15:00', '2026-10-22T11:00:00'),
    reg('r2', 's1', 'CS2101', 'pending', '2026-10-26T14:20:00'),
    reg('r3', 's1', 'IS3102', 'approved', '2026-10-21T09:40:00', '2026-10-22T11:05:00'),
    reg('r4', 's2', 'SE3107', 'approved', '2026-10-20T10:00:00', '2026-10-21T09:00:00'),
    reg('r5', 's3', 'SE3107', 'approved', '2026-10-20T10:10:00', '2026-10-21T09:02:00'),
    reg('r6', 's4', 'SE3107', 'approved', '2026-10-20T10:30:00', '2026-10-21T09:04:00'),
    reg('r7', 's5', 'SE3107', 'approved', '2026-10-20T11:00:00', '2026-10-21T09:06:00'),
    reg('r8', 's6', 'SE2102', 'pending', '2026-10-27T08:45:00'),
    reg('r9', 's7', 'SE2103', 'pending', '2026-10-27T09:30:00'),
    reg('r10', 's8', 'CS2101', 'pending', '2026-10-27T16:05:00'),
    reg('r11', 's2', 'SE2103', 'approved', '2026-10-21T08:30:00', '2026-10-22T10:00:00'),
    reg('r12', 's3', 'SE2101', 'approved', '2026-10-21T12:00:00', '2026-10-22T10:10:00'),
    reg('r13', 's4', 'IS2101', 'approved', '2026-10-22T09:00:00', '2026-10-23T09:00:00'),
    reg('r14', 's5', 'CS3101', 'rejected', '2026-10-22T10:00:00', '2026-10-23T09:30:00'),
    reg('r15', 's6', 'SE2101', 'approved', '2026-10-22T13:00:00', '2026-10-23T10:00:00'),
    reg('r16', 's7', 'SE2101', 'approved', '2026-10-23T09:00:00', '2026-10-24T10:00:00'),
    reg('r17', 's2', 'SE3106', 'pending', '2026-10-27T10:20:00'),
  ],
  periods: [
    { id: 'p1', name: 'Semester 1 · 2026/27', start: '2026-10-20', end: '2026-11-10', status: 'open' },
    { id: 'p0', name: 'Semester 2 · 2025/26', start: '2026-03-02', end: '2026-03-20', status: 'closed' },
  ],
})
