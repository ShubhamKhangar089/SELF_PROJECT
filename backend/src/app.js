import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import matchmakingRoutes from './routes/matchmaking.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
console.log("SOCKET CLIENT_URL:", process.env.CLIENT_URL);
app.use(
  cors({
    origin: "https://tic-tac-toe-steel-one-68.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Game routes
app.use('/api/games', gameRoutes);

// Matchmaking routes
app.use('/api/matchmaking', matchmakingRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

export default app;