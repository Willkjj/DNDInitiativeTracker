import express from 'express';
import http, { METHODS } from 'http';
import { Server } from 'socket.io';
import fs from 'node:fs'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5137",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('server running')
})


let characters = [
    {
        id: 1,
        Name: 'Voss',
        species: 'Genie',
        class: 'Ranger',
        health: 67,
        maxHealth: 67,
        image: "genie.png",
        initiative: 0,
        damageTaken: 0
    },
    {
        id: 2,
        Name: 'Hinterhaltiger',
        species: 'Impid',
        class: 'Rogue',
        health: 63,
        maxHealth: 63,
        image: "impid.png",
        initiative: 0,
        damageTaken: 0
    },
    {
        id: 3,
        Name: 'Arsenic',
        species: 'Waster',
        class: 'Barbarian',
        health: 87,
        maxHealth: 87,
        image: "waster.png",
        initiative: 0,
        damageTaken: 0
    },
    {
        id: 4,
        Name: 'Xander',
        species: 'Hussar',
        class: 'Fighter',
        health: 77,
        maxHealth: 77,
        image: "hussar.png",
        initiative: 0,
        damageTaken: 0
    },

];
let turnOrder = []
let round = 1
io.on('connection', (socket) => {
    socket.emit('connectMessage', characters)
    sendTurnOrder()
    socket.on('updateCharactersList', (newCharacters) => {

        characters = newCharacters
        sortCharactersByInitiative()
        let charactersString = JSON.stringify(characters, null, 2)
        io.emit('updateCharactersList', characters)
        turnOrder = generateTurnOrder()
        io.emit('turnOrder',turnOrder)
        // fs.writeFile("./characters.json", charactersString, err => { if (err) { console.log(err); } })
    });
    socket.on('createTurnOrder', () => {
        turnOrder = createTurnOrder()
        io.emit('turnOrder', turnOrder)
        io.emit('updateCharactersList', characters)
    })
    socket.on('requestTurnOrder', () => {
        turnOrder = generateTurnOrder()
        io.emit('TurnOrder', turnOrder)
    })
    socket.on('requestUnhide', (character) => {
        unhide(character)
        turnOrder = generateTurnOrder()
        io.emit('firstTurnOrder', turnOrder)
    })

})
function sortCharactersByInitiative() {
    characters.sort((a, b) => b.initiative - a.initiative)
}

// function newTurnOrder() {
    //Sends the shifted, hidden turn to combat.js
    //createTurnOrder(characters)
    //turnOrder = generateTurnOrder(characters)
    //io.emit('newTurnOrder',turnOrder)
//}
// function sendTurnOrder() {
    // Sends an unshifted,unhidden turn to combat.js. Is used to update the turn order without moving onto the next turn
    //turnOrder = generateTurnOrder(characters)
    //io.emit('turnOrder',turnOrder)
//}
// function
function sendTurnOrder() {
    hideAllCharacters(characters)
    turnOrder = generateTurnOrder()
    io.emit('turnOrder', turnOrder)
}

function createTurnOrder() {
        //rename to shiftCharacters
        // Generates turn order and shifts each character down by one
    round++
    console.log(characters)
    let characterShift = characters.shift()
    characters.push(characterShift)
    console.log(characters)
    turnOrder = generateTurnOrder(characters)
    console.log(turnOrder)
    return turnOrder
}
function generateTurnOrder() {
    //Generates the turn order without changing characters
    let previous = undefined
    console.log(round)
    if (round != 1) (previous = characters[(characters.length - 1)])
    let current = characters[0]
    let next = characters[1]
    turnOrder = [previous, current, next]
    return turnOrder
}
function hideAllCharacters(characters) {
    characters.forEach(character => {
        character.hidden = true
    })
}
function unhide(character) {
    let unhiddenCharacterIndex = characters.findIndex(
        char => { if (char.id == character.id) { return char.id } }
    )
    characters[unhiddenCharacterIndex]["hidden"] = false

}
// function readFromFile() {
//     let data = fs.readFileSync("./characters.json", 'utf8', (err, data) => {
//         if (err) {
//             console.log(err)function readFromFile() {
//     let data = fs.readFileSync("./characters.json", 'utf8', (err, data) => {
//         if (err) {
//             console.log(err)
//             return;
//         }
//         return data
//     })
//     return data
// }

// let data = readFromFile()
// JSON.stringify(data)
//             return;
//         }
//         return data
//     })
//     return data
// }

// let data = readFromFile()
// JSON.stringify(data)
// console.log(data)
