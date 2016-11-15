'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Weapon = mongoose.model('Weapon'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Weapon
 */
exports.create = function(req, res) {
  var weapon = new Weapon(req.body);
  weapon.user = req.user;

  weapon.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(weapon);
    }
  });
};

/**
 * Show the current Weapon
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var weapon = req.weapon ? req.weapon.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  weapon.isCurrentUserOwner = req.user && weapon.user && weapon.user._id.toString() === req.user._id.toString();

  res.jsonp(weapon);
};

/**
 * Update a Weapon
 */
exports.update = function(req, res) {
  var weapon = req.weapon;

  weapon = _.extend(weapon, req.body);

  weapon.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(weapon);
    }
  });
};

/**
 * Delete an Weapon
 */
exports.delete = function(req, res) {
  var weapon = req.weapon;

  weapon.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(weapon);
    }
  });
};

/**
 * List of Weapons
 */
exports.list = function(req, res) {
  Weapon.find().sort('-created').populate('user', 'displayName').exec(function(err, weapons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(weapons);
    }
  });
};

/**
 * Weapon middleware
 */
exports.weaponByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Weapon is invalid'
    });
  }

  Weapon.findById(id).populate('user', 'displayName').exec(function (err, weapon) {
    if (err) {
      return next(err);
    } else if (!weapon) {
      return res.status(404).send({
        message: 'No Weapon with that identifier has been found'
      });
    }
    req.weapon = weapon;
    next();
  });
};
