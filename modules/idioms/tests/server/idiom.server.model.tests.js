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
var user, idiom;
var roleAdmin, roleUser; 

/**
 * Unit tests
 */
describe('Idiom "model" Tests:', function () {

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
          idiom = db.Idiom
          .build({
            title: 'Idiom Title',
            content: 'Idiom Content',
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
    idiom.save()
      .then(function(idiom) {
        should.exist(idiom);
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to show an error when try to save without title', function(done) {
    idiom.title = '';
    idiom.save()
      .then(function(idiom) {
        should.not.exist(idiom);
      })
      .catch(function(err) {
        should.exist(err);
        done();
      });
  });

  it('should be able to update an idiom ', function(done) {
    db.Idiom
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(idiom) {
        idiom.updateAttributes({
          title: 'Idiom Title Updated',
          content: 'Idiom Content Updated'
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


  it('should be able to delete an idiom ', function(done) {
    db.Idiom
      .findOne({
        where: {
          id: 1
        },
        include: [
          db.User
        ]
      })
      .then(function(idiom) {
        idiom.destroy()
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

  it('should be able to show the list of idioms', function(done) {

    var limit = 10;
    var offset = 0;

    db.Idiom
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
      .then(function(idioms) {
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
        idiom
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
