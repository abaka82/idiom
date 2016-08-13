
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
var credentials, data, user, idiom;
var roleAdmin, roleUser;

/**
 * Idiom routes tests
 */
describe('Idiom "routes" Tests:', function() {
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

  it('should be able to save an idiom if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        var userId = user.id;
        idiom = {
          title: 'Idiom Title',
          content: 'Idiom Content',
          userId: user.id
        };

        // Save a new idiom
        agent.post('/api/idioms')
          .send(idiom)
          .expect(200)
          .end(function(idiomSaveErr, idiomSaveRes) {
            // Handle idiom save error
            if (idiomSaveErr) {
              done(idiomSaveErr);
            }
            // Get a list of idioms
            agent.get('/api/idioms')
              .end(function(idiomsGetErr, idiomsGetRes) {
                // Handle idiom save error
                if (idiomsGetErr) {
                  done(idiomsGetErr);
                }

                // Get idioms list
                var idioms = idiomsGetRes.body;

                // Set assertions
                (idioms[0].User.id).should.equal(userId);
                (idioms[0].title).should.match('Idiom Title');

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

  it('should not be able to save an idiom if not logged in', function(done) {
    var mockIdiom = {
      title: 'Idiom Title',
      content: 'Idiom Content',
    };
    request(app).post('/api/idioms')
      .send(mockIdiom)
      .expect(403)
      .end(function(idiomSaveErr, idiomSaveRes) {
        // Call the assertion callback
        if (idiomSaveErr) {
          done(idiomSaveErr);
        }
        done();
      });
  });

  it('should not be able to save an idiom if no title is provided', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var mockIdiom = {
          content: 'Idiom content',
          userId: user.id
        };

        // Save a new idiom
        agent.post('/api/idioms')
          .send(mockIdiom)
          .expect(400)
          .end(function(idiomSaveErr, idiomSaveRes) {
            if (idiomSaveErr) {
              done(idiomSaveErr);
            }
            idiomSaveRes.body.message.should.equal('title cannot be null');

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

  it('should be able to update an idiom if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          done(signinErr);
        }

        idiom = {
          title: 'Idiom Title',
          content: 'Idiom Content',
          userId: user.id
        };

        // Save a new idiom
        agent.post('/api/idioms')
          .send(idiom)
          .expect(200)
          .end(function(idiomSaveErr, idiomSaveRes) {
            // Handle idiom save error
            if (idiomSaveErr) {
              done(idiomSaveErr);
            }

            // Update idiom title
            idiom = {
              title: 'New Idiom Title',
              content: 'Idiom Content',
              userId: user.id
            };

            // Update an existing idiom
            agent.put('/api/idioms/' + idiomSaveRes.body.id)
              .send(idiom)
              .expect(200)
              .end(function(idiomUpdateErr, idiomUpdateRes) {
                // Handle idiom update error
                if (idiomUpdateErr) {
                  done(idiomUpdateErr);
                }

                // Set assertions
                (idiomUpdateRes.body.id).should.equal(idiomSaveRes.body.id);
                (idiomUpdateRes.body.title).should.match('New Idiom Title');
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

  it('should be able to get a list of idioms if not signed in', function(done) {
    // Create new idiom model instance
    idiom = {
      title: 'Idiom Title',
      content: 'Idiom Content',
      userId: user.id
    };
    var idiomObj = db.Idiom.build(idiom);

    // Save the idiom
    idiomObj.save()
      .then(function() {
        // Request idioms
        request(app).get('/api/idioms')
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

  it('should be able to get a single idiom if not signed in', function(done) {
    idiom = {
      title: 'Idiom Title',
      content: 'Idiom Content',
      userId: user.id
    };

    // Create new idiom model instance
    var idiomObj = db.Idiom.build(idiom);
    // Save the idiom
    idiomObj.save()
      .then(function() {
        // Request idioms
        request(app).get('/api/idioms/' + idiomObj.id)
          .end(function(req, res) {
            // Set assertion
            res.body.should.be.instanceof(Object).and.have.property('title', idiom.title);
            done();
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should return proper error for single idiom with an invalid Id, if not signed in', function(done) {
    // test is not a valid sequelize Id
    request(app).get('/api/idioms/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', '');
        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single idiom which doesnt exist, if not signed in', function(done) {
    // This is a valid sequelize Id but a non-existent idiom
    request(app).get('/api/idioms/559')
      .end(function(req, res) {
        // Set assertion
        should.equal(res.body,null);
        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an idiom if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          console.log(signinErr.text);
          done(signinErr);
        }

        idiom = {
          title: 'Idiom Title',
          content: 'Idiom Content',
          userId: user.id
        };

        // Save a new idiom
        agent.post('/api/idioms')
          .send(idiom)
          .expect(200)
          .end(function(idiomSaveErr, idiomSaveRes) {
            // Handle idiom save error
            if (idiomSaveErr) {
              done(idiomSaveErr);
            }
            
            // Delete an existing idiom
            agent.delete('/api/idioms/' + idiomSaveRes.body.id)
              .send(idiom)
              .expect(200)
              .end(function(idiomDeleteErr, idiomDeleteRes) {
                // Handle idiom error error
                if (idiomDeleteErr) {
                  done(idiomDeleteErr);
                }

                // Set assertions
                (idiomDeleteRes.body.id).should.equal(idiomSaveRes.body.id);

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

  it('should not be able to delete an idiom if not signed in', function(done) {
    idiom = {
      title: 'Idiom Title',
      content: 'Idiom Content',
      userId: user.id
    };

    // Create new idiom model instance
    var idiomObj = db.Idiom.build(idiom);

    // Save the idiom
    idiomObj.save()
      .then(function() {
        // Try deleting idiom
        request(app).delete('/api/idioms/' + idiomObj.id)
          .expect(403)
          .end(function(idiomDeleteErr, idiomDeleteRes) {
            // Set message assertion
            (idiomDeleteRes.body.message).should.match('User is not authorized');

            // Handle idiom error error
            done(idiomDeleteErr);
          });
      })
      .catch(function(err) {
        should.not.exist(err);
      });
  });

  it('should be able to get a single idiom that has an orphaned user reference', function(done) {
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
                idiom = {
                  title: 'Idiom title',
                  content: 'Idiom content',
                  userId: orphanId
                };

                // Save a new idiom
                agent.post('/api/idioms')
                  .send(idiom)
                  .expect(200)
                  .end(function(idiomSaveErr, idiomSaveRes) {
                    // Handle idiom save error
                    if (idiomSaveErr) {
                      done(idiomSaveErr);
                    }
                    //console.log(idiomSaveRes.body);
                    // Set assertions on new idiom
                    (idiomSaveRes.body.title).should.equal(idiom.title);
                    //should.exist(idiomSaveRes.body.User);
                    should.equal(idiomSaveRes.body.userId, orphanId);
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
                        // force the idiom to have an orphaned user reference
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
                                // Get the idiom
                                agent.get('/api/idioms/' + idiomSaveRes.body.id)
                                  .expect(200)
                                  .end(function(idiomInfoErr, idiomInfoRes) {
                                    // Handle idiom error
                                    if (idiomInfoErr) {
                                      done(idiomInfoErr);
                                    }

                                    // Set assertions
                                    (idiomInfoRes.body.id).should.equal(idiomSaveRes.body.id);
                                    (idiomInfoRes.body.title).should.equal(idiom.title);
                                    //should.equal(idiomInfoRes.body.user, undefined);

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
    db.Idiom.destroy({
      where: {
        title: 'Idiom Title'
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
