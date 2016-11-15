'use strict';

/**
 * Module dependencies
 */
var armorsPolicy = require('../policies/armors.server.policy'),
  armors = require('../controllers/armors.server.controller');

module.exports = function(app) {
  // Armors Routes
  app.route('/api/armors').all(armorsPolicy.isAllowed)
    .get(armors.list)
    .post(armors.create);

  app.route('/api/armors/:armorId').all(armorsPolicy.isAllowed)
    .get(armors.read)
    .put(armors.update)
    .delete(armors.delete);

  // Finish by binding the Armor middleware
  app.param('armorId', armors.armorByID);
};
