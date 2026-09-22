const checkoutService = require('../services/checkout.service');

function checkout(req, res) {
  try {
    const result = checkoutService.checkout(req.body);
    return res.status(200).json({
      message: 'Checkout completed successfully',
      user: {
        id: req.user.id,
        username: req.user.username
      },
      order: result
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: error.message || 'Internal server error'
    });
  }
}

module.exports = {
  checkout
};
