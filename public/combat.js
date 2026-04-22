const socket = io()
let characters = []
let turnOrder = []

socket.on('ping', (msg) =>{
    console.log(msg)
});

socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    socket.emit('requestTurnOrder')
    socket.emit('hideAllCharacters')
    renderCarousel()
});

socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
    renderCarousel()
});

socket.on('newTurnOrder', turnOrder => {
    renderCarousel()
    renderTurnOrder(turnOrder)
})

socket.on('turnOrder',(turnOrder) => {
    renderCarousel()
    renderTurnOrder(turnOrder)
});

socket.on('firstTurnOrder',(turnOrder) => {
    initialRenderTurnOrder(turnOrder)
    renderCarousel()
});



function renderTurnOrder(turnOrder) {
    if (turnOrder == []) {   
            socket.emit('requestTurnOrder')
            return
        }
    
    const previousTurnCard = document.querySelector('.previousTurn')
    const currentTurnCard = document.querySelector('.currentTurn')
    const nextTurnCard = document.querySelector('.nextTurn')
    let previousTurn = turnOrder[0]
    let currentTurn = turnOrder[1]
    let nextTurn = turnOrder[2]

    populateCard(previousTurn,previousTurnCard)
    populateCard(currentTurn,currentTurnCard)
    unhide(currentTurn,currentTurnCard)
    populateCard(nextTurn,nextTurnCard)
}

function initialRenderTurnOrder(turnOrder) {
    if (turnOrder == []) {   
            socket.emit('requestTurnOrder')
            return
        }
    
    const previousTurnCard = document.querySelector('.previousTurn')
    const currentTurnCard = document.querySelector('.currentTurn')
    const nextTurnCard = document.querySelector('.nextTurn')
    let previousTurn = turnOrder[0]
    let currentTurn = turnOrder[1]
    let nextTurn = turnOrder[2]

    populateCard(previousTurn,previousTurnCard)
    populateCard(currentTurn,currentTurnCard)
    unhideOnClick(currentTurn,currentTurnCard)
    populateCard(nextTurn,nextTurnCard)
}

function unhide(character, card) {
    card.classList.remove('hidden')
    character.hidden = false
    socket.emit('requestUnhide',character)
}

function unhideOnClick(character,card) {
    card.addEventListener('click', () => {
        card.removeEventListener('click', (card))
        card.classList.remove('hidden')
        character.hidden = false
        socket.emit('requestUnhide',character)
    })
}

function populateCard(character,card) {
    if (character == undefined) return
    card.innerHTML = `
    <img src="${character.image}">
    `
    hideCard(character,card)
};

function hideCard(character,card) {
    if (character.hidden == true) (
        card.classList.add('hidden')
    ); else (
        card.classList.remove('hidden')
    )
};

function renderCarousel() {
    const carousel = document.querySelector('.carousel')
    carousel.textContent = ``
    characters.forEach(character => {
        let characterCard = document.createElement('div')
        characterCard.classList.add('characterCard')
        if (character.damageTaken == 0) (
            characterCard.innerHTML = `<img src="${character.image}">` 
        ); else (
            characterCard.innerHTML = `<p>${character.damageTaken}</p>
        <img src="${character.image}">
        `)
        hideCard(character,characterCard)
        carousel.appendChild(characterCard)
    })
};