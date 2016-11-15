'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Klass Schema
 */
var KlassSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Class name',
		trim: true
	},
	book: {
		type: String,
		default: '',
		required: 'Please select the book this class comes from',
		trim: true
	},
	bookid: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	prestigeclass: {
		type: Boolean,
		default: false
	},
	babrequirment: {
		type: Number,
		default: 0
	},
	featrequirment: [],
	spellcastingrequirment: {
		type: String,
		default: '',
		trim: true
	},
	specialrequirment: {
		type: String,
		default: '',
		trim: true
	},
	hitdice: {
		type: String,
		default: 'd4',
		trim: true
	},
	skillpoints: {
		type: Number,
		default: 2
	},
	classfeatures: {
		type: String,
		default: '',
		trim: true
	},
	babprogression: {
		type: Number,
		default: 0.5
	},
	fortprogression: {
		type: Number,
		default: 0.34
	},
	refprogression: {
		type: Number,
		default: 0.34
	},
	willprogression: {
		type: Number,
		default: 0.34
	},
	numlevels: {
		type: Number,
		default: 20
	},
	isspellcaster: {
		type: Boolean,
		default: false
	},
	progressesExistingCasting: {
		type: Boolean,
		default: false
	},
	hasZero: {
		type: Boolean,
		default: false
	},
	maxspelllevel: {
		type: Number,
		default: 0
	},
	advancement: [{
		special: {
			type: String,
			default: '',
			trim: true
		},
		zerolevel: {
			type: Number,
			default: 0
		},
		firstlevel: {
			type: Number,
			default: 0
		},
		secondlevel: {
			type: Number,
			default: 0
		},
		thirdlevel: {
			type: Number,
			default: 0
		},
		fourthlevel: {
			type: Number,
			default: 0
		},
		fifthlevel: {
			type: Number,
			default: 0
		},
		sixthlevel: {
			type: Number,
			default: 0
		},
		seventhlevel: {
			type: Number,
			default: 0
		},
		eigthlevel: {
			type: Number,
			default: 0
		},
		ninthlevel: {
			type: Number,
			default: 0
		},
		progressesExisting: {
			type: String,
			default: '',
			trim: true
		}
	}],
	classskills: [],
	spellslink: {
		type: String,
		default: '',
		trim: true
	},
	gameversion: {
		type: String,
		default: '',
		trim: true
	},
	gameversionID: {
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

mongoose.model('Klass', KlassSchema);