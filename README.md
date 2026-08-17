# Coconut Management System

A full-stack Coconut Processing ERP/Management System with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB database

## Features
- Authentication and role-based access
- Dashboard and operations modules
- Intake, production, inventory, quality, sales, and settings APIs/pages
- User management

## Tech Stack
- Frontend: React, Vite, React Router
- Backend: Node.js, Express, Mongoose
- Security: Helmet, JWT, bcrypt
- Database: MongoDB

## Project Structure

```text
client/     React app (Vite)
server/     Express API + MongoDB models/routes
RUN_SYSTEM.bat   First-time setup + start
START_SYSTEM.bat Start only (after dependencies are installed)
```

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm
- MongoDB Atlas connection string (or local MongoDB fallback)

## Environment Variables
Create a file at `server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace_with_strong_secret
PORT=5000

# Optional local fallback if Atlas is temporarily unavailable
MONGODB_FALLBACK_URI=mongodb://127.0.0.1:27017/coconut_erp
```

## Run the Project (Windows)

### Option 1: First-time setup (recommended)
Run:

```bat
RUN_SYSTEM.bat
```

This will:
- install backend dependencies (if missing)
- install frontend dependencies (if missing)
- start backend and frontend in separate terminals
- open http://localhost:5173

### Option 2: Quick start (after first install)
Run:

```bat
START_SYSTEM.bat
```

## Manual Run (Any OS)

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Start backend

```bash
cd server
npm run dev
```

### 3) Start frontend

```bash
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## API Health Check
- GET http://localhost:5000/api/health

## Preparing for GitHub
This repository is now prepared for GitHub with:
- a root `README.md`
- a root `.gitignore`

## Initialize and Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

## Notes
- If MongoDB Atlas fails to connect, verify your current public IP is allowed in Atlas Network Access.
- Keep `server/.env` private and never commit secrets.
