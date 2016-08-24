'use strict';

/**
 * Module dependencies
 */
var equivalentsPolicy = require('../policies/equivalents.server.policy'),
  equivalents = require('../controllers/equivalents.server.controller');

module.exports = function(app) {
  // Equivalent collection routes
  app.route('/api/equivalents').all(equivalentsPolicy.isAllowed)
    .get(equivalents.list)
    .post(equivalents.create);

  // Single equivalent routes
  app.route('/api/equivalents/:equivalentId').all(equivalentsPolicy.isAllowed)
    .get(equivalents.read)
    .put(equivalents.update)
    .delete(equivalents.delete);

  // Equivalent by idiom id
  app.route('/api/getEquivalentsByIdiom/:idiomId').all(equivalentsPolicy.isAllowed)
    .get(equivalents.getEquivalentsByIdiom);
};