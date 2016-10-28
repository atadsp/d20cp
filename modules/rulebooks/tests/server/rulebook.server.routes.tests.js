'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rulebook = mongoose.model('Rulebook'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rulebook;

/**
 * Rulebook routes tests
 */
describe('Rulebook CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Rulebook
    user.save(function () {
      rulebook = {
        name: 'Rulebook name'
      };

      done();
    });
  });

  it('should be able to save a Rulebook if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Rulebook
        agent.post('/api/rulebooks')
          .send(rulebook)
          .expect(200)
          .end(function (rulebookSaveErr, rulebookSaveRes) {
            // Handle Rulebook save error
            if (rulebookSaveErr) {
              return done(rulebookSaveErr);
            }

            // Get a list of Rulebooks
            agent.get('/api/rulebooks')
              .end(function (rulebooksGetErr, rulebooksGetRes) {
                // Handle Rulebooks save error
                if (rulebooksGetErr) {
                  return done(rulebooksGetErr);
                }

                // Get Rulebooks list
                var rulebooks = rulebooksGetRes.body;

                // Set assertions
                (rulebooks[0].user._id).should.equal(userId);
                (rulebooks[0].name).should.match('Rulebook name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rulebook if not logged in', function (done) {
    agent.post('/api/rulebooks')
      .send(rulebook)
      .expect(403)
      .end(function (rulebookSaveErr, rulebookSaveRes) {
        // Call the assertion callback
        done(rulebookSaveErr);
      });
  });

  it('should not be able to save an Rulebook if no name is provided', function (done) {
    // Invalidate name field
    rulebook.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Rulebook
        agent.post('/api/rulebooks')
          .send(rulebook)
          .expect(400)
          .end(function (rulebookSaveErr, rulebookSaveRes) {
            // Set message assertion
            (rulebookSaveRes.body.message).should.match('Please fill Rulebook name');

            // Handle Rulebook save error
            done(rulebookSaveErr);
          });
      });
  });

  it('should be able to update an Rulebook if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Rulebook
        agent.post('/api/rulebooks')
          .send(rulebook)
          .expect(200)
          .end(function (rulebookSaveErr, rulebookSaveRes) {
            // Handle Rulebook save error
            if (rulebookSaveErr) {
              return done(rulebookSaveErr);
            }

            // Update Rulebook name
            rulebook.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rulebook
            agent.put('/api/rulebooks/' + rulebookSaveRes.body._id)
              .send(rulebook)
              .expect(200)
              .end(function (rulebookUpdateErr, rulebookUpdateRes) {
                // Handle Rulebook update error
                if (rulebookUpdateErr) {
                  return done(rulebookUpdateErr);
                }

                // Set assertions
                (rulebookUpdateRes.body._id).should.equal(rulebookSaveRes.body._id);
                (rulebookUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Rulebooks if not signed in', function (done) {
    // Create new Rulebook model instance
    var rulebookObj = new Rulebook(rulebook);

    // Save the rulebook
    rulebookObj.save(function () {
      // Request Rulebooks
      request(app).get('/api/rulebooks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rulebook if not signed in', function (done) {
    // Create new Rulebook model instance
    var rulebookObj = new Rulebook(rulebook);

    // Save the Rulebook
    rulebookObj.save(function () {
      request(app).get('/api/rulebooks/' + rulebookObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', rulebook.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rulebook with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/rulebooks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rulebook is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rulebook which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rulebook
    request(app).get('/api/rulebooks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rulebook with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rulebook if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Rulebook
        agent.post('/api/rulebooks')
          .send(rulebook)
          .expect(200)
          .end(function (rulebookSaveErr, rulebookSaveRes) {
            // Handle Rulebook save error
            if (rulebookSaveErr) {
              return done(rulebookSaveErr);
            }

            // Delete an existing Rulebook
            agent.delete('/api/rulebooks/' + rulebookSaveRes.body._id)
              .send(rulebook)
              .expect(200)
              .end(function (rulebookDeleteErr, rulebookDeleteRes) {
                // Handle rulebook error error
                if (rulebookDeleteErr) {
                  return done(rulebookDeleteErr);
                }

                // Set assertions
                (rulebookDeleteRes.body._id).should.equal(rulebookSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rulebook if not signed in', function (done) {
    // Set Rulebook user
    rulebook.user = user;

    // Create new Rulebook model instance
    var rulebookObj = new Rulebook(rulebook);

    // Save the Rulebook
    rulebookObj.save(function () {
      // Try deleting Rulebook
      request(app).delete('/api/rulebooks/' + rulebookObj._id)
        .expect(403)
        .end(function (rulebookDeleteErr, rulebookDeleteRes) {
          // Set message assertion
          (rulebookDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rulebook error error
          done(rulebookDeleteErr);
        });

    });
  });

  it('should be able to get a single Rulebook that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Rulebook
          agent.post('/api/rulebooks')
            .send(rulebook)
            .expect(200)
            .end(function (rulebookSaveErr, rulebookSaveRes) {
              // Handle Rulebook save error
              if (rulebookSaveErr) {
                return done(rulebookSaveErr);
              }

              // Set assertions on new Rulebook
              (rulebookSaveRes.body.name).should.equal(rulebook.name);
              should.exist(rulebookSaveRes.body.user);
              should.equal(rulebookSaveRes.body.user._id, orphanId);

              // force the Rulebook to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Rulebook
                    agent.get('/api/rulebooks/' + rulebookSaveRes.body._id)
                      .expect(200)
                      .end(function (rulebookInfoErr, rulebookInfoRes) {
                        // Handle Rulebook error
                        if (rulebookInfoErr) {
                          return done(rulebookInfoErr);
                        }

                        // Set assertions
                        (rulebookInfoRes.body._id).should.equal(rulebookSaveRes.body._id);
                        (rulebookInfoRes.body.name).should.equal(rulebook.name);
                        should.equal(rulebookInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Rulebook.remove().exec(done);
    });
  });
});
