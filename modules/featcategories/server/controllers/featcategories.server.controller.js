'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Featcategory = mongoose.model('Featcategory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Featcategory
 */
exports.create = function(req, res) {
  var featcategory = new Featcategory(req.body);
  featcategory.user = req.user;

  featcategory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(featcategory);
    }
  });
};

/**
 * Show the current Featcategory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var featcategory = req.featcategory ? req.featcategory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  featcategory.isCurrentUserOwner = req.user && featcategory.user && featcategory.user._id.toString() === req.user._id.toString();

  res.jsonp(featcategory);
};

/**
 * Update a Featcategory
 */
exports.update = function(req, res) {
  var featcategory = req.featcategory;

  featcategory = _.extend(featcategory, req.body);

  featcategory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(featcategory);
    }
  });
};

/**
 * Delete an Featcategory
 */
exports.delete = function(req, res) {
  var featcategory = req.featcategory;

  featcategory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(featcategory);
    }
  });
};

/**
 * List of Featcategories
 */
exports.list = function(req, res) {
  Featcategory.find().sort('-created').populate('user', 'displayName').exec(function(err, featcategories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(featcategories);
    }
  });
};

/**
 * Featcategory middleware
 */
exports.featcategoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Featcategory is invalid'
    });
  }

  Featcategory.findById(id).populate('user', 'displayName').exec(function (err, featcategory) {
    if (err) {
      return next(err);
    } else if (!featcategory) {
      return res.status(404).send({
        message: 'No Featcategory with that identifier has been found'
      });
    }
    req.featcategory = featcategory;
    next();
  });
};
