'use strict';

/**
 * Module dependencies
 */
var psionicsPolicy = require('../policies/psionics.server.policy'),
  psionics = require('../controllers/psionics.server.controller');

module.exports = function(app) {
  // Psionics Routes
  app.route('/api/psionics').all(psionicsPolicy.isAllowed)
    .get(psionics.list)
    .post(psionics.create);

  app.route('/api/psionics/:psionicId').all(psionicsPolicy.isAllowed)
    .get(psionics.read)
    .put(psionics.update)
    .delete(psionics.delete);

  // Finish by binding the Psionic middleware
  app.param('psionicId', psionics.psionicByID);
};
