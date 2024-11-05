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
    let answerArr = gameState.wordToGuess.split('')
    let predictionArr = prediction.split('')
    let guessArr = []

    for (let i = 0; i < 5; i++) {
        let guessObj = {}
        guessObj.value = predictionArr[i]
        if (predictionArr[i] == answerArr[i]) {
            guessObj.result = "RIGHT"
            gameState.rightLetters.push(predictionArr[i])
            console.log("right")
            console.log(i)
        }
        for (let j = 0; j < 5; j++) {
            if (predictionArr[i] == answerArr[j] && predictionArr[i] != answerArr[i] && predictionArr[i] != gameState.closeLetters[j]) {
                guessObj.result = "CLOSE"
                gameState.closeLetters.push(predictionArr[i])
            }
        }
        if (guessObj.result != "CLOSE" && guessObj.result != "RIGHT") {
            guessObj.result = "WRONG"
            gameState.wrongLetters.push(predictionArr[i])
        }
        guessArr[i] = guessObj
    }
    gameState.guesses.push(predictionArr)
    console.log(gameState)
    res.status(201)
    res.send({gameState})
})
//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports

module.exports = server;

