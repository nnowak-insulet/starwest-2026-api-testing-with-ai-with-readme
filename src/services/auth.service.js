const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key';
const JWT_EXPIRES_IN = '1h';

function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

function register({ username, email, password }) {
  if (!username || !email || !password) {
    const error = new Error('Username, email, and password are required');
    error.status = 400;
    throw error;
  }

  if (findUserByUsername(username)) {
    const error = new Error('Username already exists');
    error.status = 409;
    throw error;
  }

  if (findUserByEmail(email)) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: bcrypt.hashSync(password, 10)
  };

  users.push(newUser);

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email
  };
}

function login({ username, password }) {
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  const user = findUserByUsername(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  register,
  login,
  verifyToken,
  JWT_SECRET
};
