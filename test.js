'use strict'
const mongoose = require('mongoose');
const AcronymGenerator = require('./index.js')
const clearDB = require('./WordManager').removeAll
const positions = AcronymGenerator.positions
const types = AcronymGenerator.types

mongoose.connect('mongodb://localhost/AG_test');
mongoose.Promise = global.Promise
const db = mongoose.connection

const end = () => mongoose.disconnect()
const endError = (err) => {console.error(err);end()}


function creationTest(){
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

function acronymTest(WM, GEN){
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

function impossibleAcronymTest(WM, GEN){
	const acronym = "ABC"
	AcronymGenerator.getAcronym(acronym)
	.then((response) => {
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function noRepetitionAcronymTest(WM, GEN){
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


db.once('open', () => {
	// Create / Find / Remove test

	clearDB().then(() => {
		console.log("DATABASE CLEARED")
		// creationTest()
		// deletionByValueTest()
		// deletionByObjectTest()*
		// acronymTest()
		// impossibleAcronymTest()
		noRepetitionAcronymTest()
	})
	.catch(endError)
})


