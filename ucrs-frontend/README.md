# UCRS Frontend – University Course Registration System

React + Vite front end for the UCRS (Binary Mind, Group 04). It runs fully in the browser with sample data, so no backend is needed. Data is saved in `localStorage`.

## Run it

```bash
npm install
npm run dev        # open http://localhost:5173
npm run build      # production build in dist/
```

Requires Node.js 18 or newer.

## Demo accounts (password for all: `demo123`)

| Role | University ID | What they can do |
|---|---|---|
| Student | 23CSE0101 | Browse courses, register (with prerequisite / period / capacity checks), drop, view status |
| Academic advisor | ADV001 | Approve or reject pending registrations |
| Department staff | STF001 | Add, edit and remove courses; set prerequisites and capacity |
| Lecturer | LEC001 | View taught courses and registered students; download CSV |
| Department head | HOD001 | Monitor enrolment by department and course |
| System administrator | ADM001 | Manage users, open or close registration periods, change settings |

Try this flow: sign in as the student and register for SE2102, sign in as the advisor and approve it, then check the student's registrations. SE3107 is full and SE3106 has a missing prerequisite, so they show the failure messages.

## Business rules in the UI (from the SRS)

- BR01 – registration and dropping only while a registration period is open
- BR02 – prerequisites must be completed
- BR03 – no registration when the course is full (approved registrations count against capacity)
- BR04 – only academic advisors approve or reject
- BR05 – only department staff add, update or remove courses

## Project structure

```
src/
  App.jsx                 routes and role guards
  context/AppContext.jsx  all state and business rules (swap for API calls later)
  data/seed.js            sample users, courses, registrations, periods
  components/             Layout (sidebar + top bar) and shared UI pieces
  pages/                  Login, Dashboard and one folder per role
  index.css               design tokens and styles
```

To connect a real backend, replace the functions in `AppContext.jsx` (`login`, `registerCourse`, `decideRegistration`, ...) with API calls. The pages only use those functions.
