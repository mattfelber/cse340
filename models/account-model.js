const pool = require("../database/index");
const crypto = require('crypto');

// Function to hash a password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Function to verify if the input password matches the hashed password
function verifyPassword(inputPassword, storedHash) {
  const hashedInput = crypto.createHash('sha256').update(inputPassword).digest('hex');
  return hashedInput === storedHash;
}

// Function to update the password in the database
async function updatePassword(hashedPassword, accountId) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2";
    const result = await pool.query(sql, [hashedPassword, accountId]);
    return result.rowCount;
  } catch (error) {
    throw new Error("Failed to update password.");
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  updatePassword,
};
