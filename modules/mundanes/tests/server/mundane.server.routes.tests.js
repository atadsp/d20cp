'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mundane = mongoose.model('Mundane'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mundane;

/**
 * Mundane routes tests
 */
describe('Mundane CRUD tests', function () {

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

    // Save a user to the test db and create new Mundane
    user.save(function () {
      mundane = {
        name: 'Mundane name'
      };

      done();
    });
  });

  it('should be able to save a Mundane if logged in', function (done) {
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

        // Save a new Mundane
        agent.post('/api/mundanes')
          .send(mundane)
          .expect(200)
          .end(function (mundaneSaveErr, mundaneSaveRes) {
            // Handle Mundane save error
            if (mundaneSaveErr) {
              return done(mundaneSaveErr);
            }

            // Get a list of Mundanes
            agent.get('/api/mundanes')
              .end(function (mundanesGetErr, mundanesGetRes) {
                // Handle Mundanes save error
                if (mundanesGetErr) {
                  return done(mundanesGetErr);
                }

                // Get Mundanes list
                var mundanes = mundanesGetRes.body;

                // Set assertions
                (mundanes[0].user._id).should.equal(userId);
                (mundanes[0].name).should.match('Mundane name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mundane if not logged in', function (done) {
    agent.post('/api/mundanes')
      .send(mundane)
      .expect(403)
      .end(function (mundaneSaveErr, mundaneSaveRes) {
        // Call the assertion callback
        done(mundaneSaveErr);
      });
  });

  it('should not be able to save an Mundane if no name is provided', function (done) {
    // Invalidate name field
    mundane.name = '';

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

        // Save a new Mundane
        agent.post('/api/mundanes')
          .send(mundane)
          .expect(400)
          .end(function (mundaneSaveErr, mundaneSaveRes) {
            // Set message assertion
            (mundaneSaveRes.body.message).should.match('Please fill Mundane name');

            // Handle Mundane save error
            done(mundaneSaveErr);
          });
      });
  });

  it('should be able to update an Mundane if signed in', function (done) {
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

        // Save a new Mundane
        agent.post('/api/mundanes')
          .send(mundane)
          .expect(200)
          .end(function (mundaneSaveErr, mundaneSaveRes) {
            // Handle Mundane save error
            if (mundaneSaveErr) {
              return done(mundaneSaveErr);
            }

            // Update Mundane name
            mundane.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mundane
            agent.put('/api/mundanes/' + mundaneSaveRes.body._id)
              .send(mundane)
              .expect(200)
              .end(function (mundaneUpdateErr, mundaneUpdateRes) {
                // Handle Mundane update error
                if (mundaneUpdateErr) {
                  return done(mundaneUpdateErr);
                }

                // Set assertions
                (mundaneUpdateRes.body._id).should.equal(mundaneSaveRes.body._id);
                (mundaneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mundanes if not signed in', function (done) {
    // Create new Mundane model instance
    var mundaneObj = new Mundane(mundane);

    // Save the mundane
    mundaneObj.save(function () {
      // Request Mundanes
      request(app).get('/api/mundanes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mundane if not signed in', function (done) {
    // Create new Mundane model instance
    var mundaneObj = new Mundane(mundane);

    // Save the Mundane
    mundaneObj.save(function () {
      request(app).get('/api/mundanes/' + mundaneObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mundane.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mundane with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mundanes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mundane is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mundane which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mundane
    request(app).get('/api/mundanes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mundane with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mundane if signed in', function (done) {
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

        // Save a new Mundane
        agent.post('/api/mundanes')
          .send(mundane)
          .expect(200)
          .end(function (mundaneSaveErr, mundaneSaveRes) {
            // Handle Mundane save error
            if (mundaneSaveErr) {
              return done(mundaneSaveErr);
            }

            // Delete an existing Mundane
            agent.delete('/api/mundanes/' + mundaneSaveRes.body._id)
              .send(mundane)
              .expect(200)
              .end(function (mundaneDeleteErr, mundaneDeleteRes) {
                // Handle mundane error error
                if (mundaneDeleteErr) {
                  return done(mundaneDeleteErr);
                }

                // Set assertions
                (mundaneDeleteRes.body._id).should.equal(mundaneSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mundane if not signed in', function (done) {
    // Set Mundane user
    mundane.user = user;

    // Create new Mundane model instance
    var mundaneObj = new Mundane(mundane);

    // Save the Mundane
    mundaneObj.save(function () {
      // Try deleting Mundane
      request(app).delete('/api/mundanes/' + mundaneObj._id)
        .expect(403)
        .end(function (mundaneDeleteErr, mundaneDeleteRes) {
          // Set message assertion
          (mundaneDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mundane error error
          done(mundaneDeleteErr);
        });

    });
  });

  it('should be able to get a single Mundane that has an orphaned user reference', function (done) {
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

          // Save a new Mundane
          agent.post('/api/mundanes')
            .send(mundane)
            .expect(200)
            .end(function (mundaneSaveErr, mundaneSaveRes) {
              // Handle Mundane save error
              if (mundaneSaveErr) {
                return done(mundaneSaveErr);
              }

              // Set assertions on new Mundane
              (mundaneSaveRes.body.name).should.equal(mundane.name);
              should.exist(mundaneSaveRes.body.user);
              should.equal(mundaneSaveRes.body.user._id, orphanId);

              // force the Mundane to have an orphaned user reference
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

                    // Get the Mundane
                    agent.get('/api/mundanes/' + mundaneSaveRes.body._id)
                      .expect(200)
                      .end(function (mundaneInfoErr, mundaneInfoRes) {
                        // Handle Mundane error
                        if (mundaneInfoErr) {
                          return done(mundaneInfoErr);
                        }

                        // Set assertions
                        (mundaneInfoRes.body._id).should.equal(mundaneSaveRes.body._id);
                        (mundaneInfoRes.body.name).should.equal(mundane.name);
                        should.equal(mundaneInfoRes.body.user, undefined);

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
      Mundane.remove().exec(done);
    });
  });
});
