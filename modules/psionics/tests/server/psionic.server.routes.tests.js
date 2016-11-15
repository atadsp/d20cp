'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Psionic = mongoose.model('Psionic'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  psionic;

/**
 * Psionic routes tests
 */
describe('Psionic CRUD tests', function () {

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

    // Save a user to the test db and create new Psionic
    user.save(function () {
      psionic = {
        name: 'Psionic name'
      };

      done();
    });
  });

  it('should be able to save a Psionic if logged in', function (done) {
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

        // Save a new Psionic
        agent.post('/api/psionics')
          .send(psionic)
          .expect(200)
          .end(function (psionicSaveErr, psionicSaveRes) {
            // Handle Psionic save error
            if (psionicSaveErr) {
              return done(psionicSaveErr);
            }

            // Get a list of Psionics
            agent.get('/api/psionics')
              .end(function (psionicsGetErr, psionicsGetRes) {
                // Handle Psionics save error
                if (psionicsGetErr) {
                  return done(psionicsGetErr);
                }

                // Get Psionics list
                var psionics = psionicsGetRes.body;

                // Set assertions
                (psionics[0].user._id).should.equal(userId);
                (psionics[0].name).should.match('Psionic name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Psionic if not logged in', function (done) {
    agent.post('/api/psionics')
      .send(psionic)
      .expect(403)
      .end(function (psionicSaveErr, psionicSaveRes) {
        // Call the assertion callback
        done(psionicSaveErr);
      });
  });

  it('should not be able to save an Psionic if no name is provided', function (done) {
    // Invalidate name field
    psionic.name = '';

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

        // Save a new Psionic
        agent.post('/api/psionics')
          .send(psionic)
          .expect(400)
          .end(function (psionicSaveErr, psionicSaveRes) {
            // Set message assertion
            (psionicSaveRes.body.message).should.match('Please fill Psionic name');

            // Handle Psionic save error
            done(psionicSaveErr);
          });
      });
  });

  it('should be able to update an Psionic if signed in', function (done) {
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

        // Save a new Psionic
        agent.post('/api/psionics')
          .send(psionic)
          .expect(200)
          .end(function (psionicSaveErr, psionicSaveRes) {
            // Handle Psionic save error
            if (psionicSaveErr) {
              return done(psionicSaveErr);
            }

            // Update Psionic name
            psionic.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Psionic
            agent.put('/api/psionics/' + psionicSaveRes.body._id)
              .send(psionic)
              .expect(200)
              .end(function (psionicUpdateErr, psionicUpdateRes) {
                // Handle Psionic update error
                if (psionicUpdateErr) {
                  return done(psionicUpdateErr);
                }

                // Set assertions
                (psionicUpdateRes.body._id).should.equal(psionicSaveRes.body._id);
                (psionicUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Psionics if not signed in', function (done) {
    // Create new Psionic model instance
    var psionicObj = new Psionic(psionic);

    // Save the psionic
    psionicObj.save(function () {
      // Request Psionics
      request(app).get('/api/psionics')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Psionic if not signed in', function (done) {
    // Create new Psionic model instance
    var psionicObj = new Psionic(psionic);

    // Save the Psionic
    psionicObj.save(function () {
      request(app).get('/api/psionics/' + psionicObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', psionic.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Psionic with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/psionics/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Psionic is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Psionic which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Psionic
    request(app).get('/api/psionics/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Psionic with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Psionic if signed in', function (done) {
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

        // Save a new Psionic
        agent.post('/api/psionics')
          .send(psionic)
          .expect(200)
          .end(function (psionicSaveErr, psionicSaveRes) {
            // Handle Psionic save error
            if (psionicSaveErr) {
              return done(psionicSaveErr);
            }

            // Delete an existing Psionic
            agent.delete('/api/psionics/' + psionicSaveRes.body._id)
              .send(psionic)
              .expect(200)
              .end(function (psionicDeleteErr, psionicDeleteRes) {
                // Handle psionic error error
                if (psionicDeleteErr) {
                  return done(psionicDeleteErr);
                }

                // Set assertions
                (psionicDeleteRes.body._id).should.equal(psionicSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Psionic if not signed in', function (done) {
    // Set Psionic user
    psionic.user = user;

    // Create new Psionic model instance
    var psionicObj = new Psionic(psionic);

    // Save the Psionic
    psionicObj.save(function () {
      // Try deleting Psionic
      request(app).delete('/api/psionics/' + psionicObj._id)
        .expect(403)
        .end(function (psionicDeleteErr, psionicDeleteRes) {
          // Set message assertion
          (psionicDeleteRes.body.message).should.match('User is not authorized');

          // Handle Psionic error error
          done(psionicDeleteErr);
        });

    });
  });

  it('should be able to get a single Psionic that has an orphaned user reference', function (done) {
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

          // Save a new Psionic
          agent.post('/api/psionics')
            .send(psionic)
            .expect(200)
            .end(function (psionicSaveErr, psionicSaveRes) {
              // Handle Psionic save error
              if (psionicSaveErr) {
                return done(psionicSaveErr);
              }

              // Set assertions on new Psionic
              (psionicSaveRes.body.name).should.equal(psionic.name);
              should.exist(psionicSaveRes.body.user);
              should.equal(psionicSaveRes.body.user._id, orphanId);

              // force the Psionic to have an orphaned user reference
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

                    // Get the Psionic
                    agent.get('/api/psionics/' + psionicSaveRes.body._id)
                      .expect(200)
                      .end(function (psionicInfoErr, psionicInfoRes) {
                        // Handle Psionic error
                        if (psionicInfoErr) {
                          return done(psionicInfoErr);
                        }

                        // Set assertions
                        (psionicInfoRes.body._id).should.equal(psionicSaveRes.body._id);
                        (psionicInfoRes.body.name).should.equal(psionic.name);
                        should.equal(psionicInfoRes.body.user, undefined);

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
      Psionic.remove().exec(done);
    });
  });
});
