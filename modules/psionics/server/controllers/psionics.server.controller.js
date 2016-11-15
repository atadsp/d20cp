'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Psionic = mongoose.model('Psionic'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Psionic
 */
exports.create = function(req, res) {
  var psionic = new Psionic(req.body);
  psionic.user = req.user;

  psionic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(psionic);
    }
  });
};

/**
 * Show the current Psionic
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var psionic = req.psionic ? req.psionic.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  psionic.isCurrentUserOwner = req.user && psionic.user && psionic.user._id.toString() === req.user._id.toString();

  res.jsonp(psionic);
};

/**
 * Update a Psionic
 */
exports.update = function(req, res) {
  var psionic = req.psionic;

  psionic = _.extend(psionic, req.body);

  psionic.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(psionic);
    }
  });
};

/**
 * Delete an Psionic
 */
exports.delete = function(req, res) {
  var psionic = req.psionic;

  psionic.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(psionic);
    }
  });
};

/**
 * List of Psionics
 */
exports.list = function(req, res) {
  Psionic.find().sort('-created').populate('user', 'displayName').exec(function(err, psionics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(psionics);
    }
  });
};

/**
 * Psionic middleware
 */
exports.psionicByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Psionic is invalid'
    });
  }

  Psionic.findById(id).populate('user', 'displayName').exec(function (err, psionic) {
    if (err) {
      return next(err);
    } else if (!psionic) {
      return res.status(404).send({
        message: 'No Psionic with that identifier has been found'
      });
    }
    req.psionic = psionic;
    next();
  });
};
