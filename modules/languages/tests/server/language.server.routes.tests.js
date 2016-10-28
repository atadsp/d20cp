'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Language = mongoose.model('Language'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  language;

/**
 * Language routes tests
 */
describe('Language CRUD tests', function () {

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

    // Save a user to the test db and create new Language
    user.save(function () {
      language = {
        name: 'Language name'
      };

      done();
    });
  });

  it('should be able to save a Language if logged in', function (done) {
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

        // Save a new Language
        agent.post('/api/languages')
          .send(language)
          .expect(200)
          .end(function (languageSaveErr, languageSaveRes) {
            // Handle Language save error
            if (languageSaveErr) {
              return done(languageSaveErr);
            }

            // Get a list of Languages
            agent.get('/api/languages')
              .end(function (languagesGetErr, languagesGetRes) {
                // Handle Languages save error
                if (languagesGetErr) {
                  return done(languagesGetErr);
                }

                // Get Languages list
                var languages = languagesGetRes.body;

                // Set assertions
                (languages[0].user._id).should.equal(userId);
                (languages[0].name).should.match('Language name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Language if not logged in', function (done) {
    agent.post('/api/languages')
      .send(language)
      .expect(403)
      .end(function (languageSaveErr, languageSaveRes) {
        // Call the assertion callback
        done(languageSaveErr);
      });
  });

  it('should not be able to save an Language if no name is provided', function (done) {
    // Invalidate name field
    language.name = '';

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

        // Save a new Language
        agent.post('/api/languages')
          .send(language)
          .expect(400)
          .end(function (languageSaveErr, languageSaveRes) {
            // Set message assertion
            (languageSaveRes.body.message).should.match('Please fill Language name');

            // Handle Language save error
            done(languageSaveErr);
          });
      });
  });

  it('should be able to update an Language if signed in', function (done) {
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

        // Save a new Language
        agent.post('/api/languages')
          .send(language)
          .expect(200)
          .end(function (languageSaveErr, languageSaveRes) {
            // Handle Language save error
            if (languageSaveErr) {
              return done(languageSaveErr);
            }

            // Update Language name
            language.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Language
            agent.put('/api/languages/' + languageSaveRes.body._id)
              .send(language)
              .expect(200)
              .end(function (languageUpdateErr, languageUpdateRes) {
                // Handle Language update error
                if (languageUpdateErr) {
                  return done(languageUpdateErr);
                }

                // Set assertions
                (languageUpdateRes.body._id).should.equal(languageSaveRes.body._id);
                (languageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Languages if not signed in', function (done) {
    // Create new Language model instance
    var languageObj = new Language(language);

    // Save the language
    languageObj.save(function () {
      // Request Languages
      request(app).get('/api/languages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Language if not signed in', function (done) {
    // Create new Language model instance
    var languageObj = new Language(language);

    // Save the Language
    languageObj.save(function () {
      request(app).get('/api/languages/' + languageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', language.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Language with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/languages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Language is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Language which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Language
    request(app).get('/api/languages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Language with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Language if signed in', function (done) {
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

        // Save a new Language
        agent.post('/api/languages')
          .send(language)
          .expect(200)
          .end(function (languageSaveErr, languageSaveRes) {
            // Handle Language save error
            if (languageSaveErr) {
              return done(languageSaveErr);
            }

            // Delete an existing Language
            agent.delete('/api/languages/' + languageSaveRes.body._id)
              .send(language)
              .expect(200)
              .end(function (languageDeleteErr, languageDeleteRes) {
                // Handle language error error
                if (languageDeleteErr) {
                  return done(languageDeleteErr);
                }

                // Set assertions
                (languageDeleteRes.body._id).should.equal(languageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Language if not signed in', function (done) {
    // Set Language user
    language.user = user;

    // Create new Language model instance
    var languageObj = new Language(language);

    // Save the Language
    languageObj.save(function () {
      // Try deleting Language
      request(app).delete('/api/languages/' + languageObj._id)
        .expect(403)
        .end(function (languageDeleteErr, languageDeleteRes) {
          // Set message assertion
          (languageDeleteRes.body.message).should.match('User is not authorized');

          // Handle Language error error
          done(languageDeleteErr);
        });

    });
  });

  it('should be able to get a single Language that has an orphaned user reference', function (done) {
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

          // Save a new Language
          agent.post('/api/languages')
            .send(language)
            .expect(200)
            .end(function (languageSaveErr, languageSaveRes) {
              // Handle Language save error
              if (languageSaveErr) {
                return done(languageSaveErr);
              }

              // Set assertions on new Language
              (languageSaveRes.body.name).should.equal(language.name);
              should.exist(languageSaveRes.body.user);
              should.equal(languageSaveRes.body.user._id, orphanId);

              // force the Language to have an orphaned user reference
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

                    // Get the Language
                    agent.get('/api/languages/' + languageSaveRes.body._id)
                      .expect(200)
                      .end(function (languageInfoErr, languageInfoRes) {
                        // Handle Language error
                        if (languageInfoErr) {
                          return done(languageInfoErr);
                        }

                        // Set assertions
                        (languageInfoRes.body._id).should.equal(languageSaveRes.body._id);
                        (languageInfoRes.body.name).should.equal(language.name);
                        should.equal(languageInfoRes.body.user, undefined);

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
      Language.remove().exec(done);
    });
  });
});
