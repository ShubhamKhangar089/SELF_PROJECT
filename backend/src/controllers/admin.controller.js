import User from '../model/user.model.js';
import Game from '../model/game.model.js';

// GET /api/admin/stats - basic aggregate stats for dashboard
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalGames, waitingGames, inProgressGames, finishedGames, todayGames] =
      await Promise.all([
        User.countDocuments({}),
        Game.countDocuments({}),
        Game.countDocuments({ status: 'waiting' }),
        Game.countDocuments({ status: 'in_progress' }),
        Game.countDocuments({ status: 'finished' }),
        Game.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
      ]);

    return res.status(200).json({
      totalUsers,
      totalGames,
      waitingGames,
      inProgressGames,
      finishedGames,
      todayGames,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getAdminStats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/admin/recent-games - recent games table
export const getRecentGames = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const games = await Game.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('players.x', 'name email')
      .populate('players.o', 'name email');

    return res.status(200).json(games);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getRecentGames error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/admin/users - basic user list for admin
export const getUsers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email role createdAt');

    return res.status(200).json(users);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getUsers error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


