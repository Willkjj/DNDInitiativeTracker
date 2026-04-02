const socket = io()

let characters = []

socket.on('ping', (msg) =>{
    console.log(msg)
})
function ping() {
    socket.emit('ping','ping')
}
socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    statBoxRender(characters)

})
socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
    statBoxRender(characters)
})

function statBoxRender(characters) {
    const statBox = document.querySelector('.statsBox')
    const statBoxForm = document.createElement('form')
    let characterTemplate = createCharacterTemplate()
    statBox.innerHTML = ''

    Object.keys(characterTemplate).forEach(key => {
        if (key === "id") return
        let label = document.createElement('label')
        let input = document.createElement('input')

        label.textContent = key
        input.value = characterTemplate[key]
        input.type = typeof characterTemplate[key] === "number" ? "number" : "text"

        input.addEventListener('change', () => {
            characterTemplate[key] = input.value
        })
        

        let container = document.createElement('div')

        
        container.appendChild(label)
        container.appendChild(input)
        statBoxForm.appendChild(container)

    })
    statBoxForm.addEventListener("submit", function (e) {
        e.preventDefault()
    });

    const formData = new FormData(statBoxForm)
    const newCharacter = {
            id: characters.length + 1,
            Name: formData.get("Name") || characterTemplate.Name,
            species: formData.get("species") || characterTemplate.species,
            class: formData.get("class") || characterTemplate.class,
            health: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            maxHealth: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            image: formData.get("image") || characterTemplate.image,
            initiative: formData.get("initiative") === "" ? characterTemplate.initiative : Number(formData.get("initiative")),
            damageTaken: formData.get("damageTaken") === "" ? characterTemplate.damageTaken : Number(formData.get("damageTaken"))
        }

    renderButton(statBoxForm, newCharacter)
    statBox.appendChild(statBoxForm)
   
}

function renderButton(form, newCharacter) {
    const button = document.createElement('button')
    button.textContent = "Submit Character"
    button.addEventListener('click', () => { 
        characters.push(newCharacter)
        socket.emit('updateCharactersList',characters)
    })
    form.appendChild(button)
}

function createCharacterTemplate() {
    const characterTemplate = {
        id: 0,
        Name: 'New Character',
        species: '',
        class: '',
        health: 100,
        maxHealth: 100,
        image: "shadowedFigure.webp",
        initiative: 0,
        damageTaken: 0
    }
    return characterTemplate
}
