'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Armor = mongoose.model('Armor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  armor;

/**
 * Armor routes tests
 */
describe('Armor CRUD tests', function () {

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

    // Save a user to the test db and create new Armor
    user.save(function () {
      armor = {
        name: 'Armor name'
      };

      done();
    });
  });

  it('should be able to save a Armor if logged in', function (done) {
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

        // Save a new Armor
        agent.post('/api/armors')
          .send(armor)
          .expect(200)
          .end(function (armorSaveErr, armorSaveRes) {
            // Handle Armor save error
            if (armorSaveErr) {
              return done(armorSaveErr);
            }

            // Get a list of Armors
            agent.get('/api/armors')
              .end(function (armorsGetErr, armorsGetRes) {
                // Handle Armors save error
                if (armorsGetErr) {
                  return done(armorsGetErr);
                }

                // Get Armors list
                var armors = armorsGetRes.body;

                // Set assertions
                (armors[0].user._id).should.equal(userId);
                (armors[0].name).should.match('Armor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Armor if not logged in', function (done) {
    agent.post('/api/armors')
      .send(armor)
      .expect(403)
      .end(function (armorSaveErr, armorSaveRes) {
        // Call the assertion callback
        done(armorSaveErr);
      });
  });

  it('should not be able to save an Armor if no name is provided', function (done) {
    // Invalidate name field
    armor.name = '';

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

        // Save a new Armor
        agent.post('/api/armors')
          .send(armor)
          .expect(400)
          .end(function (armorSaveErr, armorSaveRes) {
            // Set message assertion
            (armorSaveRes.body.message).should.match('Please fill Armor name');

            // Handle Armor save error
            done(armorSaveErr);
          });
      });
  });

  it('should be able to update an Armor if signed in', function (done) {
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

        // Save a new Armor
        agent.post('/api/armors')
          .send(armor)
          .expect(200)
          .end(function (armorSaveErr, armorSaveRes) {
            // Handle Armor save error
            if (armorSaveErr) {
              return done(armorSaveErr);
            }

            // Update Armor name
            armor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Armor
            agent.put('/api/armors/' + armorSaveRes.body._id)
              .send(armor)
              .expect(200)
              .end(function (armorUpdateErr, armorUpdateRes) {
                // Handle Armor update error
                if (armorUpdateErr) {
                  return done(armorUpdateErr);
                }

                // Set assertions
                (armorUpdateRes.body._id).should.equal(armorSaveRes.body._id);
                (armorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Armors if not signed in', function (done) {
    // Create new Armor model instance
    var armorObj = new Armor(armor);

    // Save the armor
    armorObj.save(function () {
      // Request Armors
      request(app).get('/api/armors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Armor if not signed in', function (done) {
    // Create new Armor model instance
    var armorObj = new Armor(armor);

    // Save the Armor
    armorObj.save(function () {
      request(app).get('/api/armors/' + armorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', armor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Armor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/armors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Armor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Armor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Armor
    request(app).get('/api/armors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Armor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Armor if signed in', function (done) {
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

        // Save a new Armor
        agent.post('/api/armors')
          .send(armor)
          .expect(200)
          .end(function (armorSaveErr, armorSaveRes) {
            // Handle Armor save error
            if (armorSaveErr) {
              return done(armorSaveErr);
            }

            // Delete an existing Armor
            agent.delete('/api/armors/' + armorSaveRes.body._id)
              .send(armor)
              .expect(200)
              .end(function (armorDeleteErr, armorDeleteRes) {
                // Handle armor error error
                if (armorDeleteErr) {
                  return done(armorDeleteErr);
                }

                // Set assertions
                (armorDeleteRes.body._id).should.equal(armorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Armor if not signed in', function (done) {
    // Set Armor user
    armor.user = user;

    // Create new Armor model instance
    var armorObj = new Armor(armor);

    // Save the Armor
    armorObj.save(function () {
      // Try deleting Armor
      request(app).delete('/api/armors/' + armorObj._id)
        .expect(403)
        .end(function (armorDeleteErr, armorDeleteRes) {
          // Set message assertion
          (armorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Armor error error
          done(armorDeleteErr);
        });

    });
  });

  it('should be able to get a single Armor that has an orphaned user reference', function (done) {
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

          // Save a new Armor
          agent.post('/api/armors')
            .send(armor)
            .expect(200)
            .end(function (armorSaveErr, armorSaveRes) {
              // Handle Armor save error
              if (armorSaveErr) {
                return done(armorSaveErr);
              }

              // Set assertions on new Armor
              (armorSaveRes.body.name).should.equal(armor.name);
              should.exist(armorSaveRes.body.user);
              should.equal(armorSaveRes.body.user._id, orphanId);

              // force the Armor to have an orphaned user reference
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

                    // Get the Armor
                    agent.get('/api/armors/' + armorSaveRes.body._id)
                      .expect(200)
                      .end(function (armorInfoErr, armorInfoRes) {
                        // Handle Armor error
                        if (armorInfoErr) {
                          return done(armorInfoErr);
                        }

                        // Set assertions
                        (armorInfoRes.body._id).should.equal(armorSaveRes.body._id);
                        (armorInfoRes.body.name).should.equal(armor.name);
                        should.equal(armorInfoRes.body.user, undefined);

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
      Armor.remove().exec(done);
    });
  });
});
