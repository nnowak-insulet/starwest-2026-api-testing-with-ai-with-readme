const authService = require('../services/auth.service');

function register(req, res) {
  try {
    const user = authService.register(req.body);
    return res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

function login(req, res) {
  try {
    const result = authService.login(req.body);
    return res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = {
  register,
  login
};
