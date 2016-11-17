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
  description:{
    type:String,
    required: 'Please fill Archetype description',
    trim: true,
    default: ''
  },
  altType:{
    type: String,
    trim: true,
    default: 'Archetype'
  },
  originalClassID:{
    type: String,
    default: '',
    required: 'Please select the original class',
    trim: true
  },
  originalClass:{
    type: String,
    default: '',
    trim: true
  },
  book:{
    type: String,
    default: '',
    trim: true
  },
  bookid:{
    type:String,
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
