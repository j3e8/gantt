const jwt = require('../lib/jwt').jwt;
const ErrorHandler = require('../lib/error-handler');
const User = require('../api/user');

module.exports = function(app) {
  app.post('/api/user/authenticate', function(req, res) {
    User.authenticate(req.headers, req.body)
    .then((token) => res.send(token))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
