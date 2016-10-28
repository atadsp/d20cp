'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Deity Schema
 */
var DeitySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Deity name',
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

mongoose.model('Deity', DeitySchema);
