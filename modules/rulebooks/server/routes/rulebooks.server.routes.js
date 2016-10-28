'use strict';

/**
 * Module dependencies
 */
var rulebooksPolicy = require('../policies/rulebooks.server.policy'),
  rulebooks = require('../controllers/rulebooks.server.controller');

module.exports = function(app) {
  // Rulebooks Routes
  app.route('/api/rulebooks').all(rulebooksPolicy.isAllowed)
    .get(rulebooks.list)
    .post(rulebooks.create);

  app.route('/api/rulebooks/:rulebookId').all(rulebooksPolicy.isAllowed)
    .get(rulebooks.read)
    .put(rulebooks.update)
    .delete(rulebooks.delete);

  // Finish by binding the Rulebook middleware
  app.param('rulebookId', rulebooks.rulebookByID);
};
