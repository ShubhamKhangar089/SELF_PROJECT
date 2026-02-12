## Tic Tac Toe Arena – Real‑Time Game & Chat

Tic Tac Toe Arena is a full‑stack, production‑ready web app where users can play real‑time Tic Tac Toe with live chat, matchmaking, and an admin dashboard for monitoring activity.

---

## Features

- **Authentication & RBAC**
  - Email + password login/register
  - JWT-based auth
  - Roles: **user** (play) and **admin** (dashboard access)
  - Protected routes on frontend and backend

- **Real‑Time Tic Tac Toe**
  - Create games as **X**
  - Join games as **O** via ID or **Open Games** list
  - Real-time board updates using Socket.io
  - Game status: `waiting → in_progress → finished`
  - Rematch flow with “request / accept / decline”
  - Local scoreboard for wins/draws per session

- **Real‑Time Chat**
  - In‑room chat between the two players
  - Messages broadcast via Socket.io
  - Shows sender name and timestamp

- **Lobby & Matchmaking**
  - **Home / Lobby** page:
    - Start new game as X
    - Join by Game ID
    - Quick Match: in‑memory queue to auto‑pair players
  - **Open Games** list:
    - Shows waiting games with host info and created time
    - One‑click “Join” button

- **Presence & UX**
  - Online users count in navbar (via Socket.io)
  - Responsive UI with Tailwind CSS
  - Game‑themed login/register UI
  - Clean navigation with role‑based redirects

- **Admin Dashboard**
  - Summary stats: total users, total games, active/finished games
  - Recent games table
  - Recent users table
  - Only accessible to `admin` role

---

## Tech Stack

- **Frontend**
  - React + Vite
  - React Router DOM
  - Redux Toolkit (auth, game, chat, presence)
  - Socket.io Client
  - Tailwind CSS
- **Backend**
  - Node.js + Express
  - MongoDB + Mongoose
  - JWT, bcryptjs
  - Socket.io
  - Render (deployment target)
- **Auth & Security**
  - JWT tokens
  - HTTP-only cookies
  - Role-based access control

---

## Running the App Locally

### 1. Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local or MongoDB Atlas)

---

### 2. Backend – Setup & Run

From the project root:

cd backend
npm installCreate a `.env` file in `backend/`:

MONGODB_URI=mongodb://localhost:27017/tictactoe-arena   # or your Atlas URI
JWT_SECRET=super-secret-key-change-me
CLIENT_URL=http://localhost:5173Run the backend in dev mode:

npm run devThis will start the server (by default on `http://localhost:5000`) and Socket.io on the same origin.

---

### 3. Frontend – Setup & Run

In a new terminal, from the project root:

cd frontend
npm installCreate a `.env` file in `frontend/` (Vite uses `VITE_` prefix):

VITE_API_BASE_URL=http://localhost:5000/apiStart the Vite dev server:

npm run devOpen the URL shown in the terminal, usually:

http://localhost:5173---

## Local Usage Flow

- **Register**
  - Open `/register`, create a user with role `user` or `admin`.
- **Login**
  - Login at `/login`.
  - `user` → redirected to **Home** (Lobby).
  - `admin` → redirected to **Admin Dashboard**.
- **As User**
  - In **Home / Lobby**:
    - Start new game as X, share the game ID with a friend.
    - Join an existing game by ID.
    - Use **Quick Match** to auto‑pair.
    - Join from the **Open Games** list.
  - In **Game Room**:
    - Play moves in real time.
    - Chat with opponent.
    - Request / accept rematch after game ends.
- **As Admin**
  - Go to `/admin`:
    - View high‑level stats.
    - See recent games and recent users.

---

## Deployment (Summary)

- **Backend (Render Web Service)**
  - Root: `backend`
  - Start command: `npm start`
  - Env vars:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `CLIENT_URL=https://your-frontend-domain`
- **Frontend (Vercel / Netlify)**
  - Root: `frontend`
  - Build: `npm run build`
  - Output: `dist`
  - Env vars:
    - `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

Once both are deployed, update `CLIENT_URL` on the backend to match the deployed frontend origin and redeploy the backend.

---
