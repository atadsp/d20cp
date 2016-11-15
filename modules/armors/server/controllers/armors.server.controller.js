'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Armor = mongoose.model('Armor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Armor
 */
exports.create = function(req, res) {
  var armor = new Armor(req.body);
  armor.user = req.user;

  armor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(armor);
    }
  });
};

/**
 * Show the current Armor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var armor = req.armor ? req.armor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  armor.isCurrentUserOwner = req.user && armor.user && armor.user._id.toString() === req.user._id.toString();

  res.jsonp(armor);
};

/**
 * Update a Armor
 */
exports.update = function(req, res) {
  var armor = req.armor;

  armor = _.extend(armor, req.body);

  armor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(armor);
    }
  });
};

/**
 * Delete an Armor
 */
exports.delete = function(req, res) {
  var armor = req.armor;

  armor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(armor);
    }
  });
};

/**
 * List of Armors
 */
exports.list = function(req, res) {
  Armor.find().sort('-created').populate('user', 'displayName').exec(function(err, armors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(armors);
    }
  });
};

/**
 * Armor middleware
 */
exports.armorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Armor is invalid'
    });
  }

  Armor.findById(id).populate('user', 'displayName').exec(function (err, armor) {
    if (err) {
      return next(err);
    } else if (!armor) {
      return res.status(404).send({
        message: 'No Armor with that identifier has been found'
      });
    }
    req.armor = armor;
    next();
  });
};
