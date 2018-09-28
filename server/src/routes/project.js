const jwt = require('../lib/jwt').jwt;
const ErrorHandler = require('../lib/error-handler');
const Project = require('../api/project');

module.exports = function(app) {
  app.post('/api/project', function(req, res) {
    Project.create(req.body)
    .then((result) => res.json(result))
    .catch((err) => ErrorHandler.respondWithError(res, err));
  });
}
