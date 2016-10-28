'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Deity = mongoose.model('Deity'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  deity;

/**
 * Deity routes tests
 */
describe('Deity CRUD tests', function () {

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

    // Save a user to the test db and create new Deity
    user.save(function () {
      deity = {
        name: 'Deity name'
      };

      done();
    });
  });

  it('should be able to save a Deity if logged in', function (done) {
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

        // Save a new Deity
        agent.post('/api/deities')
          .send(deity)
          .expect(200)
          .end(function (deitySaveErr, deitySaveRes) {
            // Handle Deity save error
            if (deitySaveErr) {
              return done(deitySaveErr);
            }

            // Get a list of Deities
            agent.get('/api/deities')
              .end(function (deitiesGetErr, deitiesGetRes) {
                // Handle Deities save error
                if (deitiesGetErr) {
                  return done(deitiesGetErr);
                }

                // Get Deities list
                var deities = deitiesGetRes.body;

                // Set assertions
                (deities[0].user._id).should.equal(userId);
                (deities[0].name).should.match('Deity name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Deity if not logged in', function (done) {
    agent.post('/api/deities')
      .send(deity)
      .expect(403)
      .end(function (deitySaveErr, deitySaveRes) {
        // Call the assertion callback
        done(deitySaveErr);
      });
  });

  it('should not be able to save an Deity if no name is provided', function (done) {
    // Invalidate name field
    deity.name = '';

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

        // Save a new Deity
        agent.post('/api/deities')
          .send(deity)
          .expect(400)
          .end(function (deitySaveErr, deitySaveRes) {
            // Set message assertion
            (deitySaveRes.body.message).should.match('Please fill Deity name');

            // Handle Deity save error
            done(deitySaveErr);
          });
      });
  });

  it('should be able to update an Deity if signed in', function (done) {
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

        // Save a new Deity
        agent.post('/api/deities')
          .send(deity)
          .expect(200)
          .end(function (deitySaveErr, deitySaveRes) {
            // Handle Deity save error
            if (deitySaveErr) {
              return done(deitySaveErr);
            }

            // Update Deity name
            deity.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Deity
            agent.put('/api/deities/' + deitySaveRes.body._id)
              .send(deity)
              .expect(200)
              .end(function (deityUpdateErr, deityUpdateRes) {
                // Handle Deity update error
                if (deityUpdateErr) {
                  return done(deityUpdateErr);
                }

                // Set assertions
                (deityUpdateRes.body._id).should.equal(deitySaveRes.body._id);
                (deityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Deities if not signed in', function (done) {
    // Create new Deity model instance
    var deityObj = new Deity(deity);

    // Save the deity
    deityObj.save(function () {
      // Request Deities
      request(app).get('/api/deities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Deity if not signed in', function (done) {
    // Create new Deity model instance
    var deityObj = new Deity(deity);

    // Save the Deity
    deityObj.save(function () {
      request(app).get('/api/deities/' + deityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', deity.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Deity with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/deities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Deity is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Deity which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Deity
    request(app).get('/api/deities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Deity with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Deity if signed in', function (done) {
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

        // Save a new Deity
        agent.post('/api/deities')
          .send(deity)
          .expect(200)
          .end(function (deitySaveErr, deitySaveRes) {
            // Handle Deity save error
            if (deitySaveErr) {
              return done(deitySaveErr);
            }

            // Delete an existing Deity
            agent.delete('/api/deities/' + deitySaveRes.body._id)
              .send(deity)
              .expect(200)
              .end(function (deityDeleteErr, deityDeleteRes) {
                // Handle deity error error
                if (deityDeleteErr) {
                  return done(deityDeleteErr);
                }

                // Set assertions
                (deityDeleteRes.body._id).should.equal(deitySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Deity if not signed in', function (done) {
    // Set Deity user
    deity.user = user;

    // Create new Deity model instance
    var deityObj = new Deity(deity);

    // Save the Deity
    deityObj.save(function () {
      // Try deleting Deity
      request(app).delete('/api/deities/' + deityObj._id)
        .expect(403)
        .end(function (deityDeleteErr, deityDeleteRes) {
          // Set message assertion
          (deityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Deity error error
          done(deityDeleteErr);
        });

    });
  });

  it('should be able to get a single Deity that has an orphaned user reference', function (done) {
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

          // Save a new Deity
          agent.post('/api/deities')
            .send(deity)
            .expect(200)
            .end(function (deitySaveErr, deitySaveRes) {
              // Handle Deity save error
              if (deitySaveErr) {
                return done(deitySaveErr);
              }

              // Set assertions on new Deity
              (deitySaveRes.body.name).should.equal(deity.name);
              should.exist(deitySaveRes.body.user);
              should.equal(deitySaveRes.body.user._id, orphanId);

              // force the Deity to have an orphaned user reference
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

                    // Get the Deity
                    agent.get('/api/deities/' + deitySaveRes.body._id)
                      .expect(200)
                      .end(function (deityInfoErr, deityInfoRes) {
                        // Handle Deity error
                        if (deityInfoErr) {
                          return done(deityInfoErr);
                        }

                        // Set assertions
                        (deityInfoRes.body._id).should.equal(deitySaveRes.body._id);
                        (deityInfoRes.body.name).should.equal(deity.name);
                        should.equal(deityInfoRes.body.user, undefined);

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
      Deity.remove().exec(done);
    });
  });
});
