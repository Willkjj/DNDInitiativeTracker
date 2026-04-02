const socket = io()
let characters = []

socket.on('ping', (msg) =>{
    console.log(msg)
})
socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    renderCarousel(characters)
})
socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
    renderCarousel(characters)
})
socket.on('turnOrder',(turnOrder) => {
    renderTurnOrder(turnOrder)
    renderCarousel(characters)

})

function renderTurnOrder(turnOrder) {
    const previousTurnCard = document.querySelector('.previousTurn')
    const currentTurnCard = document.querySelector('.currentTurn')
    const nextTurnCard = document.querySelector('.nextTurn')
    let previousTurn = turnOrder[0]
    let currentTurn = turnOrder[1]
    let nextTurn = turnOrder[2]
    populateCard(previousTurn,previousTurnCard)
    populateCard(currentTurn,currentTurnCard)
    populateCard(nextTurn,nextTurnCard)

}

function populateCard(character,card) {
    if (character === '') return
    card.innerHTML = `
    <img src="${character.image}">
    `

}

function renderCarousel() {
    const carousel = document.querySelector('.carousel')
    carousel.textContent = ``
    characters.forEach(character => {
        if (character === '') return
        let img = document.createElement('img')
        img.setAttribute('src', character["image"])
        img.setAttribute('alt',character["name"])
        carousel.appendChild(img)
    })
}
