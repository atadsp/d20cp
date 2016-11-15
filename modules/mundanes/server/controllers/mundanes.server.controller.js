'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mundane = mongoose.model('Mundane'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mundane
 */
exports.create = function(req, res) {
  var mundane = new Mundane(req.body);
  mundane.user = req.user;

  mundane.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mundane);
    }
  });
};

/**
 * Show the current Mundane
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mundane = req.mundane ? req.mundane.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mundane.isCurrentUserOwner = req.user && mundane.user && mundane.user._id.toString() === req.user._id.toString();

  res.jsonp(mundane);
};

/**
 * Update a Mundane
 */
exports.update = function(req, res) {
  var mundane = req.mundane;

  mundane = _.extend(mundane, req.body);

  mundane.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mundane);
    }
  });
};

/**
 * Delete an Mundane
 */
exports.delete = function(req, res) {
  var mundane = req.mundane;

  mundane.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mundane);
    }
  });
};

/**
 * List of Mundanes
 */
exports.list = function(req, res) {
  Mundane.find().sort('-created').populate('user', 'displayName').exec(function(err, mundanes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mundanes);
    }
  });
};

/**
 * Mundane middleware
 */
exports.mundaneByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mundane is invalid'
    });
  }

  Mundane.findById(id).populate('user', 'displayName').exec(function (err, mundane) {
    if (err) {
      return next(err);
    } else if (!mundane) {
      return res.status(404).send({
        message: 'No Mundane with that identifier has been found'
      });
    }
    req.mundane = mundane;
    next();
  });
};
