// middleware/auth.js
// Protects routes that require a logged-in user (e.g. Solvent AI).
// Verifies the JWT issued by authController.login/register and attaches
// the user's id to req.userId for the route handler to use.

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ewn_super_secret_key_123';

module.exports = function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Please log in to use this feature.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
};