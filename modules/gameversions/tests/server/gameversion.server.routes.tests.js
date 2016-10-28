'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gameversion = mongoose.model('Gameversion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  gameversion;

/**
 * Gameversion routes tests
 */
describe('Gameversion CRUD tests', function () {

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

    // Save a user to the test db and create new Gameversion
    user.save(function () {
      gameversion = {
        name: 'Gameversion name'
      };

      done();
    });
  });

  it('should be able to save a Gameversion if logged in', function (done) {
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

        // Save a new Gameversion
        agent.post('/api/gameversions')
          .send(gameversion)
          .expect(200)
          .end(function (gameversionSaveErr, gameversionSaveRes) {
            // Handle Gameversion save error
            if (gameversionSaveErr) {
              return done(gameversionSaveErr);
            }

            // Get a list of Gameversions
            agent.get('/api/gameversions')
              .end(function (gameversionsGetErr, gameversionsGetRes) {
                // Handle Gameversions save error
                if (gameversionsGetErr) {
                  return done(gameversionsGetErr);
                }

                // Get Gameversions list
                var gameversions = gameversionsGetRes.body;

                // Set assertions
                (gameversions[0].user._id).should.equal(userId);
                (gameversions[0].name).should.match('Gameversion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Gameversion if not logged in', function (done) {
    agent.post('/api/gameversions')
      .send(gameversion)
      .expect(403)
      .end(function (gameversionSaveErr, gameversionSaveRes) {
        // Call the assertion callback
        done(gameversionSaveErr);
      });
  });

  it('should not be able to save an Gameversion if no name is provided', function (done) {
    // Invalidate name field
    gameversion.name = '';

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

        // Save a new Gameversion
        agent.post('/api/gameversions')
          .send(gameversion)
          .expect(400)
          .end(function (gameversionSaveErr, gameversionSaveRes) {
            // Set message assertion
            (gameversionSaveRes.body.message).should.match('Please fill Gameversion name');

            // Handle Gameversion save error
            done(gameversionSaveErr);
          });
      });
  });

  it('should be able to update an Gameversion if signed in', function (done) {
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

        // Save a new Gameversion
        agent.post('/api/gameversions')
          .send(gameversion)
          .expect(200)
          .end(function (gameversionSaveErr, gameversionSaveRes) {
            // Handle Gameversion save error
            if (gameversionSaveErr) {
              return done(gameversionSaveErr);
            }

            // Update Gameversion name
            gameversion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Gameversion
            agent.put('/api/gameversions/' + gameversionSaveRes.body._id)
              .send(gameversion)
              .expect(200)
              .end(function (gameversionUpdateErr, gameversionUpdateRes) {
                // Handle Gameversion update error
                if (gameversionUpdateErr) {
                  return done(gameversionUpdateErr);
                }

                // Set assertions
                (gameversionUpdateRes.body._id).should.equal(gameversionSaveRes.body._id);
                (gameversionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Gameversions if not signed in', function (done) {
    // Create new Gameversion model instance
    var gameversionObj = new Gameversion(gameversion);

    // Save the gameversion
    gameversionObj.save(function () {
      // Request Gameversions
      request(app).get('/api/gameversions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Gameversion if not signed in', function (done) {
    // Create new Gameversion model instance
    var gameversionObj = new Gameversion(gameversion);

    // Save the Gameversion
    gameversionObj.save(function () {
      request(app).get('/api/gameversions/' + gameversionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', gameversion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Gameversion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/gameversions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Gameversion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Gameversion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Gameversion
    request(app).get('/api/gameversions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Gameversion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Gameversion if signed in', function (done) {
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

        // Save a new Gameversion
        agent.post('/api/gameversions')
          .send(gameversion)
          .expect(200)
          .end(function (gameversionSaveErr, gameversionSaveRes) {
            // Handle Gameversion save error
            if (gameversionSaveErr) {
              return done(gameversionSaveErr);
            }

            // Delete an existing Gameversion
            agent.delete('/api/gameversions/' + gameversionSaveRes.body._id)
              .send(gameversion)
              .expect(200)
              .end(function (gameversionDeleteErr, gameversionDeleteRes) {
                // Handle gameversion error error
                if (gameversionDeleteErr) {
                  return done(gameversionDeleteErr);
                }

                // Set assertions
                (gameversionDeleteRes.body._id).should.equal(gameversionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Gameversion if not signed in', function (done) {
    // Set Gameversion user
    gameversion.user = user;

    // Create new Gameversion model instance
    var gameversionObj = new Gameversion(gameversion);

    // Save the Gameversion
    gameversionObj.save(function () {
      // Try deleting Gameversion
      request(app).delete('/api/gameversions/' + gameversionObj._id)
        .expect(403)
        .end(function (gameversionDeleteErr, gameversionDeleteRes) {
          // Set message assertion
          (gameversionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Gameversion error error
          done(gameversionDeleteErr);
        });

    });
  });

  it('should be able to get a single Gameversion that has an orphaned user reference', function (done) {
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

          // Save a new Gameversion
          agent.post('/api/gameversions')
            .send(gameversion)
            .expect(200)
            .end(function (gameversionSaveErr, gameversionSaveRes) {
              // Handle Gameversion save error
              if (gameversionSaveErr) {
                return done(gameversionSaveErr);
              }

              // Set assertions on new Gameversion
              (gameversionSaveRes.body.name).should.equal(gameversion.name);
              should.exist(gameversionSaveRes.body.user);
              should.equal(gameversionSaveRes.body.user._id, orphanId);

              // force the Gameversion to have an orphaned user reference
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

                    // Get the Gameversion
                    agent.get('/api/gameversions/' + gameversionSaveRes.body._id)
                      .expect(200)
                      .end(function (gameversionInfoErr, gameversionInfoRes) {
                        // Handle Gameversion error
                        if (gameversionInfoErr) {
                          return done(gameversionInfoErr);
                        }

                        // Set assertions
                        (gameversionInfoRes.body._id).should.equal(gameversionSaveRes.body._id);
                        (gameversionInfoRes.body.name).should.equal(gameversion.name);
                        should.equal(gameversionInfoRes.body.user, undefined);

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
      Gameversion.remove().exec(done);
    });
  });
});
