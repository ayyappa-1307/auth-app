# Auth App

Full-stack JWT authentication monorepo:

- `user/` — Vite + React SPA (Tailwind CSS, React Router, Axios)
- `server/` — Spring Boot 3.4 API (Spring Security, JPA, H2 / PostgreSQL, JJWT)

## Local run

### 1. Backend

Requires **JDK 17+** and Maven Wrapper (included).

```bash
cd server
./mvnw spring-boot:run
```

On Windows:

```powershell
cd server
.\mvnw.cmd spring-boot:run
```

API: [http://localhost:8080](http://localhost:8080)

H2 console (dev only): [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
JDBC URL `jdbc:h2:mem:authdb`, user `sa`, empty password.

Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins |
| `JWT_SECRET` | (dev placeholder) | HMAC signing secret (use a long random value in production) |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime (24h) |

### 2. Frontend

```bash
cd user
cp .env.example .env
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

`VITE_API_BASE_URL` defaults to `http://localhost:8080`.

### API

| Method | Path | Auth | Body / result |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | `{ "email" or "username", "password", "fullName" }` → JWT + user |
| `POST` | `/api/auth/login` | No | `{ "email" or "username", "password" }` → JWT + user |
| `GET` | `/api/user/me` | Bearer token | Current user profile |

## Deployment

### Backend (Render, Railway, Fly.io)

`server/Dockerfile` is production-ready and starts with `SPRING_PROFILES_ACTIVE=prod` (PostgreSQL).

Set:

- `JWT_SECRET` — long random string (32+ characters)
- `CORS_ALLOWED_ORIGINS` — your Vercel URL, e.g. `https://your-app.vercel.app`
- `SPRING_DATASOURCE_URL` — `jdbc:postgresql://HOST:5432/DATABASE`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `PORT` — provided automatically on most hosts

Example Render/Railway Docker command is the image `ENTRYPOINT` (`java -jar app.jar`). Bind to `$PORT` via `server.port=${PORT:8080}`.

### Frontend (Vercel)

1. Root directory: `user`
2. Build command: `npm run build`
3. Output: `dist`
4. Env: `VITE_API_BASE_URL=https://your-api.onrender.com`
5. `vercel.json` rewrites all routes to `index.html` for the SPA.

Redeploy the frontend after changing `VITE_API_BASE_URL` (Vite inlines env at build time).
