class WordNotFoundError {
	constructor(message, letter){
		this.message = message
		this.name = "WordNotFoundError"
		this.letter = letter
	}
}

module.exports = WordNotFoundError