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

  app.route('/api/idioms/picture').post(idioms.changePicture);

  // get prev idiom id
  app.route('/api/getPrevIdiom/:idiomId').all(idiomsPolicy.isAllowed)
    .get(idioms.getPrevIdiom);

  // get next idiom id
  app.route('/api/getNextIdiom/:idiomId').all(idiomsPolicy.isAllowed)
    .get(idioms.getNextIdiom);

  // get random idiom id
  app.route('/api/getRandomIdiom/:idiomId').all(idiomsPolicy.isAllowed)
    .get(idioms.getRandomIdiom);
};