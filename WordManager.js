'use strict'

const Word = require('./Word')
const mongoose = require('mongoose')

/*
 * Manage the communication with MongoDB for Word Object
 */
class WordManager{
	/*
	 * Construct the WordManagerClass.
	 * Mongoose should be connected to database to use ths methods
	 * @param {Object}	options 	Define the option for the construction
	 *                          	Available options are :
	 *                          	{
	 *                          		default:{	// will be use as default for the word creation
	 *                          			preposition: "",
	 *                          			type: "",
	 *                          			position: Word.POSITION().ANYWHERE
	 *                          		}
	 *                          	}
	 */
	constructor(options={}){
		let optionsDefault = {
			preposition: "",
			type: "",
			position: Word.POSITION().ANYWHERE
		}
		if(typeof options !== 'undefined' && typeof options.default !== 'undefined'){
			// merge user's optionsDefault with class default
			Object.assign(optionsDefault, options.default)
		}
		this._defaultPreposition = optionsDefault.preposition
		this._defaultType = optionsDefault.type
		this._defaultPosition = optionsDefault.position
	}

	/**
	 * Create and save a Word
	 * @param {String} value       	The word as String
	 * @param {String} preposition 	The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
	 * @param {String} type        	The Word's type : "noun", "adjective", ... -- default is "noun"
	 * @param {String} position 	The prefered position of the word in acronyms : Word.POSITION().ANYWHERE is anywhere, Word.POSITION().START is start, Word.POSITION().MIDDLE is middle, Word.POSITION().END is end. -- default is Word.POSITION().ANYWHERE
	 * @return {Promise} 			The Promise handling the Word creation
	 */
	create(value,
			preposition=this._defaultPreposition,
			type=this._defaultType,
			position=this._defaultPosition){
		let word = new Word({ value, preposition, type, position})
		return word.save()
	}


	/**
	 * Remove a Word Object from the database
	 * @param  {Word} word The Word to remove
	 * @return {Promise}
	 */
	remove(word){
		return word.remove()
	}


	/**
	 * !! WARNING IT WILL REMOVE ALL THE DOCUMENT IN THE DATABASE !!
	 * Remove all the Word Object from the database
	 * @return {Promise}
	 */
	removeAll(){
		return Word.remove({})
	}

	/**
	 * Find the word in the database having the given value
	 * @param  {String} value the actual word String
	 * @return {Promise}      Promise on the request to find the word
	 */
	findTheWord(value){
		return Word.findOne({ value: value})
	}

	
	findBeginingWithAtPosition(beginning, position){
		return Word.find({ value: {$regex : "^" + beginning}, position: position})
	}

	get wordPositions(){
		return Word.POSITION()
	}

}

module.exports = {
	WordManager
}