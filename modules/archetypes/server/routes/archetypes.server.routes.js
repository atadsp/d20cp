'use strict';

/**
 * Module dependencies
 */
var archetypesPolicy = require('../policies/archetypes.server.policy'),
  archetypes = require('../controllers/archetypes.server.controller');

module.exports = function(app) {
  // Archetypes Routes
  app.route('/api/archetypes').all(archetypesPolicy.isAllowed)
    .get(archetypes.list)
    .post(archetypes.create);

  app.route('/api/archetypes/:archetypeId').all(archetypesPolicy.isAllowed)
    .get(archetypes.read)
    .put(archetypes.update)
    .delete(archetypes.delete);

  // Finish by binding the Archetype middleware
  app.param('archetypeId', archetypes.archetypeByID);
};
