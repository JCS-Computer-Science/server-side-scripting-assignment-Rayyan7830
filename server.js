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
    if(req.query.answer) {
        activeSessions[newID].wordToGuess = req.query.answer
    }
    res.status(201)
    res.send({sessionID: newID})
})

server.get("/gamestate", (req, res) => {
    let currentSession = req.query.sessionID
    let gameState = activeSessions[currentSession]
    res.status(200)
    res.send({gameState})
})

server.post("/guess", (req, res) => {
    let prediction = req.body.guess
    let currentSession = req.body.sessionID
    let gameState = activeSessions[currentSession]
    let answerArr = prediction.split('')
    let guessArr = []
    for (let i = 0; i < 5; i++) {
        let guessObj = {}
        guessObj.value = answerArr[i]
        guessObj.result = "RIGHT"
        guessArr[i] = guessObj
    }
    gameState.guesses.push(guessArr)
    console.log(answerArr)
    res.status(201)
})
//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;