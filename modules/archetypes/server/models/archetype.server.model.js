'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Archetype Schema
 */
var ArchetypeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Archetype name',
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

mongoose.model('Archetype', ArchetypeSchema);
