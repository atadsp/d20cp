'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rulebook Schema
 */
var RulebookSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Rulebook name',
    trim: true
  },
  tagline: {
    type: String,
    default: '',
    trim: true
  },
  authors: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  gameversions: {
    type: String,
    default: '',
    trim: true
  },
  gameversionID:{
    type: String,
    default: '',
    trim:true
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

mongoose.model('Rulebook', RulebookSchema);
