'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Featcategory = mongoose.model('Featcategory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  featcategory;

/**
 * Featcategory routes tests
 */
describe('Featcategory CRUD tests', function () {

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

    // Save a user to the test db and create new Featcategory
    user.save(function () {
      featcategory = {
        name: 'Featcategory name'
      };

      done();
    });
  });

  it('should be able to save a Featcategory if logged in', function (done) {
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

        // Save a new Featcategory
        agent.post('/api/featcategories')
          .send(featcategory)
          .expect(200)
          .end(function (featcategorySaveErr, featcategorySaveRes) {
            // Handle Featcategory save error
            if (featcategorySaveErr) {
              return done(featcategorySaveErr);
            }

            // Get a list of Featcategories
            agent.get('/api/featcategories')
              .end(function (featcategoriesGetErr, featcategoriesGetRes) {
                // Handle Featcategories save error
                if (featcategoriesGetErr) {
                  return done(featcategoriesGetErr);
                }

                // Get Featcategories list
                var featcategories = featcategoriesGetRes.body;

                // Set assertions
                (featcategories[0].user._id).should.equal(userId);
                (featcategories[0].name).should.match('Featcategory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Featcategory if not logged in', function (done) {
    agent.post('/api/featcategories')
      .send(featcategory)
      .expect(403)
      .end(function (featcategorySaveErr, featcategorySaveRes) {
        // Call the assertion callback
        done(featcategorySaveErr);
      });
  });

  it('should not be able to save an Featcategory if no name is provided', function (done) {
    // Invalidate name field
    featcategory.name = '';

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

        // Save a new Featcategory
        agent.post('/api/featcategories')
          .send(featcategory)
          .expect(400)
          .end(function (featcategorySaveErr, featcategorySaveRes) {
            // Set message assertion
            (featcategorySaveRes.body.message).should.match('Please fill Featcategory name');

            // Handle Featcategory save error
            done(featcategorySaveErr);
          });
      });
  });

  it('should be able to update an Featcategory if signed in', function (done) {
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

        // Save a new Featcategory
        agent.post('/api/featcategories')
          .send(featcategory)
          .expect(200)
          .end(function (featcategorySaveErr, featcategorySaveRes) {
            // Handle Featcategory save error
            if (featcategorySaveErr) {
              return done(featcategorySaveErr);
            }

            // Update Featcategory name
            featcategory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Featcategory
            agent.put('/api/featcategories/' + featcategorySaveRes.body._id)
              .send(featcategory)
              .expect(200)
              .end(function (featcategoryUpdateErr, featcategoryUpdateRes) {
                // Handle Featcategory update error
                if (featcategoryUpdateErr) {
                  return done(featcategoryUpdateErr);
                }

                // Set assertions
                (featcategoryUpdateRes.body._id).should.equal(featcategorySaveRes.body._id);
                (featcategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Featcategories if not signed in', function (done) {
    // Create new Featcategory model instance
    var featcategoryObj = new Featcategory(featcategory);

    // Save the featcategory
    featcategoryObj.save(function () {
      // Request Featcategories
      request(app).get('/api/featcategories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Featcategory if not signed in', function (done) {
    // Create new Featcategory model instance
    var featcategoryObj = new Featcategory(featcategory);

    // Save the Featcategory
    featcategoryObj.save(function () {
      request(app).get('/api/featcategories/' + featcategoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', featcategory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Featcategory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/featcategories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Featcategory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Featcategory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Featcategory
    request(app).get('/api/featcategories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Featcategory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Featcategory if signed in', function (done) {
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

        // Save a new Featcategory
        agent.post('/api/featcategories')
          .send(featcategory)
          .expect(200)
          .end(function (featcategorySaveErr, featcategorySaveRes) {
            // Handle Featcategory save error
            if (featcategorySaveErr) {
              return done(featcategorySaveErr);
            }

            // Delete an existing Featcategory
            agent.delete('/api/featcategories/' + featcategorySaveRes.body._id)
              .send(featcategory)
              .expect(200)
              .end(function (featcategoryDeleteErr, featcategoryDeleteRes) {
                // Handle featcategory error error
                if (featcategoryDeleteErr) {
                  return done(featcategoryDeleteErr);
                }

                // Set assertions
                (featcategoryDeleteRes.body._id).should.equal(featcategorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Featcategory if not signed in', function (done) {
    // Set Featcategory user
    featcategory.user = user;

    // Create new Featcategory model instance
    var featcategoryObj = new Featcategory(featcategory);

    // Save the Featcategory
    featcategoryObj.save(function () {
      // Try deleting Featcategory
      request(app).delete('/api/featcategories/' + featcategoryObj._id)
        .expect(403)
        .end(function (featcategoryDeleteErr, featcategoryDeleteRes) {
          // Set message assertion
          (featcategoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Featcategory error error
          done(featcategoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Featcategory that has an orphaned user reference', function (done) {
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

          // Save a new Featcategory
          agent.post('/api/featcategories')
            .send(featcategory)
            .expect(200)
            .end(function (featcategorySaveErr, featcategorySaveRes) {
              // Handle Featcategory save error
              if (featcategorySaveErr) {
                return done(featcategorySaveErr);
              }

              // Set assertions on new Featcategory
              (featcategorySaveRes.body.name).should.equal(featcategory.name);
              should.exist(featcategorySaveRes.body.user);
              should.equal(featcategorySaveRes.body.user._id, orphanId);

              // force the Featcategory to have an orphaned user reference
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

                    // Get the Featcategory
                    agent.get('/api/featcategories/' + featcategorySaveRes.body._id)
                      .expect(200)
                      .end(function (featcategoryInfoErr, featcategoryInfoRes) {
                        // Handle Featcategory error
                        if (featcategoryInfoErr) {
                          return done(featcategoryInfoErr);
                        }

                        // Set assertions
                        (featcategoryInfoRes.body._id).should.equal(featcategorySaveRes.body._id);
                        (featcategoryInfoRes.body.name).should.equal(featcategory.name);
                        should.equal(featcategoryInfoRes.body.user, undefined);

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
      Featcategory.remove().exec(done);
    });
  });
});
