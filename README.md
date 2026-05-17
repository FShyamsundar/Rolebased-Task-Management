# Role-Based Task Management Dashboard

An enterprise-grade MERN dashboard for role-aware task operations across admins, managers, and employees. The project includes a production-ready Express API, a responsive React frontend, JWT authentication, RBAC authorization, analytics, seed data, and deployment guidance for Vercel, Render/Railway, and MongoDB Atlas.

## Highlights

- JWT authentication with protected routes and persisted sessions
- RBAC for `admin`, `manager`, and `employee`
- Task lifecycle management with kanban and table views
- Analytics dashboard with completion insights and productivity trends
- Responsive role-based UI with Tailwind, Framer Motion, Recharts, toast notifications, and empty states
- Secure backend with Helmet, rate limiting, CORS, HPP, Mongo sanitization, and XSS protection
- MVC backend architecture with validation, async error handling, and seed scripts

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- Recharts
- React Hook Form
- Framer Motion
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Zod validation

## Project Structure

```text
Rolebased Task Management/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       ├── utils/
│       └── validations/
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       ├── app/
│       ├── components/
│       ├── constants/
│       ├── features/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── styles/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Features by Role

### Admin

- View system-wide analytics
- Create managers and employees
- View, update, and delete users
- View all tasks
- Manage task delivery visibility
- Access permissions overview UI

### Manager

- Create and assign tasks to employees
- Update task status and add contextual comments
- Review team roster
- Track productivity and team progress

### Employee

- View personal assigned tasks
- Update progress and mark tasks complete
- Review personal productivity metrics

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Users

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Analytics

- `GET /api/analytics/dashboard`
- `GET /api/analytics/productivity`

## Database Design

### User

- `name`
- `email`
- `password`
- `role`
- `department`
- `avatar`
- `isActive`
- `manager`
- `permissions`
- `lastLoginAt`
- timestamps

Indexes:

- `email`
- `role`
- `manager`
- compound `role + department`

### Task

- `title`
- `description`
- `priority`
- `status`
- `dueDate`
- `assignedBy`
- `assignedTo`
- `comments`
- `attachments`
- `tags`
- timestamps

Indexes:

- text index on `title` and `description`
- compound `assignedTo + status + dueDate`
- direct indexes on `priority`, `status`, `assignedBy`, `assignedTo`, `dueDate`

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd "Rolebased Task Management"
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Backend: copy [backend/.env.example](/d:/dev/Rolebased%20Task%20Management/backend/.env.example)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
SEED_ADMIN_EMAIL=admin@taskflowhq.com
SEED_ADMIN_PASSWORD=Admin@123
```

Frontend: copy [frontend/.env.example](/d:/dev/Rolebased%20Task%20Management/frontend/.env.example)

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed demo data

```bash
cd backend
npm run seed
```

### 4. Run development servers

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Demo Credentials

- Admin: `admin@taskflowhq.com / Admin@123`
- Manager: `manager@taskflowhq.com / Manager@123`
- Employee: `riya@taskflowhq.com / Employee@123`

## Frontend UX Notes

- Responsive sidebar with mobile overlay navigation
- Analytics cards and charts
- Kanban and table task views
- Empty states and loading states
- Toast notifications for async actions

## Security Controls

- Helmet headers
- CORS allow-list using `CLIENT_URL`
- Rate limiting
- Mongo query sanitization
- XSS cleaning
- HPP protection
- Password hashing with bcryptjs
- JWT verification middleware
- Role-based authorization middleware

## Deployment Guide

### Frontend on Vercel

1. Import the `frontend` directory as a Vercel project.
2. Set `VITE_API_URL` to your deployed backend API URL, for example `https://your-api.onrender.com/api`.
3. Add a `vercel.json` rewrite so React Router routes resolve to `index.html`.
4. Use the default Vite build command: `npm run build`.
5. Output directory: `dist`.

### Backend on Render or Railway

1. Create a new web service from the `backend` directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure environment variables from `backend/.env.example`.
5. Update `CLIENT_URLS` to include your Vercel frontend domain, for example `https://your-app.vercel.app,https://your-app-git-main-your-team.vercel.app`.

### MongoDB Atlas

1. Create a cluster and database named `rbac-dashboard`.
2. Create a database user and whitelist your deployment IPs.
3. Paste the Atlas connection string into `MONGODB_URI`.

## API Testing Guide

Use Postman or Thunder Client:

1. Register or login using `/api/auth/login`.
2. Copy the JWT token from the response.
3. Send `Authorization: Bearer <token>` on protected endpoints.
4. Test role restrictions with the seeded admin, manager, and employee accounts.

Recommended flow:

1. Login as admin
2. Create a user via `POST /api/users`
3. Login as manager
4. Create a task via `POST /api/tasks`
5. Login as employee
6. Update task status via `PUT /api/tasks/:id`

## Screenshots

Add screenshots here after running the project:

- `docs/login-page.png`
- `docs/admin-dashboard.png`
- `docs/manager-tasks.png`
- `docs/employee-kanban.png`

## Future Improvements

- Refresh tokens and httpOnly cookie auth
- Real attachment uploads with S3 or Cloudinary
- Password reset email flow
- Fine-grained permission editor backed by database policies
- Activity audit logs and websocket notifications
- Unit and integration test suites

## Suggested Commit Messages

- `feat: scaffold MERN RBAC task management dashboard`
- `feat: add JWT auth, RBAC middleware, and analytics APIs`
- `feat: build responsive dashboard UI with task kanban and charts`
- `docs: add setup, deployment, and API usage guide`
