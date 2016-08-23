'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a translation
 */
exports.create = function(req, res) {
  // save and return and instance of translation on the res object. 
  db.Translation.create({
    translation: req.body.translation,
    language: req.body.language,
    idiomId: req.body.idiomId,
    userId: req.user.id
  })
  .then(function(newTranslation) {
    return res.json(newTranslation);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an translation
 */
exports.delete = function(req, res) {
  // console.log('* translations.server.controller - delete *');

  var id = req.params.translationId;

  db.Translation
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(translation) {
      translation.destroy()
        .then(function() {
          return res.json(translation);
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Translations
 */
exports.list = function(req, res) {
  // console.log('* translations.server.controller - list *');

  db.Translation.findAll({
    include: [
      db.User
    ]
  })
  .then(function(translations) {
    return res.json(translations);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Translations by Idiom
 */
exports.getTranslationsByIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Translation.findAll({
    where: {
      idiomId: idiomId
    },
    include: [
      db.User
    ]
  })
  .then(function(translations) {
    return res.json(translations);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current translation
 */
exports.read = function(req, res) {
  // console.log('* translations.server.controller - read *');

  var id = req.params.translationId;

  db.Translation.find({
    where: {
      id: id
    },
    include: [
      db.User
    ]
  })
  .then(function(translation) {
    return res.json(translation);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update a translation
 */
exports.update = function(req, res) {
  // console.log('* translations.server.controller - update *');

  var id = req.params.translationId;

  db.Translation
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(translation) {
      translation.updateAttributes({
        translation: req.body.translation,
        language: req.body.language,
        idiomId: req.body.idiomId
      })
      .then(function() {
        return res.json(translation);
      })
      .catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};
