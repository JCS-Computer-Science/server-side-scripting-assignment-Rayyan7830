const express = require("express");
const uuid = require("uuid")
const server = express();
server.use(express.json())
server.use(express.static("public"))

//All your code goes here
let activeSessions={}
server.get("/newgame", (req, res)=> {
    let newID = uuid.v4()
    let newGame = {
        wordToGuess: "apple",
        guesses:[],
        wrongLetters: [],
        closeLetters: [], //'a' is no longer close because it has been guessed in the correct spot
        rightLetters: [],
        remainingGuesses: 6,
        gameOver: false
    }
    activeSessions[newID] = newGame
    console.log(activeSessions)
    res.status(201)
    res.send({sessionID: newID})
})

server.get("/gamestate", (req, res) => {
    let gameState = {
        guesses:[],
        wrongLetters: [],
        closeLetters: [], //'a' is no longer close because it has been guessed in the correct spot
        rightLetters: [],
        remainingGuesses: 6,
    }
    res.status(200)
    res.send({gameState})
})
//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;