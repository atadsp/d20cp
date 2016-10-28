'use strict';

/**
 * Module dependencies
 */
var deitiesPolicy = require('../policies/deities.server.policy'),
  deities = require('../controllers/deities.server.controller');

module.exports = function(app) {
  // Deities Routes
  app.route('/api/deities').all(deitiesPolicy.isAllowed)
    .get(deities.list)
    .post(deities.create);

  app.route('/api/deities/:deityId').all(deitiesPolicy.isAllowed)
    .get(deities.read)
    .put(deities.update)
    .delete(deities.delete);

  // Finish by binding the Deity middleware
  app.param('deityId', deities.deityByID);
};
