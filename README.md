## Tic Tac Toe Arena – Real‑Time Game & Chat

Tic Tac Toe Arena is a full‑stack, production‑ready web app where users can play real‑time Tic Tac Toe with live chat, matchmaking, and an admin dashboard for monitoring activity.

---

## Features

- **Authentication & RBAC**
  - Email + password login/register
  - JWT-based auth with HTTP-only cookies
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

## Project Structure

SELF_PROJECT/
├─ backend/
│  ├─ package.json
│  └─ src/
│     ├─ app.js                # Express app, routes, CORS, middleware
│     ├─ server.js             # HTTP + Socket.io server, game events, chat, presence
│     ├─ config/
│     │  └─ db.js              # MongoDB connection
│     ├─ controllers/
│     │  ├─ auth.controller.js
│     │  ├─ game.controller.js
│     │  ├─ matchmaking.controller.js
│     │  └─ admin.controller.js
│     ├─ middleware/
│     │  └─ auth.js            # JWT auth + role checks
│     ├─ model/
│     │  ├─ user.model.js
│     │  └─ game.model.js
│     ├─ routes/
│     │  ├─ auth.routes.js
│     │  ├─ game.routes.js
│     │  ├─ matchmaking.routes.js
│     │  └─ admin.routes.js
│     ├─ socket/
│     │  └─ connectionRegistry.js  # Online user tracking & per‑user emits
│     └─ utils/
│        └─ tictactoe.js        # Pure game logic (moves, winner, validation)
│
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   ├─ public/
   │  ├─ vite.svg
   │  └─ realtimechatapp.svg    # Custom app icon/logo
   └─ src/
      ├─ main.jsx               # React entry, Redux Provider, Router
      ├─ App.jsx                # Routes + RequiredAuth
      ├─ App.css
      ├─ index.css
      ├─ pages/
      │  ├─ HomePage.jsx        # Lobby: start game, join, Quick Match, open games
      │  ├─ GameRoom.jsx        # Board, chat, rematch, scoreboard
      │  └─ Admin.jsx           # Admin dashboard
      ├─ components/
      │  ├─ auth/
      │  │  ├─ Login.jsx
      │  │  └─ Register.jsx
      │  ├─ common/
      │  │  ├─ Navbar.jsx
      │  │  └─ Button.jsx
      │  ├─ game/
      │  │  └─ ChatPanel.jsx
      │  └─ examples/
      │     └─ Counter.jsx
      ├─ features/
      │  ├─ auth/
      │  │  └─ auth.js          # Auth slice + thunks
      │  ├─ game/
      │  │  └─ gameSlice.js     # Game state, open games, matchmaking
      │  ├─ chat/
      │  │  └─ chatSlice.js
      │  ├─ presence/
      │  │  └─ presenceSlice.js # Online user count
      │  └─ counter/
      │     └─ counterSlice.js
      ├─ store/
      │  └─ store.js            # Redux store setup
      ├─ services/
      │  ├─ api.js              # Axios instance (base URL + credentials)
      │  └─ socket.js           # Socket.io client setup
      └─ hooks/
         └─ useGameSocket.js    # (if used) custom hook for game room socket logic---

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