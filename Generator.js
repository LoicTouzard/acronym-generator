'use strict'
const mongoose = require('mongoose')
const async = require('async')
const WordManager = require('./WordManager').WordManager

class WordNotFoundException {
	constructor(message, letter){
		this.message = message;
		this.name = "WordNotFoundException";
		this.letter = letter
	}
}

class Generator {
	constructor(){
		this._WM = new WordManager()
	}

	/**
	 * Calculate and find an acronym from the dictionary dict, returning it in a Promise
	 * @param  {String} text The word to "Acronymyze"
	 * @return {Promise}       The words chosen by the generator for each letter, in order
	 */
	getAcronym(text){
		return new Promise((resolve, reject) =>{
			let textArr = text.toUpperCase().split('')

			// search orders for positions
			const positions = this._WM.wordPositions
			const positionsStartOrder = [positions.START, positions.ANYWHERE, positions.MIDDLE, positions.END]
			const positionsEndOrder = [positions.END, positions.ANYWHERE, positions.MIDDLE, positions.START]
			const positionsMiddleOrder = [positions.MIDDLE, positions.ANYWHERE, positions.START, positions.END]

			let globalResult = []

			async.eachOfSeries(textArr,	// for each letter get a corrsponding word
				(letter, index, callback) => {
					// determine the prefered order according to the index
					let positionsOrder = (index==0)?positionsStartOrder:(index==textArr.length-1)?positionsEndOrder:positionsMiddleOrder
					let requests = positionsOrder.map(pos => this._WM.findBeginingWithAtPosition(letter, pos))
					
					Promise.all(requests)// fetch in database for all different positions
					.then(results =>{
						let chosenWord = undefined
						for (let i = 0; i < results.length; i++) {
							if(Array.isArray(results[i]) && results[i].length != 0){
								// we found something
								let filteredResults = results[i].filter(word =>
									!globalResult.some(w=>
										w.equalsTo(word)))// filter from results[i] the words already in globalResult
								if(filteredResults.length !== 0){ // if there is still word after filter
									chosenWord = this._getRandomElement(filteredResults)
									globalResult.push(chosenWord)
									callback()
									break
								}
							}
						}
						if(chosenWord === undefined) callback(new WordNotFoundException("No word found for letter "+letter, letter))
					})
					.catch(err => callback(err))
				},
				err =>{ // final global callback
					if(err){
						reject(err)
					}
					else{
						resolve(globalResult)
					}
				}
			) // eachOfSeries
		}) // end Promise
	}

	/**
	 * Return random number between 0 and size-1
	 * @param  {Integer} size The excluded maximum
	 * @return {Integer}      A random Integer between 0 and size-1
	 */
	_getRandomIndex(size){
		return parseInt(Math.floor(Math.random()*size));
	};

	/**
	 * Return a random element in the array given
	 * @param  {array} array 	The array to pick into
	 * @return {Object}       	A random element of the array
	 */
	_getRandomElement(array){
		return array[this._getRandomIndex(array.length)];
	};

}

module.exports = {
	Generator
}