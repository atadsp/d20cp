'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feat Schema
 */
var FeatSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Feat name',
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

mongoose.model('Feat', FeatSchema);
