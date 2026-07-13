const bcrypt = require('bcryptjs');

// Hash a plain text password before saving to database
const hashPassword = async (plainPassword) => {
  try {
    // Generate salt - higher number = slower (more secure but slower)
    // 10 is industry standard (balance between security and speed)
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

// Compare plain text password with hashed password during login
// Returns true if passwords match, false otherwise
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
