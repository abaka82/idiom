'use strict';

/**
 * Module dependencies
 */
var idiomsPolicy = require('../policies/idioms.server.policy'),
  idioms = require('../controllers/idioms.server.controller');

module.exports = function(app) {
  // Articles collection routes
  app.route('/api/idioms').all(idiomsPolicy.isAllowed)
    .get(idioms.list)
    .post(idioms.create);

  // Single idiom routes
  app.route('/api/idioms/:idiomId').all(idiomsPolicy.isAllowed)
    .get(idioms.read)
    .put(idioms.update)
    .delete(idioms.delete);
};