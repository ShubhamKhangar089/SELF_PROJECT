import Game from '../model/game.model.js';
import { emitToUser } from '../socket/connectionRegistry.js';

// Simple in-memory queue for matchmaking (single-instance only)
const waitingPlayers = [];

// POST /api/matchmaking/join
export const joinMatchmaking = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Remove any existing entry for this user
    const normalizedUserId = String(userId);
    for (let i = waitingPlayers.length - 1; i >= 0; i -= 1) {
      if (String(waitingPlayers[i].userId) === normalizedUserId) {
        waitingPlayers.splice(i, 1);
      }
    }

    if (waitingPlayers.length > 0) {
      // Match with the earliest waiting player
      const opponent = waitingPlayers.shift();

      // For fairness, keep opponent as X, current user as O
      const game = await Game.create({
        players: {
          x: opponent.userId,
          o: userId,
        },
        status: 'in_progress',
        currentTurn: 'X',
      });

      // Notify the waiting player via socket, if connected
      emitToUser(opponent.userId, 'match_found', {
        status: 'matched',
        gameId: game._id,
        game,
      });

      return res.status(200).json({
        status: 'matched',
        gameId: game._id,
        game,
      });
    }

    // No opponent waiting, add current user to queue
    waitingPlayers.push({
      userId,
      createdAt: new Date(),
    });

    return res.status(200).json({ status: 'waiting' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('joinMatchmaking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/matchmaking/leave
export const leaveMatchmaking = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const normalizedUserId = String(userId);
    for (let i = waitingPlayers.length - 1; i >= 0; i -= 1) {
      if (String(waitingPlayers[i].userId) === normalizedUserId) {
        waitingPlayers.splice(i, 1);
      }
    }

    return res.status(204).end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('leaveMatchmaking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


