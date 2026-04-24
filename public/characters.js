const socket = io()

const statBox = document.querySelector('.statsBox')
const checkBox = document.querySelector('.checkBox')
const statBoxForm = document.querySelector('.statBoxForm')

let checked = false
let characters = []

socket.on('ping', (msg) => {
    console.log(msg)
})
function ping() {
    socket.emit('ping', 'ping')
}
socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    renderFormBox(characters)

})
socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
})

function renderFormBox(characters) {
    checkAutoInitiative()
    statFormRender(characters)
}

function checkAutoInitiative() {
    checkBox.innerHTML = ''
    const check = document.createElement('input')
    const label = document.createElement('label')


    check.type = "checkbox"
    check.addEventListener('change', () => {
        if (checked === true) (checked = false);
        else if (checked === false) (checked = true)
    })

    label.textContent = "Auto roll initiative?"


    checkBox.appendChild(check)
    checkBox.appendChild(label)

}

function statFormRender(characters) {
    statBoxForm.innerHTML = ''
    let characterTemplate = createCharacterTemplate()


    Object.keys(characterTemplate).forEach(key => {
        if (key === "id") return
        let label = document.createElement('label')
        let input = document.createElement('input')

        label.textContent = key
        input.value = characterTemplate[key]
        input.type = typeof characterTemplate[key] === "number" ? "number" : "text"
        input.name = key

        input.addEventListener('change', () => {
            characterTemplate[key] = input.value
        })

        const container = document.createElement('div')


        container.appendChild(label)
        container.appendChild(input)
        statBoxForm.appendChild(container)

    })

    statBoxForm.addEventListener("submit", (e) => {
        e.preventDefault()
        createNewCharacter(characterTemplate)
    });


    renderButton(statBoxForm)
    statBox.appendChild(statBoxForm)

}

function createNewCharacter() {
    const statBoxForm = document.querySelector('form')
    const characterTemplate = createCharacterTemplate()
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
        damageTaken: formData.get("damageTaken") === "" ? characterTemplate.damageTaken : Number(formData.get("damageTaken")),
        stats: formData.get("stats") || characterTemplate.stats
    }

    characters.push(newCharacter)
    socket.emit('updateCharactersList', characters)

}

function renderButton(form) {
    const button = document.createElement('button')
    const characterTemplate = createCharacterTemplate()
    button.setAttribute('type', 'submit')
    button.textContent = "Submit Character"
    button.addEventListener('click', () => {
        console.log(characters)
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
        damageTaken: 0,
        stats: [15, 14, 13, 12, 10, 8]
    }
    return characterTemplate
}
