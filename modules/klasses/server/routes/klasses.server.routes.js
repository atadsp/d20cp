'use strict';

/**
 * Module dependencies
 */
var klassesPolicy = require('../policies/klasses.server.policy'),
  klasses = require('../controllers/klasses.server.controller');

module.exports = function(app) {
  // Klasses Routes
  app.route('/api/klasses').all(klassesPolicy.isAllowed)
    .get(klasses.list)
    .post(klasses.create);

  app.route('/api/klasses/:klassId').all(klassesPolicy.isAllowed)
    .get(klasses.read)
    .put(klasses.update)
    .delete(klasses.delete);

  // Finish by binding the Klass middleware
  app.param('klassId', klasses.klassByID);
};
