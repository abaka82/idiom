'use strict';

/**
 * Module dependencies
 */
var translationsPolicy = require('../policies/translations.server.policy'),
  translations = require('../controllers/translations.server.controller');

module.exports = function(app) {
  // Articles collection routes
  app.route('/api/translations').all(translationsPolicy.isAllowed)
    .get(translations.list)
    .post(translations.create);

  // Single translation routes
  app.route('/api/translations/:translationId').all(translationsPolicy.isAllowed)
    .get(translations.read)
    .put(translations.update)
    .delete(translations.delete);
};