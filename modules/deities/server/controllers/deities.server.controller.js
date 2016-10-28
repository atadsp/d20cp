'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Deity = mongoose.model('Deity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Deity
 */
exports.create = function(req, res) {
  var deity = new Deity(req.body);
  deity.user = req.user;

  deity.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deity);
    }
  });
};

/**
 * Show the current Deity
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var deity = req.deity ? req.deity.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  deity.isCurrentUserOwner = req.user && deity.user && deity.user._id.toString() === req.user._id.toString();

  res.jsonp(deity);
};

/**
 * Update a Deity
 */
exports.update = function(req, res) {
  var deity = req.deity;

  deity = _.extend(deity, req.body);

  deity.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deity);
    }
  });
};

/**
 * Delete an Deity
 */
exports.delete = function(req, res) {
  var deity = req.deity;

  deity.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deity);
    }
  });
};

/**
 * List of Deities
 */
exports.list = function(req, res) {
  Deity.find().sort('-created').populate('user', 'displayName').exec(function(err, deities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(deities);
    }
  });
};

/**
 * Deity middleware
 */
exports.deityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Deity is invalid'
    });
  }

  Deity.findById(id).populate('user', 'displayName').exec(function (err, deity) {
    if (err) {
      return next(err);
    } else if (!deity) {
      return res.status(404).send({
        message: 'No Deity with that identifier has been found'
      });
    }
    req.deity = deity;
    next();
  });
};
