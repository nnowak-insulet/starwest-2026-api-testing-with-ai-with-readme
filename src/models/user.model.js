const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('password123', 10)
  },
  {
    id: 2,
    username: 'bob',
    email: 'bob@example.com',
    password: bcrypt.hashSync('password123', 10)
  },
  {
    id: 3,
    username: 'carol',
    email: 'carol@example.com',
    password: bcrypt.hashSync('password123', 10)
  }
];

module.exports = users;
