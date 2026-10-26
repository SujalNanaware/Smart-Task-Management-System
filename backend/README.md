# TaskFlow backend

The API uses Express and stores accounts, sessions, and tasks in `backend/data/store.json`. The data file is created on first start and is intentionally excluded from Git. Passwords are stored as salted scrypt hashes; authenticated API requests use bearer tokens.

## Start the API

```powershell
cd backend
npm install
npm run dev
```

The server listens on port `5000` by default. Set `PORT`, `CORS_ORIGIN`, or `DATA_FILE` in `backend/.env` to override the port, configure one or more comma-separated frontend origins, or choose another data-file location.

The Vite development server proxies `/api` to `http://localhost:5000`. For a separately hosted frontend, set `VITE_API_URL` to the API base URL, including `/api`.

## API

- `GET /api/health`
- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `GET /api/auth/me` and `POST /api/auth/logout` (bearer token required)
- `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, and `DELETE /api/tasks/:id` (bearer token required)

Task fields are `title`, `desc` (or `description`), `category`, `priority`, `dueDate`, `status`, and optional `progress`.
