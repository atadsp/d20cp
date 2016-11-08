'use strict';

/**
 * Module dependencies
 */
var featcategoriesPolicy = require('../policies/featcategories.server.policy'),
  featcategories = require('../controllers/featcategories.server.controller');

module.exports = function(app) {
  // Featcategories Routes
  app.route('/api/featcategories').all(featcategoriesPolicy.isAllowed)
    .get(featcategories.list)
    .post(featcategories.create);

  app.route('/api/featcategories/:featcategoryId').all(featcategoriesPolicy.isAllowed)
    .get(featcategories.read)
    .put(featcategories.update)
    .delete(featcategories.delete);

  // Finish by binding the Featcategory middleware
  app.param('featcategoryId', featcategories.featcategoryByID);
};
