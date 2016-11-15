'use strict';

/**
 * Module dependencies
 */
var weaponsPolicy = require('../policies/weapons.server.policy'),
  weapons = require('../controllers/weapons.server.controller');

module.exports = function(app) {
  // Weapons Routes
  app.route('/api/weapons').all(weaponsPolicy.isAllowed)
    .get(weapons.list)
    .post(weapons.create);

  app.route('/api/weapons/:weaponId').all(weaponsPolicy.isAllowed)
    .get(weapons.read)
    .put(weapons.update)
    .delete(weapons.delete);

  // Finish by binding the Weapon middleware
  app.param('weaponId', weapons.weaponByID);
};
