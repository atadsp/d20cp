'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Klass = mongoose.model('Klass'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Klass
 */
exports.create = function(req, res) {
  var klass = new Klass(req.body);
  klass.user = req.user;

  klass.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(klass);
    }
  });
};

/**
 * Show the current Klass
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var klass = req.klass ? req.klass.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  klass.isCurrentUserOwner = req.user && klass.user && klass.user._id.toString() === req.user._id.toString();

  res.jsonp(klass);
};

/**
 * Update a Klass
 */
exports.update = function(req, res) {
  var klass = req.klass;

  klass = _.extend(klass, req.body);

  klass.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(klass);
    }
  });
};

/**
 * Delete an Klass
 */
exports.delete = function(req, res) {
  var klass = req.klass;

  klass.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(klass);
    }
  });
};

/**
 * List of Klasses
 */
exports.list = function(req, res) {
  Klass.find().sort('-created').populate('user', 'displayName').exec(function(err, klasses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(klasses);
    }
  });
};

/**
 * Klass middleware
 */
exports.klassByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Klass is invalid'
    });
  }

  Klass.findById(id).populate('user', 'displayName').exec(function (err, klass) {
    if (err) {
      return next(err);
    } else if (!klass) {
      return res.status(404).send({
        message: 'No Klass with that identifier has been found'
      });
    }
    req.klass = klass;
    next();
  });
};
