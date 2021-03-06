'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Gameversion Schema
 */
var GameversionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Gameversion name',
    trim: true
  },
  description: {
    type: String,
    default: '',
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

mongoose.model('Gameversion', GameversionSchema);
