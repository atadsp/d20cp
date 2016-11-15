'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Weapon Schema
 */
var WeaponSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Weapon name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Weapon', WeaponSchema);
