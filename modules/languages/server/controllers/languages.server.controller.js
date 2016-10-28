'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Language = mongoose.model('Language'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Language
 */
exports.create = function(req, res) {
  var language = new Language(req.body);
  language.user = req.user;

  language.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(language);
    }
  });
};

/**
 * Show the current Language
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var language = req.language ? req.language.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  language.isCurrentUserOwner = req.user && language.user && language.user._id.toString() === req.user._id.toString();

  res.jsonp(language);
};

/**
 * Update a Language
 */
exports.update = function(req, res) {
  var language = req.language;

  language = _.extend(language, req.body);

  language.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(language);
    }
  });
};

/**
 * Delete an Language
 */
exports.delete = function(req, res) {
  var language = req.language;

  language.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(language);
    }
  });
};

/**
 * List of Languages
 */
exports.list = function(req, res) {
  Language.find().sort('-created').populate('user', 'displayName').exec(function(err, languages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(languages);
    }
  });
};

/**
 * Language middleware
 */
exports.languageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Language is invalid'
    });
  }

  Language.findById(id).populate('user', 'displayName').exec(function (err, language) {
    if (err) {
      return next(err);
    } else if (!language) {
      return res.status(404).send({
        message: 'No Language with that identifier has been found'
      });
    }
    req.language = language;
    next();
  });
};
