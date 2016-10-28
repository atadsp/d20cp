'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Klass = mongoose.model('Klass'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  klass;

/**
 * Klass routes tests
 */
describe('Klass CRUD tests', function () {

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

    // Save a user to the test db and create new Klass
    user.save(function () {
      klass = {
        name: 'Klass name'
      };

      done();
    });
  });

  it('should be able to save a Klass if logged in', function (done) {
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

        // Save a new Klass
        agent.post('/api/klasses')
          .send(klass)
          .expect(200)
          .end(function (klassSaveErr, klassSaveRes) {
            // Handle Klass save error
            if (klassSaveErr) {
              return done(klassSaveErr);
            }

            // Get a list of Klasses
            agent.get('/api/klasses')
              .end(function (klassesGetErr, klassesGetRes) {
                // Handle Klasses save error
                if (klassesGetErr) {
                  return done(klassesGetErr);
                }

                // Get Klasses list
                var klasses = klassesGetRes.body;

                // Set assertions
                (klasses[0].user._id).should.equal(userId);
                (klasses[0].name).should.match('Klass name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Klass if not logged in', function (done) {
    agent.post('/api/klasses')
      .send(klass)
      .expect(403)
      .end(function (klassSaveErr, klassSaveRes) {
        // Call the assertion callback
        done(klassSaveErr);
      });
  });

  it('should not be able to save an Klass if no name is provided', function (done) {
    // Invalidate name field
    klass.name = '';

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

        // Save a new Klass
        agent.post('/api/klasses')
          .send(klass)
          .expect(400)
          .end(function (klassSaveErr, klassSaveRes) {
            // Set message assertion
            (klassSaveRes.body.message).should.match('Please fill Klass name');

            // Handle Klass save error
            done(klassSaveErr);
          });
      });
  });

  it('should be able to update an Klass if signed in', function (done) {
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

        // Save a new Klass
        agent.post('/api/klasses')
          .send(klass)
          .expect(200)
          .end(function (klassSaveErr, klassSaveRes) {
            // Handle Klass save error
            if (klassSaveErr) {
              return done(klassSaveErr);
            }

            // Update Klass name
            klass.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Klass
            agent.put('/api/klasses/' + klassSaveRes.body._id)
              .send(klass)
              .expect(200)
              .end(function (klassUpdateErr, klassUpdateRes) {
                // Handle Klass update error
                if (klassUpdateErr) {
                  return done(klassUpdateErr);
                }

                // Set assertions
                (klassUpdateRes.body._id).should.equal(klassSaveRes.body._id);
                (klassUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Klasses if not signed in', function (done) {
    // Create new Klass model instance
    var klassObj = new Klass(klass);

    // Save the klass
    klassObj.save(function () {
      // Request Klasses
      request(app).get('/api/klasses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Klass if not signed in', function (done) {
    // Create new Klass model instance
    var klassObj = new Klass(klass);

    // Save the Klass
    klassObj.save(function () {
      request(app).get('/api/klasses/' + klassObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', klass.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Klass with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/klasses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Klass is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Klass which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Klass
    request(app).get('/api/klasses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Klass with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Klass if signed in', function (done) {
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

        // Save a new Klass
        agent.post('/api/klasses')
          .send(klass)
          .expect(200)
          .end(function (klassSaveErr, klassSaveRes) {
            // Handle Klass save error
            if (klassSaveErr) {
              return done(klassSaveErr);
            }

            // Delete an existing Klass
            agent.delete('/api/klasses/' + klassSaveRes.body._id)
              .send(klass)
              .expect(200)
              .end(function (klassDeleteErr, klassDeleteRes) {
                // Handle klass error error
                if (klassDeleteErr) {
                  return done(klassDeleteErr);
                }

                // Set assertions
                (klassDeleteRes.body._id).should.equal(klassSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Klass if not signed in', function (done) {
    // Set Klass user
    klass.user = user;

    // Create new Klass model instance
    var klassObj = new Klass(klass);

    // Save the Klass
    klassObj.save(function () {
      // Try deleting Klass
      request(app).delete('/api/klasses/' + klassObj._id)
        .expect(403)
        .end(function (klassDeleteErr, klassDeleteRes) {
          // Set message assertion
          (klassDeleteRes.body.message).should.match('User is not authorized');

          // Handle Klass error error
          done(klassDeleteErr);
        });

    });
  });

  it('should be able to get a single Klass that has an orphaned user reference', function (done) {
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

          // Save a new Klass
          agent.post('/api/klasses')
            .send(klass)
            .expect(200)
            .end(function (klassSaveErr, klassSaveRes) {
              // Handle Klass save error
              if (klassSaveErr) {
                return done(klassSaveErr);
              }

              // Set assertions on new Klass
              (klassSaveRes.body.name).should.equal(klass.name);
              should.exist(klassSaveRes.body.user);
              should.equal(klassSaveRes.body.user._id, orphanId);

              // force the Klass to have an orphaned user reference
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

                    // Get the Klass
                    agent.get('/api/klasses/' + klassSaveRes.body._id)
                      .expect(200)
                      .end(function (klassInfoErr, klassInfoRes) {
                        // Handle Klass error
                        if (klassInfoErr) {
                          return done(klassInfoErr);
                        }

                        // Set assertions
                        (klassInfoRes.body._id).should.equal(klassSaveRes.body._id);
                        (klassInfoRes.body.name).should.equal(klass.name);
                        should.equal(klassInfoRes.body.user, undefined);

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
      Klass.remove().exec(done);
    });
  });
});
