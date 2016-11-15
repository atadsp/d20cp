'use strict';

/**
 * Module dependencies
 */
var magicitemsPolicy = require('../policies/magicitems.server.policy'),
  magicitems = require('../controllers/magicitems.server.controller');

module.exports = function(app) {
  // Magicitems Routes
  app.route('/api/magicitems').all(magicitemsPolicy.isAllowed)
    .get(magicitems.list)
    .post(magicitems.create);

  app.route('/api/magicitems/:magicitemId').all(magicitemsPolicy.isAllowed)
    .get(magicitems.read)
    .put(magicitems.update)
    .delete(magicitems.delete);

  // Finish by binding the Magicitem middleware
  app.param('magicitemId', magicitems.magicitemByID);
};
