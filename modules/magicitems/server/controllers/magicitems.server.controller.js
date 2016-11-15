'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Magicitem = mongoose.model('Magicitem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Magicitem
 */
exports.create = function(req, res) {
  var magicitem = new Magicitem(req.body);
  magicitem.user = req.user;

  magicitem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(magicitem);
    }
  });
};

/**
 * Show the current Magicitem
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var magicitem = req.magicitem ? req.magicitem.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  magicitem.isCurrentUserOwner = req.user && magicitem.user && magicitem.user._id.toString() === req.user._id.toString();

  res.jsonp(magicitem);
};

/**
 * Update a Magicitem
 */
exports.update = function(req, res) {
  var magicitem = req.magicitem;

  magicitem = _.extend(magicitem, req.body);

  magicitem.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(magicitem);
    }
  });
};

/**
 * Delete an Magicitem
 */
exports.delete = function(req, res) {
  var magicitem = req.magicitem;

  magicitem.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(magicitem);
    }
  });
};

/**
 * List of Magicitems
 */
exports.list = function(req, res) {
  Magicitem.find().sort('-created').populate('user', 'displayName').exec(function(err, magicitems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(magicitems);
    }
  });
};

/**
 * Magicitem middleware
 */
exports.magicitemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Magicitem is invalid'
    });
  }

  Magicitem.findById(id).populate('user', 'displayName').exec(function (err, magicitem) {
    if (err) {
      return next(err);
    } else if (!magicitem) {
      return res.status(404).send({
        message: 'No Magicitem with that identifier has been found'
      });
    }
    req.magicitem = magicitem;
    next();
  });
};
