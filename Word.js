'use strict'

const mongoose = require('mongoose')


let wordSchema = mongoose.Schema({
    value: String,
    lang: String,
    preposition: String,
    type: String,
    position: String
})

// Compound index on value/lang for unicity
wordSchema.index({ value: 1, lang: 1}, { unique: true })

/**
 * Values to define the preferred position for a word
 * Use Word.POSITION().ANYWHERE when the word can fit anywhere in an acronym (default constructor value)
 * Use Word.POSITION().START when the word can only be placed at the beginning of the acronym
 * Use Word.POSITION().MIDDLE when the word can't be placed at the beginning, nor the end of an acronym
 * Use Word.POSITION().END when the word can only be placed at the end of the word
 * @type {Object}
 */
wordSchema.statics.POSITION = () => ({'ANYWHERE':'ANY', 'START':'START', 'MIDDLE':'MID', 'END':'END'})

/*
 * Return the first letter of the word uppercase
 * @return {string} 
 */
wordSchema.method('first', () =>
	this.value[0].toUpperCase()
)

/*
 * Say if the word begin with a vowel
 * @return {Boolean}
 */
wordSchema.method('startWithVowel', () =>
	["A","E","I","O","U","Y"].some( l => l === this.first() )
)

/**
 * Determine if the current is equal to another
 * @param  {Word} word 	  The Word to wompare with.
 * @return {boolean}      True if the Word is equal to the current Word, else false.
 */
wordSchema.method('equalsTo', (word) =>
	word.value == this.value &&
		word.lang == this.lang &&
		word.type == this.type
)

let WordModel = mongoose.model('ag_Word', wordSchema)

module.exports = WordModel