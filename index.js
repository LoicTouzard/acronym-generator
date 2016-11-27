const Generator = require('./Generator')
const WordManager = require('./WordManager')
const WordNotFoundError = require('./WordNotFoundError')

function getAcronym(){
	const G = new Generator()
	return G.acronymize(...arguments)
}

function addWord(){
	const WM = new WordManager()
	return WM.create(...arguments)
}

function removeWord(){
	const WM = new WordManager()
	return WM.remove(...arguments)
}


module.exports = {
	'getAcronym': getAcronym,
	'addWord': addWord,
	'removeWord': removeWord,
	'positions': WordManager.wordPositions,
	'types': WordManager.wordTypes,
	'WordNotFoundError': WordNotFoundError
} 