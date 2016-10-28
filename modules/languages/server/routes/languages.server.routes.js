'use strict';

/**
 * Module dependencies
 */
var languagesPolicy = require('../policies/languages.server.policy'),
  languages = require('../controllers/languages.server.controller');

module.exports = function(app) {
  // Languages Routes
  app.route('/api/languages').all(languagesPolicy.isAllowed)
    .get(languages.list)
    .post(languages.create);

  app.route('/api/languages/:languageId').all(languagesPolicy.isAllowed)
    .get(languages.read)
    .put(languages.update)
    .delete(languages.delete);

  // Finish by binding the Language middleware
  app.param('languageId', languages.languageByID);
};
