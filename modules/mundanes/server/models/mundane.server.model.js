'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mundane Schema
 */
var MundaneSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Mundane name',
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

mongoose.model('Mundane', MundaneSchema);
