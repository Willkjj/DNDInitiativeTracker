import express from 'express';
import http, { METHODS } from 'http';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5137",
        methods: ["GET","POST"]
    }
});

const PORT = 3000;
server.listen(PORT,() => {
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
        initiative : 0,
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
        initiative : 0,
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
        initiative : 0,
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
        characters.sort((a,b) => b.initiative - a.initiative)
        io.emit('updateCharactersList', characters)
    });
    socket.on('ping', () => {
        socket.emit('ping','pong')
    })
    socket.on('createTurnOrder', () => {
        turnOrder = createTurnOrder(characters)
        io.emit('turnOrder',turnOrder)
    })

})
function sendTurnOrder() {
    turnOrder = generateTurnOrder(characters)
    io.emit('turnOrder', turnOrder)
}


function createTurnOrder(characters) {
    round ++ 
    let characterShift = characters.shift()
    characters.push(characterShift)
    turnOrder = generateTurnOrder(characters)
    return turnOrder
}
function generateTurnOrder(characters) {
    characters.sort((a,b) => {b.initiative - a.initiative})
    let previous = ''
    if (round != 1) (previous = characters[(characters.length - 1)])
    let current = characters[0]
    let next = characters[1]
    turnOrder = [previous,current,next]
    return turnOrder
}