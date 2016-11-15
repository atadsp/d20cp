'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Magicitem Schema
 */
var MagicitemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Magicitem name',
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

mongoose.model('Magicitem', MagicitemSchema);
