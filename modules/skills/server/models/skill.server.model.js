'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Skill name',
    trim: true
  },
  description:{
    type: String,
    default: '',
    trim: true
  },
  check:{
    type: String,
    default: '',
    trim: true
  },
  action:{
    type: String,
    default: '',
    trim: true
  },
  tryAgain:{
    type: String,
    default: '',
    trim: true
  },
  special: {
    type: String,
    default: '',
    trim: true
  },
  synergy:{
    type: String,
    default: '',
    trim: true
  },
  untrained:{
    type: String,
    default: '',
    trim: true
  },
  keyAbility:{
    type: String,
    default: 'Str',
    trim: true
  },
  trainedOnly:{
    type: Boolean,
    default: false
  },
  armorCheckPen: {
    type: Boolean,
    default: false
  },
  book:{
    type: String,
    default: '',
    required: 'Please select the book this class comes from',
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

mongoose.model('Skill', SkillSchema);
