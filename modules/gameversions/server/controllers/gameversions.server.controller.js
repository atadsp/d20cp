'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Gameversion = mongoose.model('Gameversion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Gameversion
 */
exports.create = function(req, res) {
  var gameversion = new Gameversion(req.body);
  gameversion.user = req.user;

  gameversion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gameversion);
    }
  });
};

/**
 * Show the current Gameversion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var gameversion = req.gameversion ? req.gameversion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  gameversion.isCurrentUserOwner = req.user && gameversion.user && gameversion.user._id.toString() === req.user._id.toString();

  res.jsonp(gameversion);
};

/**
 * Update a Gameversion
 */
exports.update = function(req, res) {
  var gameversion = req.gameversion;

  gameversion = _.extend(gameversion, req.body);

  gameversion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gameversion);
    }
  });
};

/**
 * Delete an Gameversion
 */
exports.delete = function(req, res) {
  var gameversion = req.gameversion;

  gameversion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gameversion);
    }
  });
};

/**
 * List of Gameversions
 */
exports.list = function(req, res) {
  Gameversion.find().sort('-created').populate('user', 'displayName').exec(function(err, gameversions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gameversions);
    }
  });
};

/**
 * Gameversion middleware
 */
exports.gameversionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Gameversion is invalid'
    });
  }

  Gameversion.findById(id).populate('user', 'displayName').exec(function (err, gameversion) {
    if (err) {
      return next(err);
    } else if (!gameversion) {
      return res.status(404).send({
        message: 'No Gameversion with that identifier has been found'
      });
    }
    req.gameversion = gameversion;
    next();
  });
};
