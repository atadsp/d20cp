'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Language Schema
 */
var LanguageSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Language name',
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

mongoose.model('Language', LanguageSchema);
