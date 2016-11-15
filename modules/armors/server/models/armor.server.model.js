'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Armor Schema
 */
var ArmorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Armor name',
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

mongoose.model('Armor', ArmorSchema);
