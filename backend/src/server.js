import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import app from './app.js';
import Game from './model/game.model.js';
import { applyMove, checkWinner, getNextTurn, isValidMove } from './utils/tictactoe.js';
import User from './model/user.model.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      },
    });

    // Socket.io authentication middleware (per connection)
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;

        if (!token) {
          return next(new Error('Unauthorized'));
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        const user = await User.findById(payload.sub).select('name email role');

        if (!user) {
          return next(new Error('Unauthorized'));
        }

        // Attach minimal user info to socket
        socket.user = {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        };

        return next();
      } catch (err) {
        return next(new Error('Unauthorized'));
      }
    });

    io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log('Socket connected:', socket.id, 'user:', socket.user?.email);

      // Join a game room
      socket.on('join_game', async ({ gameId }) => {
        try {
          if (!gameId) return;

          const game = await Game.findById(gameId);
          if (!game) {
            return socket.emit('game_error', { message: 'Game not found' });
          }

          const userId = socket.user?.id;
          const isPlayerX = String(game.players.x) === String(userId);
          const isPlayerO = game.players.o && String(game.players.o) === String(userId);

          // Allow only players for now (spectators can be added later)
          if (!isPlayerX && !isPlayerO) {
            return socket.emit('game_error', { message: 'You are not a player in this game' });
          }

          socket.join(gameId);
          // Send full state to the joining client
          socket.emit('game_state', game);
          // Also broadcast to everyone in the room so the other player sees updated status
          socket.to(gameId).emit('game_update', game);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('join_game error:', error);
          socket.emit('game_error', { message: 'Failed to join game' });
        }
      });

      // Handle a move from a player
      socket.on('make_move', async ({ gameId, index }) => {
        try {
          if (index === undefined || index === null || !gameId) return;

          const game = await Game.findById(gameId);
          if (!game) {
            return socket.emit('game_error', { message: 'Game not found' });
          }

          if (game.status !== 'in_progress') {
            return socket.emit('game_error', { message: 'Game is not in progress' });
          }

          const userId = socket.user?.id;
          const isPlayerX = String(game.players.x) === String(userId);
          const isPlayerO = game.players.o && String(game.players.o) === String(userId);

          if (!isPlayerX && !isPlayerO) {
            return socket.emit('game_error', { message: 'You are not a player in this game' });
          }

          const currentSymbol = isPlayerX ? 'X' : isPlayerO ? 'O' : null;

          if (currentSymbol !== game.currentTurn) {
            return socket.emit('game_error', { message: 'Not your turn' });
          }

          if (!isValidMove(game.board, index)) {
            return socket.emit('game_error', { message: 'Invalid move' });
          }

          const nextBoard = applyMove(game.board, index, currentSymbol);
          const winner = checkWinner(nextBoard);

          game.board = nextBoard;

          if (winner) {
            game.status = 'finished';
            game.winner = winner;
          } else {
            game.currentTurn = getNextTurn(game.currentTurn);
          }

          await game.save();

          io.to(gameId).emit('game_update', game);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('make_move error:', error);
          socket.emit('game_error', { message: 'Failed to make move' });
        }
      });

      // Handle chat messages inside a game room
      socket.on('chat_message', async ({ gameId, text }) => {
        try {
          const trimmed = typeof text === 'string' ? text.trim() : '';
          if (!gameId || !trimmed) return;

          const game = await Game.findById(gameId);
          if (!game) {
            return socket.emit('game_error', { message: 'Game not found' });
          }

          const userId = socket.user?.id;
          const isPlayerX = String(game.players.x) === String(userId);
          const isPlayerO = game.players.o && String(game.players.o) === String(userId);

          if (!isPlayerX && !isPlayerO) {
            return socket.emit('game_error', { message: 'You are not a player in this game' });
          }

          const message = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            gameId,
            text: trimmed,
            senderId: socket.user.id,
            senderName: socket.user.name || socket.user.email,
            createdAt: new Date().toISOString(),
          };

          io.to(gameId).emit('chat_message', message);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('chat_message error:', error);
          socket.emit('game_error', { message: 'Failed to send message' });
        }
      });

      // Allow clients to request latest state explicitly
      socket.on('request_state', async ({ gameId }) => {
        try {
          if (!gameId) return;
          const game = await Game.findById(gameId);
          if (!game) {
            return socket.emit('game_error', { message: 'Game not found' });
          }
          socket.emit('game_state', game);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('request_state error:', error);
          socket.emit('game_error', { message: 'Failed to fetch game state' });
        }
      });

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('Socket disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
