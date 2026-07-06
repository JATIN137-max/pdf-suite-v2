// middleware/optionalAuth.js
// Unlike requireAuth, this never blocks the request - it just identifies
// a logged-in user if a valid token is present, so routes that stay open
// to everyone (like PDF conversion) can still give logged-in users a
// higher rate limit. Invalid/expired tokens are treated as anonymous
// rather than rejected, since login isn't required here.

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ewn_super_secret_key_123';

module.exports = function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      // Invalid or expired - fall through as anonymous, don't block.
    }
  }
  next();
};