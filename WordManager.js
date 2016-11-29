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
	 *                          			type: OTHER,	//given by WordManager.wordPositions
	 *                          			position: ANYWHERE // given by WordManager.wordTypes
	 *                          		}
	 *                          	}
	 */
	constructor(options={}){
		this._optionsDefault = {
			preposition: "",
			type: WordManager.wordTypes.OTHER,
			position: WordManager.wordPositions.ANYWHERE
		}
		if(typeof options !== 'undefined' && typeof options.default !== 'undefined'){
			// merge user's _optionsDefault with class default
			this._optionsDefault = Object.assign(this._optionsDefault, options.default)
		}
	}


	_valueInObject(value, object){
		for(let prop in object){
			if(object.hasOwnProperty(prop) && object[prop] === value){
				return true
			}
		}
		return false
	}

	_validOptions(options){
		if(typeof options.preposition !== "undefined" &&
			typeof options.preposition !== "string"){
			return false
		}
		if(typeof options.type !== "undefined" &&
			!this._valueInObject(options.type, WordManager.wordTypes)){
			return false
		}
		if(typeof options.position !== "undefined" &&
			!this._valueInObject(options.position, WordManager.wordPositions)){
			return false
		}
		return true
	}

	/**
	 * Create and save a Word
	 * @param {String} value       	The word as String
	 * @param {Object} details 		An Object containing the differents additionnal details of the word
	 *                           	Structured as : (everything is facultative, default values will be used)
	 *                           	{
	 *                           		preposition : {String}	The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
	 *                           		type: {String}			The Word's type : takes values from WordManager.wordTypes -- default is "OTHER"
	 *                           		position: {String}		The Word's prefered position in an acronym : takes values from WordManager.wordPositions -- default is "ANYWHERE"
	 *                           	}
	 * @return {Promise} 			The Promise handling the Word creation
	 */
	create(value, details={}){
		const options = Object.assign({}, this._optionsDefault, details) // apply defaults
		if(typeof value === "string" && value !== "" && this._validOptions(options)){
			let word = new Word({
				value: value,
				preposition: options.preposition,
				type: options.type,
				position: options.position})
			return word.save()
		}
		else{
			return Promise.reject("Incorrect values to create a Word")
		}
	}

	/**
	 * Remove the given Word Object from the database
	 * @param  {Word} word The Word to remove
	 * @return {Promise}
	 */
	removeWord(word){
		return word.remove()
	}

	/**
	 * Remove the Word(s) having the given value from the database, or the word directly if a Word object is passed
	 * @param  {Word or String} the Word to remove, or the string value of the word's) to remove
	 * @return {Promise}
	 */
	remove(word){
		if(word instanceof Word) return this.removeWord(word)
		else{
			return new Promise((resolve,reject) => {
				Word.findOne({value:word})
				.then(wordFound => {
					if(wordFound){
						return this.removeWord(wordFound)
					}
					else{
						reject(err)
					}
				})
				.then(wordRemoved => resolve(wordRemoved))
				.catch(err => reject(err))
			})
		}
	}


	/**
	 * !! WARNING IT WILL REMOVE ALL THE DOCUMENT IN THE DATABASE !!
	 * Remove all the Word Object from the database
	 * @return {Promise}
	 */
	static removeAll(){
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

	/**
	 * Values to define the preferred position of a word
	 * Use ANYWHERE when the word can fit anywhere in an acronym (default constructor value)
	 * Use START when the word can only be placed at the beginning of the acronym
	 * Use MIDDLE when the word can't be placed at the beginning, nor the end of an acronym
	 * Use END when the word can only be placed at the end of the word
	 * @type {Object}
	 */
	static get wordPositions(){
		return {'ANYWHERE':'ANY', 'START':'START', 'MIDDLE':'MID', 'END':'END'}
	}

	/**
	 * Values to defined the type of a word
	 * NOUN : type is noun
	 * ADJECTIVE : type is adjective
	 * ADVERB : type is adverb
	 * VERB_CONJUGATED : type is a verb conjugated TO THE 3RD PERSON SINGULAR
	 * VERB_INFINITIVE : type is a verb in infinitiv form
	 * OTHER : If the word doesn't fit anything
	 * @type {Object}
	 */
	static get wordTypes() {
		return {'NOUN':'NOUN', 'ADJECTIVE':'ADJ', 'ADVERB':'ADVB', 'VERB_CONJUGATED':'VB_CJGT', 'VERB_INFINITIVE':'VB_INF', 'OTHER':'OTHER'}
	}

}

module.exports = WordManager