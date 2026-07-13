const jwt = require('jsonwebtoken');

// Secret key - MUST be kept secret and stored in server/.env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add it to server/.env');
}

// Generate JWT token after successful login
// Payload: { userId, email } - data to encode in token
const generateToken = (userId, email) => {
  try {
    const token = jwt.sign(
      { userId, email }, // Payload - data encoded in token
      JWT_SECRET, // Secret key - used to verify token signature
      { expiresIn: JWT_EXPIRE } // Options
    );
    return token;
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

// Verify JWT token - used by auth middleware
// Checks if token is valid and not expired
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Returns { userId, email, iat, exp }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error(`Invalid token: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
