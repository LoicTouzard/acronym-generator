# acronym-generator
Smartly generates acronyms from a words database you can fill.  


This module allows you generate acronyms and add or remove words in the database.  

This project is inpired from another project of mine generating bullshit acronyms : [BAG](https://github.com/LoicTouzard/BAG). 
It uses almost the same logic to generate acronyms, except that this module use a database to store and retreive words.   

## Install

```
$ npm install --save acronym-generator
```

The modules uses a mongoDB database, and mongoose. So before using this module you must install [MongoDB](https://docs.mongodb.com/v3.2/installation/).  
The document path by the module to store words is `ag_Word`.  
A mongoose connection must be established before using the module. To do so install mongoose at first :  
```
$ npm install --save mongoose
```

## Full example

This is an example of how to use the `acronym-generator` module.  
It add three words in the database, ask for an acronym, remove one word from the database.  

```js
'use strict'
const mongoose = require('mongoose')
const AG = require('acronym-generator')

mongoose.connect('mongodb://localhost/myDatabaseName') // connect your database
mongoose.Promise = global.Promise // override the deprecated mongoose Promise

mongoose.connection.once('open', () => {
    const types = AG.types
    const positions = AG.positions
    // create 3 words for the database
    let addWordPromises = [
        AG.addWord("Algorithm",{type:types.NOUN, position: positions.END}),
        AG.addWord("Binary",{type:types.ADJECTIVE, position: positions.START}),
        AG.addWord("Tree", {type:types.NOUN})
    ]

    Promise.all(addWordPromises) // execute all the addWord promises
    .then(wordsAdded => {
        console.log("ADDED :", wordsAdded.join('\n'))
        /* =>
        ADDED : {value: 'Algorithm', preposition: '', type: 'NOUN', position: 'END'}
                {value: 'Binary', preposition: '', type: 'ADJ', position: 'START'}
                {value: 'Tree', preposition: '', type: 'NOUN', position: 'ANY'}
        */
        return AG.getAcronym("BTA") // chain Promise with asking an acronym for "BTA"
    })
    .then(acronym => {
        console.log(acronym)
        // => "Binary Tree Algorithm"
        return AG.removeWord("Binary") // chain Promise with removing the word Binary
    })
    .then(wordRemoved => {
        console.log("REMOVED :", wordRemoved)
        // => REMOVED : { value: 'Binary', preposition: '', type: 'ADJ', position: 'START'}
        mongoose.disconnect()
        Promise.resolve()
    })
    .catch(err => {
        console.error(err)
        mongoose.disconnect()
        Promise.reject()
    })
})
```

Note that if we chain again with `AG.getAcronym("BTA")` the Promise would be rejected and given an `WordNotFoundError` object.  

## Usage and Documentation

Once you've installed everything, you can open the connection. You should override `mongoose.Promise` because they are deprecated, prefer the `global.Promise` model from [ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  

```js
'use strict'
const mongoose = require('mongoose')
const AG = require('acronym-generator')

mongoose.connect('mongodb://localhost/myDatabaseName')
mongoose.Promise = global.Promise

mongoose.connection.once('open', () => {

    /* You can use the module here */
    
    mongoose.disconnect() // you can log out of the database if you don't need it anymore
})
```

For now on **the examples are assuming** you connected correctly to the database, and that the `mongoose.Promise` are set.  

### Add a word to the database

You can add a word to the database so that it can be picked to form the future acronyms.  
**Note** : You **can't insert two word with the same value**, even if the details are different.  
```js
addWord(word, details) // return Promise
```

The **parameters** are :  
* `word` _{String}_ The actual word to add to the database  
* `details` _{Object}_ Option to add details to the word, to get a better acronym generation  

The different values for `details` are all optional. If one is not provided, the default value will prevail.  
Here are the default values :  
```js
{
    preposition : '',               // The preposition which fit the word if necessary : "de", "d'", ...
    type: AG.types.OTHER,           // The Word's type : takes values from 
    position: AG.positions.ANYWHERE // The Word's prefered position in an acronym : takes values from AcronymGenerator.positions
}
```

The value for `type` and `position` must be from the object [AG.types](#types) and [AG.positions](#positions).  
**This function return** a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  
The `resolve` callback gets the created word.  
The `reject` callback gets a database error, or a duplication error, or an error saying that the values in parameters some incorrect values.  

#### Example

```js
const AG = require('acronym-generator')
let word = "Algorithm"
let details = {
    preposition: '',
    type: AG.types.NOUN,
    position: AG.position.END
}
AcronymGenerator.addWord(word, details)
.then((wordCreated) => console.log("SAVED : ", wordCreated))
.catch((err) => console.error(err)) // db error or duplication error or an error because the input values were not correct
```


### Remove a word from the database

You can remove a word from the database.  
```js
removeWord(word) // return Promise
```

The **parameter** is :  
* `word` _{string|Word}_ The word you want to delete from the database. It can be either the string which value is the word you are looking for, or directly the word Object (that you could have get from [`addWord(word, details)`](#add-a-word-to-the-database) for example)   

**This function return** a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  
The `resolve` callback gets the deleted word.  
The `reject` callback gets a database error.  

#### Example

```js
const AG = require('acronym-generator')
let word = "Algorithm"

AcronymGenerator.removeWord(word)
.then(wordRemoved => console.log("REMOVED : ", wordRemoved))
.catch(err => console.error(err)) // db error, or the word wasn't found in database
```


### Positions

Contains the available positions for a word.  
Use these values in the `details.position` parameter of the function [`addWord(word, details)`](#add-a-word-to-the-database) to set the preferred position of the word in an acronym.  
    
```js
const AG = require('acronym-generator')

console.log(AG.positions)
/* =>
{
    'ANYWHERE':'ANY',
    'START':'START',
    'MIDDLE':'MID',
    'END':'END'
} */
```

Use these values as following :  
* Use `AG.positions.ANYWHERE` when the word can fit anywhere in an acronym (default value)  
* Use `AG.positions.START` when the word can only be placed at the beginning of the acronym  
* Use `AG.positions.MIDDLE` when the word can't be placed at the beginning, nor the end of an acronym  
* Use `AG.positions.END` when the word can only be placed at the end of the word  

 
### Types

Contains the available types for a word.  
Use these values in the `details.type` parameter of the function [`addWord(word, details)`](#add-a-word-to-the-database) to set the type of the word.  
    
```js
const AG = require('acronym-generator')

console.log(AG.types)
/*=> 
{
    'NOUN':'NOUN',
    'ADJECTIVE':'ADJ',
    'ADVERB':'ADVB',
    'VERB_CONJUGATED':'VB_CJGT',
    'VERB_INFITIVE':'VB_INF',
    'OTHER':'OTHER'
} */
```

Use thes values as following :  
* `AG.types.NOUN` when the word's type is noun  
* `AG.types.ADJECTIVE` when the word's type is adjective  
* `AG.types.ADVERB` when the word's type is adverb  
* `AG.types.VERB_CONJUGATED` when the word's type is a verb conjugated **to the 3rd person singular**  
* `AG.types.VERB_INFINITIVE` when the word's type is a verb in infinitive form  
* `AG.types.OTHER` when the word's type doesn't fit any of these  


### Get an Acronym

You can get an acronym made of the words from your database with :  
```js
getAcronym(text) // return Promise
```

The **parameter** is :  
* `text` _{string}_ The word you want to find an acronym for.  

**This function return** a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).  
The `resolve` callback gets the acronym.  
The `reject` callback gets a database error, or an instance of WordNotFoundError when the database has not enough word beginning by a specific letter needed in the algorithm.  
**Note** : The algorithm doens't use the same word twice in the same acronym. The acronym for `"AA"` can't be `"Algorithm Algorithm"`.  

#### Example

```js
const AG = require('acronym-generator')
let text = "BTA"
// assuming the words "Binary", "Tree" and "Algorithm" are in the database

AcronymGenerator.getAcronym(text)
.then(acronym => console.log("GOT ACRONYM : ", acronym)) // => "Binary Tree Algorithm"
.catch(err => {
    if(err instanceof AG.WordNotFoundError) console.error(err.message) // WordNotFoundError error
    else console.error(err) // database error
}) 
```

### WordNotFoundError class

WordNotFoundError is returned in the rejected [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) of the [`getAcronym(text)`](get-an-acronym) function.  
```js
const AG = require('acronym-generator')
AG.WordNotFoundError    // class
```

#### Source

It is a simple class containing some information :  
```js
class WordNotFoundError {
    constructor(message, letter){
        this.message = message              // the error message
        this.name = "WordNotFoundError"     // the name of the exception
        this.letter = letter                // the letter that triggered the error
    }
}
```

### Lasts words...

Feel free to use it !  

[Loïc Touzard](https://github.com/LoicTouzard)
