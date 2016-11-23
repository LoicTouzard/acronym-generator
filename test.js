'use strict'
const Ag = require('./Generator.js')
const mongoose = require('mongoose');

let gen = new Ag.Generator()
//gen.execute();

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection

db.once('open', function() {
	console.log(gen.execute())
})

mongoose.disconnect();