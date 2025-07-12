module.exports = function (req, res, next) {
  // Placeholder auth middleware for testing
  // In real use, validate token or session here

  // Mock user object to simulate logged-in user
  req.user = {
    _id: '64a5f0c2f1a2b3c4d5e6f7a8' // example ObjectId string
  };

  next();
};
