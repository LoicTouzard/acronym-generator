class WordNotFoundException {
	constructor(message, letter){
		this.message = message;
		this.name = "WordNotFoundException";
		this.letter = letter
	}
}

module.exports = WordNotFoundException