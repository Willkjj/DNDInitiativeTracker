const socket = io()

const buttonBox = document.querySelector('.buttonBox')
let characters = []

socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    buttonBoxRender(characters)

})
socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
    buttonBoxRender(characters)
})
socket.on('ping', (msg) =>{
    console.log(msg)
})
function ping() {
    socket.emit('ping','ping')
}
const delay = ms => new Promise(res => setTimeout(res, ms));
const sleep = async (button) => {
    button.classList.add('selected')
    await delay(250);
    button.classList.remove('selected')
};
function findCharacter(characters) {
    let  selected = document.querySelector('.selected')
    let selectedCharacter = characters.find(
        char => char.Name === selected.textContent
    )
    return selectedCharacter
}

function statBoxRender(characters) {
    const statBox = document.querySelector('.statsBox')
    const statBoxForm = document.createElement('form')
    let character = findCharacter(characters)
    statBox.innerHTML = ''

    Object.keys(character).forEach(key => {
        if (key === "id") return
        let label = document.createElement('label')
        let input = document.createElement('input')

        label.textContent = key
        input.value = character[key]
        input.type = typeof character[key] === "number" ? "number" : "text"

        input.addEventListener('change', () => {
            character[key] = input.value
            socket.emit('updateCharactersList',characters)
        })
        

        let container = document.createElement('div')

        
        container.appendChild(label)
        container.appendChild(input)
        statBoxForm.appendChild(container)

    })
    statBoxForm.addEventListener("submit", function (e) {
        e.preventDefault()
    });
    renderTurnButton(statBoxForm)
    renderDamageButton(statBox)
    statBox.appendChild(statBoxForm)
   
}

function buttonBoxRender(characters) {
    buttonBox.innerHTML = ''
    characters.sort((a,b) => {b.initiative - a.initiative})
    characters.forEach(char => {
        let button = document.createElement('button')
        button.textContent = char.Name
        button.addEventListener('click', () => {
            buttonSelect(button)
        })
        button.classList.add("character")
        buttonBox.appendChild(button)
    });

}

function buttonSelect(button) {

    let unselected = document.querySelectorAll('.character')
    unselected.forEach(btn => {
        btn.classList.remove('selected')
    })
    button.classList.add('selected')
    statBoxRender(characters)

}

function renderTurnButton(form) {
    const button = document.createElement('button')
    button.addEventListener('click', () => {
        socket.emit('createTurnOrder')
        sleep(button)

    })
    button.textContent = 'Next turn'
    form.appendChild(button)
}

function renderDamageButton(form) {

}

