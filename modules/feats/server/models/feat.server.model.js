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
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  isFighterBonusFeat: {
    type: Boolean,
    default: false
  },
  prerequisite:{
    type: String,
    default: '',
    trim: true
  },
  featprereq: [

  ],
  benefit: {
    type: String,
    default: '',
    trim: true
  },
  special: {
    type: String,
    default: '',
    trim: true
  },
  gameversion: {
    type: String,
    default: '',
    trim: true
  },
  gameversionID:{
    type: String,
    default: '',
    trim: true
  },
  book:{
    type: String,
    default: '',
    required: 'Please select the book this feat comes from',
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
