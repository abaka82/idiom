'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
 * Create a idiom
 */
exports.create = function(req, res) {
  // save and return and instance of idiom on the res object. 
  db.Idiom.create({
    idiom: req.body.idiom,
    derivation: req.body.derivation,
    language: req.body.language,
    userId: req.user.id
  })
  .then(function(newIdiom) {
    return res.json(newIdiom);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update idioms picture
 */
exports.changePicture = function(req, res) {
  var idiom = req.idiom;
  var upload = multer(config.uploads.idiomUpload).single('newPicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  upload(req, res, function(uploadError) { 
    if (uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading idiom picture'
      });
    } else {
      var id = req.body.idiomId;
      db.Idiom
        .findOne({
          where: {
            id: id
          }
        })
        .then(function(idiom) {
          idiom.imageURL = config.uploads.idiomUpload.dest + req.file.filename;
          idiom
            .save()
            .then(function(idiom) {
              return res.json(idiom);
            })
            .catch(function(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
    }
  });
};

/**
 * Delete an idiom
 */
exports.delete = function(req, res) {
  // console.log('* idioms.server.controller - delete *');

  var id = req.params.idiomId;

  db.Idiom
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(idiom) {
      idiom.destroy()
        .then(function() {
          return res.json(idiom);
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
 * List of Idioms
 */
exports.list = function(req, res) {
  // console.log('* idioms.server.controller - list *');

  db.Idiom.findAll({
    include: [
      db.User
    ]
  })
  .then(function(idioms) {
    return res.json(idioms);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current idiom
 */
exports.read = function(req, res) {
  // console.log('* idioms.server.controller - read *');

  var id = req.params.idiomId;

  db.Idiom.find({
    where: {
      id: id
    },
    include: [
      db.User
    ]
  })
  .then(function(idiom) {
    return res.json(idiom);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Update a idiom
 */
exports.update = function(req, res) {
  // console.log('* idioms.server.controller - update *');

  var id = req.params.idiomId;

  db.Idiom
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(idiom) {
      idiom.updateAttributes({
        idiom: req.body.idiom,
        derivation: req.body.derivation,
        language: req.body.language
      })
      .then(function() {
        return res.json(idiom);
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
