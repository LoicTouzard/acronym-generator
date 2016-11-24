'use strict'

const Word = require('./Word')
const mongoose = require('mongoose')

/*
 * Manage the communication with MongoDB for Word Object
 */
class WordManager{
	construct(options={}){
		optionsDefault = {
			lang: "en",
			preposition: "",
			type: "",
			position: Word.POSITION.ANYWHERE
		}
		if(typeof options !== 'undefined' && typeof options.default !== 'undefined'){
			// merge user's optionsDefault with class default
			Object.assign(optionsDefault, options.default)
		}
		this._defaultLang = optionsDefault.lang
		this._defaultPreposition = optionsDefault.preposition
		this._defaultType = optionsDefault.type
		this._defaultPosition = optionsDefault.position
	}

	/**
	 * Create and save a Word
	 * @param {String} value       	The word as String
	 * @param {String} lang        	The Word's lang -- default is "en"
	 * @param {String} preposition 	The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
	 * @param {String} type        	The Word's type : "noun", "adjective", ... -- default is "noun"
	 * @param {String} position 	The prefered position of the word in acronyms : Word.POSITION.ANYWHERE is anywhere, Word.POSITION.START is start, Word.POSITION.MIDDLE is middle, Word.POSITION is end. -- default is Word.POSITION.ANYWHERE
	 *                             	If The type is "adjective" the default position depends of the lang.
	 * @return {Promise} 			The Promise handling the Word creation
	 */
	create(value,
			lang=this._defaultLang,
			preposition=this._defaultPreposition,
			type=this._defaultType,
			position=this._defaultPosition){

		if(type == 'adjective' && position == Word.POSITION.ANYWHERE){
			switch(lang){
				case 'fr':
					position = Word.POSITION.END
					break
				case 'en':
					position = Word.POSITION.START
					break
				default :
					position = Word.POSITION.ANYWHERE
			}
		}
		let word = new Word({ value, lang, preposition, type, position})
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
		return word.remove()
	}

	/**
	 * Find a word in the database having the given value and given lang
	 * @param  {String} value the actual word String
	 * @param  {String} lang  the lang of the word, default can be applied
	 * @return {Promise}      Promise on the request to find the word
	 */
	find(value, lang=this._defaultLang){
		return Word.findOne({ value: value, lang: lang })
	}
}

module.exports = {
	WordManager
}