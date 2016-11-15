'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Archetype = mongoose.model('Archetype'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  archetype;

/**
 * Archetype routes tests
 */
describe('Archetype CRUD tests', function () {

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

    // Save a user to the test db and create new Archetype
    user.save(function () {
      archetype = {
        name: 'Archetype name'
      };

      done();
    });
  });

  it('should be able to save a Archetype if logged in', function (done) {
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

        // Save a new Archetype
        agent.post('/api/archetypes')
          .send(archetype)
          .expect(200)
          .end(function (archetypeSaveErr, archetypeSaveRes) {
            // Handle Archetype save error
            if (archetypeSaveErr) {
              return done(archetypeSaveErr);
            }

            // Get a list of Archetypes
            agent.get('/api/archetypes')
              .end(function (archetypesGetErr, archetypesGetRes) {
                // Handle Archetypes save error
                if (archetypesGetErr) {
                  return done(archetypesGetErr);
                }

                // Get Archetypes list
                var archetypes = archetypesGetRes.body;

                // Set assertions
                (archetypes[0].user._id).should.equal(userId);
                (archetypes[0].name).should.match('Archetype name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Archetype if not logged in', function (done) {
    agent.post('/api/archetypes')
      .send(archetype)
      .expect(403)
      .end(function (archetypeSaveErr, archetypeSaveRes) {
        // Call the assertion callback
        done(archetypeSaveErr);
      });
  });

  it('should not be able to save an Archetype if no name is provided', function (done) {
    // Invalidate name field
    archetype.name = '';

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

        // Save a new Archetype
        agent.post('/api/archetypes')
          .send(archetype)
          .expect(400)
          .end(function (archetypeSaveErr, archetypeSaveRes) {
            // Set message assertion
            (archetypeSaveRes.body.message).should.match('Please fill Archetype name');

            // Handle Archetype save error
            done(archetypeSaveErr);
          });
      });
  });

  it('should be able to update an Archetype if signed in', function (done) {
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

        // Save a new Archetype
        agent.post('/api/archetypes')
          .send(archetype)
          .expect(200)
          .end(function (archetypeSaveErr, archetypeSaveRes) {
            // Handle Archetype save error
            if (archetypeSaveErr) {
              return done(archetypeSaveErr);
            }

            // Update Archetype name
            archetype.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Archetype
            agent.put('/api/archetypes/' + archetypeSaveRes.body._id)
              .send(archetype)
              .expect(200)
              .end(function (archetypeUpdateErr, archetypeUpdateRes) {
                // Handle Archetype update error
                if (archetypeUpdateErr) {
                  return done(archetypeUpdateErr);
                }

                // Set assertions
                (archetypeUpdateRes.body._id).should.equal(archetypeSaveRes.body._id);
                (archetypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Archetypes if not signed in', function (done) {
    // Create new Archetype model instance
    var archetypeObj = new Archetype(archetype);

    // Save the archetype
    archetypeObj.save(function () {
      // Request Archetypes
      request(app).get('/api/archetypes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Archetype if not signed in', function (done) {
    // Create new Archetype model instance
    var archetypeObj = new Archetype(archetype);

    // Save the Archetype
    archetypeObj.save(function () {
      request(app).get('/api/archetypes/' + archetypeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', archetype.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Archetype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/archetypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Archetype is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Archetype which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Archetype
    request(app).get('/api/archetypes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Archetype with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Archetype if signed in', function (done) {
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

        // Save a new Archetype
        agent.post('/api/archetypes')
          .send(archetype)
          .expect(200)
          .end(function (archetypeSaveErr, archetypeSaveRes) {
            // Handle Archetype save error
            if (archetypeSaveErr) {
              return done(archetypeSaveErr);
            }

            // Delete an existing Archetype
            agent.delete('/api/archetypes/' + archetypeSaveRes.body._id)
              .send(archetype)
              .expect(200)
              .end(function (archetypeDeleteErr, archetypeDeleteRes) {
                // Handle archetype error error
                if (archetypeDeleteErr) {
                  return done(archetypeDeleteErr);
                }

                // Set assertions
                (archetypeDeleteRes.body._id).should.equal(archetypeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Archetype if not signed in', function (done) {
    // Set Archetype user
    archetype.user = user;

    // Create new Archetype model instance
    var archetypeObj = new Archetype(archetype);

    // Save the Archetype
    archetypeObj.save(function () {
      // Try deleting Archetype
      request(app).delete('/api/archetypes/' + archetypeObj._id)
        .expect(403)
        .end(function (archetypeDeleteErr, archetypeDeleteRes) {
          // Set message assertion
          (archetypeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Archetype error error
          done(archetypeDeleteErr);
        });

    });
  });

  it('should be able to get a single Archetype that has an orphaned user reference', function (done) {
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

          // Save a new Archetype
          agent.post('/api/archetypes')
            .send(archetype)
            .expect(200)
            .end(function (archetypeSaveErr, archetypeSaveRes) {
              // Handle Archetype save error
              if (archetypeSaveErr) {
                return done(archetypeSaveErr);
              }

              // Set assertions on new Archetype
              (archetypeSaveRes.body.name).should.equal(archetype.name);
              should.exist(archetypeSaveRes.body.user);
              should.equal(archetypeSaveRes.body.user._id, orphanId);

              // force the Archetype to have an orphaned user reference
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

                    // Get the Archetype
                    agent.get('/api/archetypes/' + archetypeSaveRes.body._id)
                      .expect(200)
                      .end(function (archetypeInfoErr, archetypeInfoRes) {
                        // Handle Archetype error
                        if (archetypeInfoErr) {
                          return done(archetypeInfoErr);
                        }

                        // Set assertions
                        (archetypeInfoRes.body._id).should.equal(archetypeSaveRes.body._id);
                        (archetypeInfoRes.body.name).should.equal(archetype.name);
                        should.equal(archetypeInfoRes.body.user, undefined);

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
      Archetype.remove().exec(done);
    });
  });
});
