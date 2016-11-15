'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Weapon = mongoose.model('Weapon'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  weapon;

/**
 * Weapon routes tests
 */
describe('Weapon CRUD tests', function () {

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

    // Save a user to the test db and create new Weapon
    user.save(function () {
      weapon = {
        name: 'Weapon name'
      };

      done();
    });
  });

  it('should be able to save a Weapon if logged in', function (done) {
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

        // Save a new Weapon
        agent.post('/api/weapons')
          .send(weapon)
          .expect(200)
          .end(function (weaponSaveErr, weaponSaveRes) {
            // Handle Weapon save error
            if (weaponSaveErr) {
              return done(weaponSaveErr);
            }

            // Get a list of Weapons
            agent.get('/api/weapons')
              .end(function (weaponsGetErr, weaponsGetRes) {
                // Handle Weapons save error
                if (weaponsGetErr) {
                  return done(weaponsGetErr);
                }

                // Get Weapons list
                var weapons = weaponsGetRes.body;

                // Set assertions
                (weapons[0].user._id).should.equal(userId);
                (weapons[0].name).should.match('Weapon name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Weapon if not logged in', function (done) {
    agent.post('/api/weapons')
      .send(weapon)
      .expect(403)
      .end(function (weaponSaveErr, weaponSaveRes) {
        // Call the assertion callback
        done(weaponSaveErr);
      });
  });

  it('should not be able to save an Weapon if no name is provided', function (done) {
    // Invalidate name field
    weapon.name = '';

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

        // Save a new Weapon
        agent.post('/api/weapons')
          .send(weapon)
          .expect(400)
          .end(function (weaponSaveErr, weaponSaveRes) {
            // Set message assertion
            (weaponSaveRes.body.message).should.match('Please fill Weapon name');

            // Handle Weapon save error
            done(weaponSaveErr);
          });
      });
  });

  it('should be able to update an Weapon if signed in', function (done) {
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

        // Save a new Weapon
        agent.post('/api/weapons')
          .send(weapon)
          .expect(200)
          .end(function (weaponSaveErr, weaponSaveRes) {
            // Handle Weapon save error
            if (weaponSaveErr) {
              return done(weaponSaveErr);
            }

            // Update Weapon name
            weapon.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Weapon
            agent.put('/api/weapons/' + weaponSaveRes.body._id)
              .send(weapon)
              .expect(200)
              .end(function (weaponUpdateErr, weaponUpdateRes) {
                // Handle Weapon update error
                if (weaponUpdateErr) {
                  return done(weaponUpdateErr);
                }

                // Set assertions
                (weaponUpdateRes.body._id).should.equal(weaponSaveRes.body._id);
                (weaponUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Weapons if not signed in', function (done) {
    // Create new Weapon model instance
    var weaponObj = new Weapon(weapon);

    // Save the weapon
    weaponObj.save(function () {
      // Request Weapons
      request(app).get('/api/weapons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Weapon if not signed in', function (done) {
    // Create new Weapon model instance
    var weaponObj = new Weapon(weapon);

    // Save the Weapon
    weaponObj.save(function () {
      request(app).get('/api/weapons/' + weaponObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', weapon.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Weapon with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/weapons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Weapon is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Weapon which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Weapon
    request(app).get('/api/weapons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Weapon with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Weapon if signed in', function (done) {
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

        // Save a new Weapon
        agent.post('/api/weapons')
          .send(weapon)
          .expect(200)
          .end(function (weaponSaveErr, weaponSaveRes) {
            // Handle Weapon save error
            if (weaponSaveErr) {
              return done(weaponSaveErr);
            }

            // Delete an existing Weapon
            agent.delete('/api/weapons/' + weaponSaveRes.body._id)
              .send(weapon)
              .expect(200)
              .end(function (weaponDeleteErr, weaponDeleteRes) {
                // Handle weapon error error
                if (weaponDeleteErr) {
                  return done(weaponDeleteErr);
                }

                // Set assertions
                (weaponDeleteRes.body._id).should.equal(weaponSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Weapon if not signed in', function (done) {
    // Set Weapon user
    weapon.user = user;

    // Create new Weapon model instance
    var weaponObj = new Weapon(weapon);

    // Save the Weapon
    weaponObj.save(function () {
      // Try deleting Weapon
      request(app).delete('/api/weapons/' + weaponObj._id)
        .expect(403)
        .end(function (weaponDeleteErr, weaponDeleteRes) {
          // Set message assertion
          (weaponDeleteRes.body.message).should.match('User is not authorized');

          // Handle Weapon error error
          done(weaponDeleteErr);
        });

    });
  });

  it('should be able to get a single Weapon that has an orphaned user reference', function (done) {
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

          // Save a new Weapon
          agent.post('/api/weapons')
            .send(weapon)
            .expect(200)
            .end(function (weaponSaveErr, weaponSaveRes) {
              // Handle Weapon save error
              if (weaponSaveErr) {
                return done(weaponSaveErr);
              }

              // Set assertions on new Weapon
              (weaponSaveRes.body.name).should.equal(weapon.name);
              should.exist(weaponSaveRes.body.user);
              should.equal(weaponSaveRes.body.user._id, orphanId);

              // force the Weapon to have an orphaned user reference
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

                    // Get the Weapon
                    agent.get('/api/weapons/' + weaponSaveRes.body._id)
                      .expect(200)
                      .end(function (weaponInfoErr, weaponInfoRes) {
                        // Handle Weapon error
                        if (weaponInfoErr) {
                          return done(weaponInfoErr);
                        }

                        // Set assertions
                        (weaponInfoRes.body._id).should.equal(weaponSaveRes.body._id);
                        (weaponInfoRes.body.name).should.equal(weapon.name);
                        should.equal(weaponInfoRes.body.user, undefined);

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
      Weapon.remove().exec(done);
    });
  });
});
