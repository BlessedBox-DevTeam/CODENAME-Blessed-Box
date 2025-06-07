const db = require('../db.js');

const create = async (username, password, email) => {
  const [result] = await db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, password, email]
  );
  return result;
};

const findByCredentials = async (email, password) => {
  const [rows] = await db.query(
    'SELECT * FROM usersdetails WHERE email = ? AND passwordHash = ?',
    [email, password]
  );
  return rows[0]; // o null si no existe
};

module.exports ={
  create,
  findByCredentials,
};
