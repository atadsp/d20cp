'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rulebook = mongoose.model('Rulebook'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rulebook
 */
exports.create = function(req, res) {
  var rulebook = new Rulebook(req.body);
  rulebook.user = req.user;

  rulebook.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulebook);
    }
  });
};

/**
 * Show the current Rulebook
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var rulebook = req.rulebook ? req.rulebook.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rulebook.isCurrentUserOwner = req.user && rulebook.user && rulebook.user._id.toString() === req.user._id.toString();

  res.jsonp(rulebook);
};

/**
 * Update a Rulebook
 */
exports.update = function(req, res) {
  var rulebook = req.rulebook;

  rulebook = _.extend(rulebook, req.body);

  rulebook.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulebook);
    }
  });
};

/**
 * Delete an Rulebook
 */
exports.delete = function(req, res) {
  var rulebook = req.rulebook;

  rulebook.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulebook);
    }
  });
};

/**
 * List of Rulebooks
 */
exports.list = function(req, res) {
  Rulebook.find().sort('-created').populate('user', 'displayName').exec(function(err, rulebooks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rulebooks);
    }
  });
};

/**
 * Rulebook middleware
 */
exports.rulebookByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rulebook is invalid'
    });
  }

  Rulebook.findById(id).populate('user', 'displayName').exec(function (err, rulebook) {
    if (err) {
      return next(err);
    } else if (!rulebook) {
      return res.status(404).send({
        message: 'No Rulebook with that identifier has been found'
      });
    }
    req.rulebook = rulebook;
    next();
  });
};
