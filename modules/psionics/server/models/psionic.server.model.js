'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Psionic Schema
 */
var PsionicSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Psionic name',
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

mongoose.model('Psionic', PsionicSchema);
