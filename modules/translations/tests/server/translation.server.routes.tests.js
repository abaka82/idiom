
'use strict';

var _ = require('lodash'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')),
  express = require(path.resolve('./config/lib/express')),
  fs = require('fs-extra'),
  request = require('supertest'),
  should = require('should');

/**
 * Globals
 */
var agent, app;
var credentials, data, user, translation;
var roleAdmin, roleUser;

/**
 * Translation routes tests
 */
describe('Translation "routes" Tests:', function() {
  before(function(done) {
    // Get application
    app = express.init(db.sequelize);
    agent = request.agent(app);

    // Get roles
    db.Role
      .findAll()
      .then(function(roles) {
        _.each(roles, function(value) {
          if (value.name === 'admin') {
            roleAdmin = value.id;
          } else if (value.name === 'user') {
            roleUser = value.id;
          }
        });
        done();
      })
      .catch(function(err) {
        return done(err);
      });
  });

  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'sW1kXqrbyZUBNub6FKJgEA'
    };

    data = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    };

    // Build new user
    user =
      db.User
      .build(data);

    // Save 
    user
      .save()
      .then(function(user) {
        user.addRoles([roleUser, roleAdmin])
        .then(function(roles){
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

  it('should be able to save an translation if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        var userId = user.id;
        translation = {
          title: 'Translation Title',
          content: 'Translation Content',
          userId: user.id
        };

        // Save a new translation
        agent.post('/api/translations')
          .send(translation)
          .expect(200)
          .end(function(translationSaveErr, translationSaveRes) {
            // Handle translation save error
            if (translationSaveErr) {
              done(translationSaveErr);
            }
            // Get a list of translations
            agent.get('/api/translations')
              .end(function(translationsGetErr, translationsGetRes) {
                // Handle translation save error
                if (translationsGetErr) {
                  done(translationsGetErr);
                }

                // Get translations list
                var translations = translationsGetRes.body;

                // Set assertions
                (translations[0].User.id).should.equal(userId);
                (translations[0].title).should.match('Translation Title');

                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    done();
                  });
              });
          });
      });
  });

  it('should not be able to save an translation if not logged in', function(done) {
    var mockTranslation = {
      title: 'Translation Title',
      content: 'Translation Content',
    };
    request(app).post('/api/translations')
      .send(mockTranslation)
      .expect(403)
      .end(function(translationSaveErr, translationSaveRes) {
        // Call the assertion callback
        if (translationSaveErr) {
          done(translationSaveErr);
        }
        done();
      });
  });

  it('should not be able to save an translation if no title is provided', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var mockTranslation = {
          content: 'Translation content',
          userId: user.id
        };

        // Save a new translation
        agent.post('/api/translations')
          .send(mockTranslation)
          .expect(400)
          .end(function(translationSaveErr, translationSaveRes) {
            if (translationSaveErr) {
              done(translationSaveErr);
            }
            translationSaveRes.body.message.should.equal('title cannot be null');

            agent
              .get('/api/auth/signout')
              .expect(302)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                res.redirect.should.equal(true);
                
                // NodeJS v4 changed the status code representation so we must check
                // before asserting, to be comptabile with all node versions.
                if (process.version.indexOf('v4') === 0) {
                  res.text.should.equal('Found. Redirecting to /');
                } else {
                  res.text.should.equal('Moved Temporarily. Redirecting to /');
                }
                done();
              });
          });
      });
  });

  it('should be able to update an translation if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        translation = {
          title: 'Translation Title',
          content: 'Translation Content',
          userId: user.id
        };

        // Save a new translation
        agent.post('/api/translations')
          .send(translation)
          .expect(200)
          .end(function(translationSaveErr, translationSaveRes) {
            // Handle translation save error
            if (translationSaveErr) {
              done(translationSaveErr);
            }

            // Update translation title
            translation = {
              title: 'New Translation Title',
              content: 'Translation Content',
              userId: user.id
            };

            // Update an existing translation
            agent.put('/api/translations/' + translationSaveRes.body.id)
              .send(translation)
              .expect(200)
              .end(function(translationUpdateErr, translationUpdateRes) {
                // Handle translation update error
                if (translationUpdateErr) {
                  done(translationUpdateErr);
                }

                // Set assertions
                (translationUpdateRes.body.id).should.equal(translationSaveRes.body.id);
                (translationUpdateRes.body.title).should.match('New Translation Title');
                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('should be able to get a list of translations if not signed in', function(done) {
    // Create new translation model instance
    translation = {
      title: 'Translation Title',
      content: 'Translation Content',
      userId: user.id
    };
    var translationObj = db.Translation.build(translation);

    // Save the translation
    translationObj.save()
      .then(function() {
        // Request translations
        request(app).get('/api/translations')
          .end(function(req, res) {
            // Set assertion
            res.body.should.be.instanceof(Array).and.not.have.lengthOf(0);
            done();
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to get a single translation if not signed in', function(done) {
    translation = {
      title: 'Translation Title',
      content: 'Translation Content',
      userId: user.id
    };

    // Create new translation model instance
    var translationObj = db.Translation.build(translation);
    // Save the translation
    translationObj.save()
      .then(function() {
        // Request translations
        request(app).get('/api/translations/' + translationObj.id)
          .end(function(req, res) {
            // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('title', translation.title);
            done();
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should return proper error for single translation with an invalid Id, if not signed in', function(done) {
    // test is not a valid sequelize Id
    request(app).get('/api/translations/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', '');
        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single translation which doesnt exist, if not signed in', function(done) {
    // This is a valid sequelize Id but a non-existent translation
    request(app).get('/api/translations/559')
      .end(function(req, res) {
        // Set assertion
        should.equal(res.body,null);
        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an translation if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          console.log(signinErr.text);
          done(signinErr);
        }

        translation = {
          title: 'Translation Title',
          content: 'Translation Content',
          userId: user.id
        };

        // Save a new translation
        agent.post('/api/translations')
          .send(translation)
          .expect(200)
          .end(function(translationSaveErr, translationSaveRes) {
            // Handle translation save error
            if (translationSaveErr) {
              done(translationSaveErr);
            }
            
            // Delete an existing translation
            agent.delete('/api/translations/' + translationSaveRes.body.id)
              .send(translation)
              .expect(200)
              .end(function(translationDeleteErr, translationDeleteRes) {
                // Handle translation error error
                if (translationDeleteErr) {
                  done(translationDeleteErr);
                }

                // Set assertions
                (translationDeleteRes.body.id).should.equal(translationSaveRes.body.id);

                agent
                  .get('/api/auth/signout')
                  .expect(302)
                  .end(function(err, res) {
                    if (err) {
                      return done(err);
                    }
                    res.redirect.should.equal(true);

                    // NodeJS v4 changed the status code representation so we must check
                    // before asserting, to be comptabile with all node versions.
                    if (process.version.indexOf('v4') === 0) {
                      res.text.should.equal('Found. Redirecting to /');
                    } else {
                      res.text.should.equal('Moved Temporarily. Redirecting to /');
                    }
                    // Call the assertion callback
                    done();
                  });
              });
          });
      });
  });

  it('should not be able to delete an translation if not signed in', function(done) {
    translation = {
      title: 'Translation Title',
      content: 'Translation Content',
      userId: user.id
    };

    // Create new translation model instance
    var translationObj = db.Translation.build(translation);

    // Save the translation
    translationObj.save()
      .then(function() {
        // Try deleting translation
        request(app).delete('/api/translations/' + translationObj.id)
          .expect(403)
          .end(function(translationDeleteErr, translationDeleteRes) {
            // Set message assertion
            (translationDeleteRes.body.message).should.match('User is not authorized');

            // Handle translation error error
            done(translationDeleteErr);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to get a single translation that has an orphaned user reference', function(done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = db.User.build({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });
    _orphan.save()
      .then(function(orphan) {
        orphan.addRoles([roleUser, roleAdmin])
          .then(function(roles) {

            agent.post('/api/auth/signin')
              .send(_creds)
              .expect(200)
              .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                  done(signinErr);
                }

                // Get the userId
                var orphanId = orphan.id;
                translation = {
                  title: 'Translation title',
                  content: 'Translation content',
                  userId: orphanId
                };

                // Save a new translation
                agent.post('/api/translations')
                  .send(translation)
                  .expect(200)
                  .end(function(translationSaveErr, translationSaveRes) {
                    // Handle translation save error
                    if (translationSaveErr) {
                      done(translationSaveErr);
                    }
                    //console.log(translationSaveRes.body);
                    // Set assertions on new translation
                    (translationSaveRes.body.title).should.equal(translation.title);
                    //should.exist(translationSaveRes.body.User);
                    should.equal(translationSaveRes.body.userId, orphanId);
                    agent
                      .get('/api/auth/signout')
                      .expect(302)
                      .end(function(err, res) {
                        if (err) {
                          return done(err);
                        }
                        res.redirect.should.equal(true);

                        // NodeJS v4 changed the status code representation so we must check
                        // before asserting, to be comptabile with all node versions.
                        if (process.version.indexOf('v4') === 0) {
                          res.text.should.equal('Found. Redirecting to /');
                        } else {
                          res.text.should.equal('Moved Temporarily. Redirecting to /');
                        }
                        // force the translation to have an orphaned user reference
                        orphan.destroy()
                          .then(function() {
                            // now signin with valid user
                            agent.post('/api/auth/signin')
                              .send(credentials)
                              .expect(200)
                              .end(function(err, res) {
                                // Handle signin error
                                if (err) {
                                  done(err);
                                }
                                // Get the translation
                                agent.get('/api/translations/' + translationSaveRes.body.id)
                                  .expect(200)
                                  .end(function(translationInfoErr, translationInfoRes) {
                                    // Handle translation error
                                    if (translationInfoErr) {
                                      done(translationInfoErr);
                                    }

                                    // Set assertions
                                    (translationInfoRes.body.id).should.equal(translationSaveRes.body.id);
                                    (translationInfoRes.body.title).should.equal(translation.title);
                                    //should.equal(translationInfoRes.body.user, undefined);

                                    // Call the assertion callback
                                    done();
                                  });
                              });
                          })
                          .catch(function(err) {
                            should.not.exist(err);
                          });

                      });
                  });
              });
          })
          .catch(function(err) {
            should.not.exist(err);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
  afterEach(function(done) {
    user
      .destroy()
      .then(function() {
        done();
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });
  after(function(done){
    db.Translation.destroy({
      where: {
        title: 'Translation Title'
      }
    })
    .then(function(){
      done();
    })
    .catch(function(err) {
      should.not.exist(err);
    });
  });
});
