'use strict'
const mongoose = require('mongoose')

class Word{

	/**
	 * Object Word
	 * @param {String} value       	The word as String
	 * @param {String} lang        	The Word's lang -- default is "en"
	 * @param {String} preposition 	The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
	 * @param {String} type        	The Word's type : "noun", "adjective", ... -- default is "noun"
	 * @param {String} position 	The prefered position of the word in acronyms : Word.POSITION.ANYWHERE is anywhere, Word.POSITION.START is start, Word.POSITION.MIDDLE is middle, Word.POSITION is end. -- default is Word.POSITION.ANYWHERE
	 *                             	If The type is "adjective" the default position depends of the lang.
	 */
	constructor(value,
				lang = "en",
				preposition = "",
				type = "noun",
				position = this.POSITION.ANYWHERE){
		if(type == 'adjective' && position == this.POSITION.ANYWHERE){
			switch(lang){
				case 'fr':
					position = this.POSITION.END
					break
				case 'en':
					position = this.POSITION.START
					break
				default :
					position = this.POSITION.ANYWHERE
			}
		}
		this._value = value
		this._lang = lang
		this._type = type
		this._preposition = preposition
		this._position = position
	}

	get value(){
		return this._value	
	}
	
	get lang(){
		return this._lang	
	}
	
	get type(){
		return this._type	
	}
	
	get preposition(){
		return this._preposition	
	}
	
	get position(){
		return this._position	
	}
	

	/**
	 * Values to define the preferred position for a word
	 * Use Word.POSITION.ANYWHERE when the word can fit anywhere in an acronym (default constructor value)
	 * Use Word.POSITION.START when the word can only be placed at the beginning of the acronym
	 * Use Word.POSITION.MIDDLE when the word can't be placed at the beginning, nor the end of an acronym
	 * Use Word.POSITION.END when the word can only be placed at the end of the word
	 * @type {Object}
	 */
	get POSITION(){
		return {ANYWHERE:"ANY", START:"START", MIDDLE:"MID", END:"END"}
	}

	/*
	 * Return the first letter of the word uppercase
	 * @return {string} 
	 */
	first(){
		return value[0].toUpperCase()
	}

	/*
	 * Say if the word begin with a vowel (true / false)
	 */
	startWithVowel(){
		return ["A","E","I","O","U","Y"].some( l => l === this.first())
	}

	/**
	 * Determine if the current is equal to another
	 * @param  {Word} word 	  The Word to wompare with.
	 * @return {boolean}      True if the Word is equal to the current Word, else false.
	 */
	equalsTo(word){
		if(word instanceof Word){
			return word.value == this.value &&
				word.lang == this.lang &&
				word.type == this.type;
		}
		return false;
	};

	// maybe some use later
	_constructFromJson(json){
		return new Word(json.value, json.lang, json.preposition, json.type, this.POSITION[json.position])
	}
}


module.exports = {
	Word
}