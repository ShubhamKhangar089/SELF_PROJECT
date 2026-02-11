import Game from '../model/game.model.js';

// POST /api/games - create a new game with current user as X
export const createGame = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const game = await Game.create({
      players: {
        x: userId,
        o: null,
      },
      status: 'waiting',
      currentTurn: 'X',
    });

    return res.status(201).json(game);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create game error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/games/:id/join - join as O player
export const joinGame = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (String(game.players.x) === String(userId)) {
      return res.status(400).json({ message: 'You are already in this game as X' });
    }

    if (game.players.o && String(game.players.o) !== String(userId)) {
      return res.status(400).json({ message: 'Game is already full' });
    }

    // If O is empty, join as O
    game.players.o = userId;
    game.status = 'in_progress';
    await game.save();

    return res.status(200).json(game);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Join game error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/games/:id - fetch game state
export const getGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id)
      .populate('players.x', 'name email')
      .populate('players.o', 'name email');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    return res.status(200).json(game);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Get game error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


