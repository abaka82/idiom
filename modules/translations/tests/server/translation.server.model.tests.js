'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  should = require('should'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize'));

/**
 * Globals
 */
var user, translation;
var roleAdmin, roleUser; 

/**
 * Unit tests
 */
describe('Translation "model" Tests:', function () {

  before(function(done) {
    user =
      db.User
      .build({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: 'username',
        password: 'M3@n.jsI$Aw3$0m3',
        provider: 'local'
      });
      // Get roles
    db.Role
      .findAll ()
      .then(function(roles) {
        
        _.each(roles, function(value) {
          if (value.name === 'admin') {
            roleAdmin = value.id;
          } else if (value.name === 'user') {
            roleUser = value.id;
          }
        });
      })
      .catch(function(err) {
        return done(err);
      });

    user.save()
    .then(function(user){
      user.addRoles([roleUser, roleAdmin])
        .then(function(roles) {
          //console.log(user.dataValues.id);
          translation = db.Translation
          .build({
            title: 'Translation Title',
            content: 'Translation Content',
            userId: user.dataValues.id
          });
          done();
        })
        .catch(function(err) {
          return done(err);
        });
    })
    .catch(function(err) {
      return done(err);
    });
  });
  
  it('should be able to save without problems', function(done) {
    translation.save()
      .then(function(translation) {
        should.exist(translation);
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to show an error when try to save without title', function(done) {
    translation.title = '';
    translation.save()
      .then(function(translation) {
        should.not.exist(translation);
      })
      .catch(function(err) {
        should.exist(err);
        done();
      });
  });

  it('should be able to update an translation ', function(done) {
    db.Translation
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(translation) {
        translation.updateAttributes({
          title: 'Translation Title Updated',
          content: 'Translation Content Updated'
        })
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        done();
      });
  });


  it('should be able to delete an translation ', function(done) {
    db.Translation
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(translation) {
        translation.destroy()
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        done();
      });
  });

  it('should be able to show the list of translations', function(done) {

    var limit = 10;
    var offset = 0;

    db.Translation
      .findAll({
        where: {
          id: 1
        },
        include: [
          db.User
        ],
        'limit': limit,
        'offset': offset,
        'order': [
          ['createdAt', 'DESC']
        ]
      })
      .then(function(translations) {
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  after(function(done) {
    user
      .destroy()
      .then(function() {
        translation
          .destroy()
          .then(function() {
            done();
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
});
