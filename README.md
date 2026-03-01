# NeuroFleet Monorepo

Project structure is now split for clarity:

- `frontend/` → React + Vite + Tailwind UI
- `backend/` → Spring Boot API

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Build:

```powershell
cd frontend
npm run build
```

## Backend

```powershell
cd backend
mvn spring-boot:run
```
