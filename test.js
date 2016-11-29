'use strict'
const mongoose = require('mongoose');
const AcronymGenerator = require('./index.js')
const clearDB = require('./WordManager').removeAll
const positions = AcronymGenerator.positions
const types = AcronymGenerator.types

mongoose.connect('mongodb://localhost/AG_test')
mongoose.Promise = global.Promise
const db = mongoose.connection

const end = () => mongoose.disconnect()
const endError = (err) => {console.error(err);end()}


function creationTest(){
	console.log("CREAT")
	const value = "Diagram"
	const options = {
		position: positions.END,
		type: types.NOUN,
		preposition: ""
	}
	// create a word
	AcronymGenerator.addWord(value, options)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		end()
	})
	.catch(endError)
}

function creationErrorTest(){
	const value = "Diagram"
	const options = {
		position: "a wrong value",
		type: types.NOUN,
		preposition: ""
	}
	// create a word
	AcronymGenerator.addWord(value, options)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		end()
	})
	.catch(endError)
}

function creationEmptyWordTest(){
	const value = ""
	// create a word
	AcronymGenerator.addWord(value)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		end()
	})
	.catch(endError)
}

function deletionByValueTest(){
	const value = "Diagram"
	// create a word
	AcronymGenerator.addWord(value)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.removeWord(value)
	})
	.then((wordRemoved) => {
		console.log("REMOVED : ", wordRemoved)
		end()
	})
	.catch(endError)
}

function deletionByObjectTest(){
	const value = "Diagram"
	// create a word
	AcronymGenerator.addWord(value)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.removeWord(wordCreated)
	})
	.then((wordRemoved) => {
		console.log("REMOVED : ", wordRemoved)
		end()
	})
	.catch(endError)
}

function hasWordTest(){
	const value = "Diagram"
	// create a word
	AcronymGenerator.addWord(value)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.hasWord(value)
	})
	.then((has) => {
		console.log("HAS WORD : ", has)
		end()
	})
	.catch(endError)
}

function hasNotWordTest(){
	const value1 = "Diagram"
	const value2 = "Data"
	// create a word
	AcronymGenerator.addWord(value1)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.hasWord(value2)
	})
	.then((has) => {
		console.log("HAS WORD : ", has)
		end()
	})
	.catch(endError)
}

function findWordsBeginningWithTest(){
	const value1 = "Diagram"
	const value2 = "Data"
	const letter = "D"
	// create a word
	AcronymGenerator.addWord(value1)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.addWord(value2)
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.findWordsBeginningWith(letter)
	})
	.then((words) => {
		console.log("FOUND : ", words.map(w=>w.value).join(' '))
		end()
	})
	.catch(endError)
}

function acronymTest(){
	const acronym = "ABC"

	AcronymGenerator.addWord("Algorithme")
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.addWord("Binaire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.addWord("Baignoire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.addWord("Concentré")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.getAcronym(acronym)
	})
	.then((response) => {
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function impossibleAcronymTest(){
	const acronym = "ABC"
	AcronymGenerator.getAcronym(acronym)
	.then((response) => {
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function noRepetitionAcronymTest(){
	const acronym = "aa"

	AcronymGenerator.addWord("Algorithme")
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return AcronymGenerator.getAcronym(acronym)
	})
	.then((response) =>{
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function globalTest(){
	const types = AcronymGenerator.types
	const positions = AcronymGenerator.positions
	let addWordPromises = [
		AcronymGenerator.addWord("Algorithm",{type:types.NOUN}),
		AcronymGenerator.addWord("Binary",{type:types.ADJECTIVE, position: positions.START}),
		AcronymGenerator.addWord("Tree")
	]

	Promise.all(addWordPromises)
	.then(wordsAdded => {
		console.log("ADDED :", wordsAdded.join(' '))
		return AcronymGenerator.getAcronym("BTA")
	})
	.then(acronym => {
		console.log(acronym)
		return AcronymGenerator.removeWord("Binary")
	})
	.then(wordRemoved => {
		console.log("REMOVED :", wordRemoved)
		mongoose.disconnect()
		Promise.resolve()
	})
	.catch(err => {
		console.error(err)
		mongoose.disconnect()
		Promise.reject()
	})
}

db.once('open', () => {
	clearDB().then(() => {
		console.log("DATABASE CLEARED")
		// creationTest()
		// creationErrorTest()
		// creationEmptyWordTest()
		// deletionByValueTest()
		// deletionByObjectTest()
		// hasWordTest()
		// hasNotWordTest()
		// findWordsBeginningWithTest()
		// acronymTest()
		// impossibleAcronymTest()
		// noRepetitionAcronymTest()
		globalTest()
	})
	.catch(endError)
})


