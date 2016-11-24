'use strict'
const Module = require('./index.js')
const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection
mongoose.Promise = global.Promise

const end = () => mongoose.disconnect()
const endError = (err) => {console.error(err);end()}

db.once('open', function() {
	// Create / Find / Remove test
	const WordManager = new Module.WordManager()

	const value = "bnaa"
	const lang = "fr"

	// create a word
	WordManager.create(value, lang)
	.then((word) => {
		console.log("SAVED : ", word)

		//find a word
		WordManager.find(value, lang)
		.then((word) => {
			console.log("FOUND : ", word)

			//remove the word
			WordManager.remove(word)
			.then((word) => {
				console.log("REMOVED : ", word)

				// try to refind the word
				WordManager.find(value, lang)
				.then((word) => {
					console.log("FOUND : ", word)
					end()
				})
				.catch(endError)
			})
			.catch(endError)
		})
		.catch(endError)
	})
	.catch(endError)


})


