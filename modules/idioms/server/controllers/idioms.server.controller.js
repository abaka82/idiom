'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  sequelize = require('sequelize');

/**
 * Create a idiom
 */
exports.create = function(req, res) {
  // save and return and instance of idiom on the res object. 
  db.Idiom.create({
    idiom: req.body.idiom,
    meaning: req.body.meaning,
    derivation: req.body.derivation,
    language: req.body.language,
    approved: req.body.approved,
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
          idiom.modifiedBy = req.user.id;
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
  console.log('* idioms.server.controller - delete *');
  console.log('* req.params.idiomId *'+req.params.idiomId);
  var id = req.params.idiomId;

  // 1. First delete equivalent translations
  db.Equivalent.destroy({
    where: {
      idiomId: id
    }
  })
  .then(function() {
    // 2. Then delete 121 translations
    db.Translation.destroy({
      where: {
        idiomId: id
      }
    })
    .then(function() {
      // 3. Finally delete idiom
      db.Idiom.destroy({
        where: {
          id: id
        }
      })
      .then(function() {
        return res.json(id);
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

  db.sequelize.query(
    'SELECT * FROM ' +
    '(SELECT DISTINCT a.*, b.translation, b.language AS translationLang, ' +
    '(SELECT COUNT(*) ' +
    'FROM Equivalents c ' +
    'WHERE c.idiomId = a.id) AS equivalent_count ' +
    'FROM Idioms a LEFT JOIN Translations b ON b.idiomId = a.id ' +
    'WHERE b.language = "EN" ' +
    'GROUP BY a.id ' +
    ' ' +
    'UNION ' +
    ' ' +
    'SELECT DISTINCT a.*, b.translation, b.language AS translationLang, ' +
    '(SELECT COUNT(*) ' +
    'FROM Equivalents c ' +
    'WHERE c.idiomId = a.id) AS equivalent_count ' +
    'FROM Idioms a LEFT JOIN Translations b ON b.idiomId = a.id ' +
    'WHERE b.language = "DE" ' +
    'GROUP BY a.id ' +
    ' ' +
    'UNION ' +
    '  ' +
    'SELECT DISTINCT a.*, b.translation, b.language AS translationLang, ' +
    '(SELECT COUNT(*) ' +
    'FROM Equivalents c ' +
    'WHERE c.idiomId = a.id) AS equivalent_count ' +
    'FROM Idioms a LEFT JOIN Translations b ON b.idiomId = a.id ' +
    'WHERE b.language = "ES" ' +
    'GROUP BY a.id ' +
    ' ' +
    'UNION ' +
    ' ' +
    'SELECT DISTINCT a.*, b.translation, b.language AS translationLang, ' +
    '(SELECT COUNT(*) ' +
    'FROM Equivalents c ' +
    'WHERE c.idiomId = a.id) AS equivalent_count ' +
    'FROM Idioms a LEFT JOIN Translations b ON b.idiomId = a.id ' +
    'WHERE b.language = "IT" ' +
    'GROUP BY a.id ' +
    '  ' +
    'UNION ' +
    ' ' +
    'SELECT DISTINCT a.*, b.translation, b.language AS translationLang, ' +
    '(SELECT COUNT(*) ' +
    'FROM Equivalents c ' +
    'WHERE c.idiomId = a.id) AS equivalent_count ' +
    'FROM Idioms a LEFT JOIN Translations b ON b.idiomId = a.id ' +
    'GROUP BY a.id ' +
    ' ' +
    ') AS tbl ' +
    ' ' +
    'GROUP BY tbl.id',
    { type: db.sequelize.QueryTypes.SELECT })
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
 * Get Prev Idiom
 */
exports.getPrevIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Idiom.findOne({
    where: {
      id: { $lt: idiomId } 
    },
    limit: 1,
    order: [[
      'id', 'DESC'
    ]]
  })
  .then(function(idiom) {
    console.log('idiom: '+JSON.stringify(idiom));
    return res.json(idiom);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Get Next Idiom
 */
exports.getNextIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Idiom.findOne({
    where: {
      id: { $gt: idiomId } 
    },
    limit: 1,
    order: [[
      'id', 'ASC'
    ]]
  })
  .then(function(idiom) {
    console.log('idiom: '+JSON.stringify(idiom));
    return res.json(idiom);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Get Random Idiom
 */
exports.getRandomIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Idiom.findOne({
    order: [[
      sequelize.fn('RAND'),
    ]]
  })
  .then(function(idiom) {
    console.log('idiom: '+JSON.stringify(idiom));
    return res.json(idiom);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Get First Idiom
 */
exports.getFirstIdiom = function(req, res) {

  var idiomId = req.params.idiomId;

  db.Idiom.findOne({
    limit: 1,
    order: [[
      'id', 'ASC'
    ]]
  })
  .then(function(idiom) {
    console.log('idiom: '+JSON.stringify(idiom));
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
        meaning: req.body.meaning,
        derivation: req.body.derivation,
        language: req.body.language,
        approved: req.body.approved,
        modifiedBy: req.user.id
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
