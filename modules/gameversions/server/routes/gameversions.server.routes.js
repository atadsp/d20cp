'use strict';

/**
 * Module dependencies
 */
var gameversionsPolicy = require('../policies/gameversions.server.policy'),
  gameversions = require('../controllers/gameversions.server.controller');

module.exports = function(app) {
  // Gameversions Routes
  app.route('/api/gameversions').all(gameversionsPolicy.isAllowed)
    .get(gameversions.list)
    .post(gameversions.create);

  app.route('/api/gameversions/:gameversionId').all(gameversionsPolicy.isAllowed)
    .get(gameversions.read)
    .put(gameversions.update)
    .delete(gameversions.delete);

  // Finish by binding the Gameversion middleware
  app.param('gameversionId', gameversions.gameversionByID);
};
