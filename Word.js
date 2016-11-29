'use strict'

const mongoose = require('mongoose')


let wordSchema = mongoose.Schema({
    value: String,
    preposition: String,
    type: String,
    position: String
})

// index on value for unicity
wordSchema.index({ value: 1}, { unique: true })

/*
 * Return the first letter of the word uppercase
 * @return {string} 
 */
wordSchema.method('first', function(){
	return this.value[0].toUpperCase()
})

/*
 * Say if the word begin with a vowel
 * @return {Boolean}
 */
wordSchema.method('startWithVowel', function(){
	["A","E","I","O","U","Y"].some( l => l === this.first() )
})

/**
 * Determine if the current is equal to another
 * @param  {Word} word 	  The Word to wompare with.
 * @return {boolean}      True if the Word is equal to the current Word, else false.
 */
wordSchema.method('equalsTo', function(word){
	return word.value == this.value
})

// pre save middleware, upperCase the first letter, lowerCase the rest
wordSchema.pre('save', function (next) {
  this.value = this.first() + this.value.substr(1).toLowerCase()
  next()
})


let WordModel = mongoose.model('ag_Word', wordSchema)

module.exports = WordModel