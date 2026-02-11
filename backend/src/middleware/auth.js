import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

// Verify JWT and attach user to request
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(payload.sub).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user._id, role: user.role, email: user.email, name: user.name };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


