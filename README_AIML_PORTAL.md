# AIML Department Activity Portal

Full-stack activity portal for an AIML department with a public viewer site and JWT-secured admin dashboard.

## Folder Structure

```text
frontend/   React + Vite + Tailwind CSS + Axios + React Router + Chart.js
backend/    Node.js + Express + MongoDB Atlas + Mongoose + JWT + Cloudinary
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed:admin
npm run dev
```

Set these values in `backend/.env`:

- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: long random signing secret.
- `CLIENT_URL`: frontend URL, for example `https://aiml-frontend.onrender.com`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary credentials.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: initial admin account used by `npm run seed:admin`.

Main API routes:

- `POST /api/auth/login`
- `GET|POST /api/events`, `GET|PUT|DELETE /api/events/:id`
- `GET|POST /api/achievements`, `GET|PUT|DELETE /api/achievements/:id`
- `GET|POST /api/internships`, `GET|PUT|DELETE /api/internships/:id`
- `GET|POST /api/placements`, `GET|PUT|DELETE /api/placements/:id`
- `GET /api/placements/stats/summary`

Admin write routes require `Authorization: Bearer <token>`.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_URL=https://aiml-backend.onrender.com` in `frontend/.env`.

Public pages:

- `/`
- `/events`
- `/achievements`
- `/internships`
- `/placements`

Admin pages:

- `/admin/login`
- `/admin`
- `/admin/events`
- `/admin/achievements`
- `/admin/internships`
- `/admin/placements`

## Deployment

### Render Backend

1. Create a Render Web Service using `backend` as the root directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all backend environment variables.
5. After first deploy, run `npm run seed:admin` from the Render shell.

### Vercel Frontend

1. Create a Vercel project using `frontend` as the root directory.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `VITE_API_URL=https://your-render-service.onrender.com/api`.

## Notes

- Lists support `search`, `page`, and `limit` query params.
- Events support `category`, `from`, and `to`.
- Achievements support `achieverType`.
- Internships and placements support `academicYear`.
- Event and achievement image uploads are sent to Cloudinary with Multer memory storage.
