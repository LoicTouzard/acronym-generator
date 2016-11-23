'use strict'
const mongoose = require('mongoose')

class Generator {
	constructor(){
		this._connectedOrThrow()
	}

	execute(){
		this._connectedOrThrow()
		return "OK !"
	}

	_connected(){
		return mongoose.connection.readyState == 1
	}
	_connectedOrThrow(){
		if(!this._connected()) throw "ERROR : Mongoose is not connected to database."
	}
}

module.exports = {
	Generator
}