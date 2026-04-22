import express from 'express';
import http, { METHODS } from 'http';
import { Server } from 'socket.io';
import fs from 'node:fs'
import { SocketAddress } from 'node:net';
import { fileURLToPath } from 'node:url';

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
    console.log(`server running`)
});


let characters = readFromFile()

let turnOrder = []
let round = 1

io.on('connection', (socket) => {
    welcomeMat(socket)
    //Listeners
    socket.on('updateCharactersList', (newCharacters) => {

        characters = newCharacters
        sortCharactersByInitiative()
        io.emit('updateCharactersList', characters)
        turnOrder = generateTurnOrder()
        io.emit('turnOrder', turnOrder)
        writeToFile()
    });

    socket.on('createTurnOrder', () => {
        turnOrder = shiftCharacters()
        io.emit('turnOrder', turnOrder)
        io.emit('updateCharactersList', characters)
    });

    socket.on('requestTurnOrder', () => {
        currentTurnOrder()
    });

    socket.on('requestUnhide', (character) => {
        unhide(character)
        currentTurnOrder()
    });
    socket.on('hideAllCharacters', () => {
        hideAllCharacters()
        currentTurnOrder()
    });

    socket.on('damageCharacter', (character, dmg) => {
        damageCharacter(character, dmg)
    })

    socket.on('deleteCharacter', (character) => {
        deleteCharacter(character)
    })
})

function welcomeMat(socket) {
    socket.emit('connectMessage', characters)
}

function sortCharactersByInitiative() {
    characters.sort((a, b) => b.initiative - a.initiative)
};

function newTurnOrder() {
    // Sends the shifted, hidden turn to combat.js
    turnOrder = shiftCharacters(characters)
    io.emit('newTurnOrder', turnOrder)
}

function currentTurnOrder() {
    // Sends an unshifted,unhidden turn to combat.js. Is used to update the turn order without moving onto the next turn
    turnOrder = generateTurnOrder(characters)
    io.emit('firstTurnOrder', turnOrder)
}


function shiftCharacters() {
    // Generates turn order and shifts each character down by one. I.E: Generates a new round
    let characterShift = characters.shift()

    round++
    characters.push(characterShift)
    turnOrder = generateTurnOrder(characters)

    return turnOrder
};

function generateTurnOrder() {
    //Generates the turn order without changing the characters array. I.E: The current turn order
    let previous = undefined
    let current = characters[0]
    let next = characters[1]

    if (round != 1) (previous = characters[(characters.length - 1)])
    turnOrder = [previous, current, next]

    return turnOrder
};

function hideAllCharacters() {
    characters.forEach(character => {
        character.hidden = true
    })
};

function findCharacter(character) {
    let id = characters.findIndex(
        char => { if (char.id == character.id) { return char.id } }
    )
    return id
}

function unhide(character) {
    let unhiddenCharacterIndex = findCharacter(character)
    characters[unhiddenCharacterIndex]["hidden"] = false

};

function damageCharacter(character, dmg) {
    let damagedCharacterIndex = findCharacter(character)

    characters[damagedCharacterIndex]["health"] -= dmg
    characters[damagedCharacterIndex]["damageTaken"] += (dmg * 1)

    io.emit('updateDamagedCharacters', characters)
}

function deleteCharacter(character) {
    let deletedCharacterIndex = characters.findIndex(
        char => { if (char.id == character.id) { return char.id } }
    )
    characters.splice(deletedCharacterIndex, 1)
    io.emit('updateCharactersList', characters)
}

function writeToFile() {
    let charactersString = JSON.stringify(characters, null, 2)
    fs.writeFile("./characters.json", charactersString, err => { if (err) { console.log(err); } })
}

function readFromFile() {
    let data = fs.readFileSync("./characters.json","utf-8", (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
    })
    data = JSON.parse(data)
    return data

};

let data = readFromFile()
// JSON.parse(data)
console.log("data:",data)
