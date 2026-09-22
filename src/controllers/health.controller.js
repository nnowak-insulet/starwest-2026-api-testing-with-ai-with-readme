function healthcheck(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  healthcheck
};
