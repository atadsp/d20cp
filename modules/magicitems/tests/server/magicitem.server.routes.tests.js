'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Magicitem = mongoose.model('Magicitem'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  magicitem;

/**
 * Magicitem routes tests
 */
describe('Magicitem CRUD tests', function () {

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

    // Save a user to the test db and create new Magicitem
    user.save(function () {
      magicitem = {
        name: 'Magicitem name'
      };

      done();
    });
  });

  it('should be able to save a Magicitem if logged in', function (done) {
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

        // Save a new Magicitem
        agent.post('/api/magicitems')
          .send(magicitem)
          .expect(200)
          .end(function (magicitemSaveErr, magicitemSaveRes) {
            // Handle Magicitem save error
            if (magicitemSaveErr) {
              return done(magicitemSaveErr);
            }

            // Get a list of Magicitems
            agent.get('/api/magicitems')
              .end(function (magicitemsGetErr, magicitemsGetRes) {
                // Handle Magicitems save error
                if (magicitemsGetErr) {
                  return done(magicitemsGetErr);
                }

                // Get Magicitems list
                var magicitems = magicitemsGetRes.body;

                // Set assertions
                (magicitems[0].user._id).should.equal(userId);
                (magicitems[0].name).should.match('Magicitem name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Magicitem if not logged in', function (done) {
    agent.post('/api/magicitems')
      .send(magicitem)
      .expect(403)
      .end(function (magicitemSaveErr, magicitemSaveRes) {
        // Call the assertion callback
        done(magicitemSaveErr);
      });
  });

  it('should not be able to save an Magicitem if no name is provided', function (done) {
    // Invalidate name field
    magicitem.name = '';

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

        // Save a new Magicitem
        agent.post('/api/magicitems')
          .send(magicitem)
          .expect(400)
          .end(function (magicitemSaveErr, magicitemSaveRes) {
            // Set message assertion
            (magicitemSaveRes.body.message).should.match('Please fill Magicitem name');

            // Handle Magicitem save error
            done(magicitemSaveErr);
          });
      });
  });

  it('should be able to update an Magicitem if signed in', function (done) {
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

        // Save a new Magicitem
        agent.post('/api/magicitems')
          .send(magicitem)
          .expect(200)
          .end(function (magicitemSaveErr, magicitemSaveRes) {
            // Handle Magicitem save error
            if (magicitemSaveErr) {
              return done(magicitemSaveErr);
            }

            // Update Magicitem name
            magicitem.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Magicitem
            agent.put('/api/magicitems/' + magicitemSaveRes.body._id)
              .send(magicitem)
              .expect(200)
              .end(function (magicitemUpdateErr, magicitemUpdateRes) {
                // Handle Magicitem update error
                if (magicitemUpdateErr) {
                  return done(magicitemUpdateErr);
                }

                // Set assertions
                (magicitemUpdateRes.body._id).should.equal(magicitemSaveRes.body._id);
                (magicitemUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Magicitems if not signed in', function (done) {
    // Create new Magicitem model instance
    var magicitemObj = new Magicitem(magicitem);

    // Save the magicitem
    magicitemObj.save(function () {
      // Request Magicitems
      request(app).get('/api/magicitems')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Magicitem if not signed in', function (done) {
    // Create new Magicitem model instance
    var magicitemObj = new Magicitem(magicitem);

    // Save the Magicitem
    magicitemObj.save(function () {
      request(app).get('/api/magicitems/' + magicitemObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', magicitem.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Magicitem with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/magicitems/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Magicitem is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Magicitem which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Magicitem
    request(app).get('/api/magicitems/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Magicitem with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Magicitem if signed in', function (done) {
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

        // Save a new Magicitem
        agent.post('/api/magicitems')
          .send(magicitem)
          .expect(200)
          .end(function (magicitemSaveErr, magicitemSaveRes) {
            // Handle Magicitem save error
            if (magicitemSaveErr) {
              return done(magicitemSaveErr);
            }

            // Delete an existing Magicitem
            agent.delete('/api/magicitems/' + magicitemSaveRes.body._id)
              .send(magicitem)
              .expect(200)
              .end(function (magicitemDeleteErr, magicitemDeleteRes) {
                // Handle magicitem error error
                if (magicitemDeleteErr) {
                  return done(magicitemDeleteErr);
                }

                // Set assertions
                (magicitemDeleteRes.body._id).should.equal(magicitemSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Magicitem if not signed in', function (done) {
    // Set Magicitem user
    magicitem.user = user;

    // Create new Magicitem model instance
    var magicitemObj = new Magicitem(magicitem);

    // Save the Magicitem
    magicitemObj.save(function () {
      // Try deleting Magicitem
      request(app).delete('/api/magicitems/' + magicitemObj._id)
        .expect(403)
        .end(function (magicitemDeleteErr, magicitemDeleteRes) {
          // Set message assertion
          (magicitemDeleteRes.body.message).should.match('User is not authorized');

          // Handle Magicitem error error
          done(magicitemDeleteErr);
        });

    });
  });

  it('should be able to get a single Magicitem that has an orphaned user reference', function (done) {
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

          // Save a new Magicitem
          agent.post('/api/magicitems')
            .send(magicitem)
            .expect(200)
            .end(function (magicitemSaveErr, magicitemSaveRes) {
              // Handle Magicitem save error
              if (magicitemSaveErr) {
                return done(magicitemSaveErr);
              }

              // Set assertions on new Magicitem
              (magicitemSaveRes.body.name).should.equal(magicitem.name);
              should.exist(magicitemSaveRes.body.user);
              should.equal(magicitemSaveRes.body.user._id, orphanId);

              // force the Magicitem to have an orphaned user reference
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

                    // Get the Magicitem
                    agent.get('/api/magicitems/' + magicitemSaveRes.body._id)
                      .expect(200)
                      .end(function (magicitemInfoErr, magicitemInfoRes) {
                        // Handle Magicitem error
                        if (magicitemInfoErr) {
                          return done(magicitemInfoErr);
                        }

                        // Set assertions
                        (magicitemInfoRes.body._id).should.equal(magicitemSaveRes.body._id);
                        (magicitemInfoRes.body.name).should.equal(magicitem.name);
                        should.equal(magicitemInfoRes.body.user, undefined);

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
      Magicitem.remove().exec(done);
    });
  });
});
