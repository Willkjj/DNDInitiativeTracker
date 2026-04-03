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
let firstTime = true
io.on('connection', (socket) => {
    //"Emit"s and "on"s for DM live here?
    socket.emit('connectMessage', characters)
    sendTurnOrder()
    socket.on('clickMsg', (msg) => {
        console.log(msg)
    })
    socket.on('updateCharactersList', (newCharacters) => {
        characters = newCharacters
        characters.sort((a, b) => b.initiative - a.initiative)
        let charactersString = JSON.stringify(characters, null, 2)
        io.emit('updateCharactersList', characters)
        fs.writeFile("./characters.json", charactersString, err => { if (err) { console.log(err); } })
    });
    socket.on('ping', () => {
        socket.emit('ping', 'pong')
    })
    socket.on('createTurnOrder', () => {
        turnOrder = createTurnOrder(characters)
        io.emit('turnOrder', turnOrder)
    })
    socket.on('requestTurnOrder', () => {
        turnOrder = generateTurnOrder(characters)
        io.emit('firstTurnOrder', turnOrder)
    })
    socket.on('requestUnhide', (character) => {
        unhide(character)
        turnOrder = generateTurnOrder(characters)
        io.emit('firstTurnOrder', turnOrder)
    })

})
function sendTurnOrder() {
    hideAllCharacters(characters) //This runs EVERY TIME and will ALWAYS hide characters. fix.
    turnOrder = generateTurnOrder(characters)
    io.emit('turnOrder', turnOrder)
}

function createTurnOrder(characters) {
    round++
    let characterShift = characters.shift()
    characters.push(characterShift)
    turnOrder = generateTurnOrder(characters)
    return turnOrder
}
function generateTurnOrder(characters) {
    characters.sort((a, b) => b.initiative - a.initiative)
    let previous = undefined
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
function readFromFile() {
    let data = fs.readFileSync("./characters.json", 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        return data
    })
    return data
}

let data = readFromFile()
JSON.stringify(data)
// console.log(data)
