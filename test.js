'use strict'
const Module = require('./index.js')
const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/AG_test');
const db = mongoose.connection
mongoose.Promise = global.Promise

const end = () => mongoose.disconnect()
const endError = (err) => {console.error(err);end()}

function test1(WM){
	const value = "bnaa"
	const pos = WM.wordPositions
	// create a word
	WM.create(value)
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)

		//find a word
		return WM.findTheWord(value)
	})
	.then((wordFound) => {
		console.log("FOUND : ", wordFound)

		//remove the word
		return WM.remove(wordFound)
	})
	.then((wordRemoved) => {
		console.log("REMOVED : ", wordRemoved)

		// try to refind the word
		return WM.findTheWord(value)
	})
	.then((wordFound) => {
		console.log("FOUND : ", wordFound)
		end()
	})
	.catch(endError)
}

function test2(WM, GEN){
	const acronym = "ABC"

	WM.create("Algorithme")
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Binaire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Baignoire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Concentré")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return GEN.acronymizeWords(acronym)
	})
	.then((response) =>{
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function test3(WM, GEN){
	const acronym = "ABC"

	WM.create("Algorithme")
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Binaire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Baignoire")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return WM.create("Concentré")
	})
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return GEN.acronymize(acronym)
	})
	.then((response) =>{
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}

function test4(WM, GEN){
	const acronym = "aa"

	WM.create("algorithme")
	.then((wordCreated) => {
		console.log("SAVED : ", wordCreated)
		return GEN.acronymizeWords(acronym)
	})
	.then((response) =>{
		console.log("GOT ACRONYM RESPONSE : ",response)
		end()
	})
	.catch(endError)
}


db.once('open', () => {
	// Create / Find / Remove test
	const WordManager = new Module.WordManager()
	const Generator = new Module.Generator()

	WordManager.removeAll()
	.then(() => {
		console.log("DATABASE CLEAR")
		test3(WordManager, Generator)
	})
	.catch(endError)
})


