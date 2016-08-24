'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a equivalent
 */
exports.create = function(req, res) {
  // save and return and instance of equivalent on the res object. 
  db.Equivalent.create({
    equiv_idiom: req.body.equiv_idiom,
    language: req.body.language,
    idiomId: req.body.idiomId,
    userId: req.user.id
  })
  .then(function(newEquivalent) {
    return res.json(newEquivalent);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an equivalent
 */
exports.delete = function(req, res) {
  // console.log('* equivalents.server.controller - delete *');

  var id = req.params.equivalentId;

  db.Equivalent
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(equivalent) {
      equivalent.destroy()
        .then(function() {
          return res.json(equivalent);
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
 * List of Equivalents
 */
exports.list = function(req, res) {
  // console.log('* equivalents.server.controller - list *');

  db.Equivalent.findAll({
    include: [
      db.User
    ]
  })
  .then(function(equivalents) {
    return res.json(equivalents);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Equivalents by Idiom
 */
exports.getEquivalentsByIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Equivalent.findAll({
    where: {
      idiomId: idiomId
    },
    include: [
      db.User
    ]
  })
  .then(function(equivalents) {
    return res.json(equivalents);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current equivalent
 */
exports.read = function(req, res) {
  // console.log('* equivalents.server.controller - read *');

  var id = req.params.equivalentId;

  db.Equivalent.find({
    where: {
      id: id
    },
    include: [
      db.User
    ]
  })
  .then(function(equivalent) {
    return res.json(equivalent);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update a equivalent
 */
exports.update = function(req, res) {
  // console.log('* equivalents.server.controller - update *');

  var id = req.params.equivalentId;

  db.Equivalent
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(equivalent) {
      equivalent.updateAttributes({
        equiv_idiom: req.body.equiv_idiom,
        language: req.body.language,
        idiomId: req.body.idiomId
      })
      .then(function() {
        return res.json(equivalent);
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
