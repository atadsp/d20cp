'use strict';

/**
 * Module dependencies
 */
var mundanesPolicy = require('../policies/mundanes.server.policy'),
  mundanes = require('../controllers/mundanes.server.controller');

module.exports = function(app) {
  // Mundanes Routes
  app.route('/api/mundanes').all(mundanesPolicy.isAllowed)
    .get(mundanes.list)
    .post(mundanes.create);

  app.route('/api/mundanes/:mundaneId').all(mundanesPolicy.isAllowed)
    .get(mundanes.read)
    .put(mundanes.update)
    .delete(mundanes.delete);

  // Finish by binding the Mundane middleware
  app.param('mundaneId', mundanes.mundaneByID);
};
