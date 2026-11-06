# University Course Registration System – React Frontend

Simple React frontend (Vite) for the Semester Practical Project. It shows the system title, **Student Name**, **Student ID**, **Course Name** and a **Register** button. This activity covers only the frontend; the backend, database and GitHub collaboration are handled separately.

## How this project was created

```bash
npm create vite@latest university-course-registration -- --template react
cd university-course-registration
npm install
```

## Run it

```bash
npm install      # first time only
npm run dev      # then open the address shown, usually http://localhost:5173
```

Requires Node.js 18 or newer.

## Verify the page

1. The page title reads **University Course Registration System**.
2. The form shows **Student Name**, **Student ID**, **Course Name** (a drop-down list) and a **Register** button.
3. Fill in all three fields and click **Register**. A green confirmation message appears and the registration is listed under **Registered courses**.
4. Leave a field empty and click **Register**. The browser asks you to fill it in.
5. Register the same student ID for the same course twice. A red message says it is already registered.

## Files

```
university-course-registration/
  index.html        page shell and title
  package.json      scripts and dependencies
  src/
    main.jsx        starts the React app
    App.jsx         the registration page (form, messages, list)
    App.css         page styles
    index.css       global styles
```

Registrations are kept in the browser memory only and disappear when the page is refreshed. That is expected for this frontend-only activity.
