'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Archetype = mongoose.model('Archetype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Archetype
 */
exports.create = function(req, res) {
  var archetype = new Archetype(req.body);
  archetype.user = req.user;

  archetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(archetype);
    }
  });
};

/**
 * Show the current Archetype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var archetype = req.archetype ? req.archetype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  archetype.isCurrentUserOwner = req.user && archetype.user && archetype.user._id.toString() === req.user._id.toString();

  res.jsonp(archetype);
};

/**
 * Update a Archetype
 */
exports.update = function(req, res) {
  var archetype = req.archetype;

  archetype = _.extend(archetype, req.body);

  archetype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(archetype);
    }
  });
};

/**
 * Delete an Archetype
 */
exports.delete = function(req, res) {
  var archetype = req.archetype;

  archetype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(archetype);
    }
  });
};

/**
 * List of Archetypes
 */
exports.list = function(req, res) {
  Archetype.find().sort('-created').populate('user', 'displayName').exec(function(err, archetypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(archetypes);
    }
  });
};

/**
 * Archetype middleware
 */
exports.archetypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Archetype is invalid'
    });
  }

  Archetype.findById(id).populate('user', 'displayName').exec(function (err, archetype) {
    if (err) {
      return next(err);
    } else if (!archetype) {
      return res.status(404).send({
        message: 'No Archetype with that identifier has been found'
      });
    }
    req.archetype = archetype;
    next();
  });
};
