
const socket = io()

const buttonBox = document.querySelector('.buttonBox')
const statBox = document.querySelector('.statsBox')
const rollerBox = document.querySelector('.rollerBox')

let characters = []

const dice = [
    {
        name: "d4",
        number: 4
    },
    {
        name: "d6",
        number: 6
    },
    {
        name: "d8",
        number: 8
    },
    {
        name: "d10",
        number: 10
    },
    {
        name: "d12",
        number: 12
    },
    {
        name: "d20",
        number: 20
    }
]

socket.on('connectMessage', (serverCharacters) => {
    characters = serverCharacters;
    buttonBoxRender(characters)
    statBoxRender(characters)
    rollerBoxRender(characters)
})
socket.on('updateCharactersList', (serverCharacters) => {
    characters = serverCharacters
    buttonBoxRender(characters)
    rollerBoxRender(characters)
})

socket.on('updateDamagedCharacters', (serverCharacters) => {
    characters = serverCharacters
    statBoxFormRender(statBox)
})

const sleep = async (button) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    button.classList.add('selectedSleeping')
    await delay(250);
    button.classList.remove('selectedSleeping')
};
function findCharacter(characters) {
    let selected = document.querySelector('.selected')
    if (selected === null) return
    else {
        let selectedCharacter = characters.find(
            char => { if (selected.classList.contains(char.id) == true) { return char.id } }
        )
        return selectedCharacter
    }
}

function generateCharacterKeys(character, statBoxForm) {
    Object.keys(character).forEach(key => {
        if (key === "id") return
        if (key === "hidden") return
        let label = document.createElement('label')
        let input = document.createElement('input')

        label.textContent = key
        input.value = character[key]
        input.type = typeof character[key] === "number" ? "number" : "text"

        input.addEventListener('change', () => {
            if (typeof character[key] === "number") (
                character[key] = Number(input.value)
            ); else (
                character[key] = input.value
            )

            socket.emit('updateCharactersList', characters)
        })


        let container = document.createElement('div')


        container.appendChild(label)
        container.appendChild(input)
        statBoxForm.appendChild(container)

    })
}

//Render statBox
function statBoxRender() {
    statBox.innerHTML = ''

    renderTurnButton(statBox)
    renderHideCharactersButton(statBox)
    renderDeleteCharacterButton(statBox)
    statBoxFormRender(statBox)
}

function statBoxFormRender(statBox) {
    let statBoxForm = document.querySelector('.statBoxForm')
    if (statBoxForm == null) {
        statBoxForm = document.createElement('form')
        statBoxForm.classList.add('statBoxForm')
    } else {
        statBoxForm = document.querySelector('.statBoxForm')
        statBoxForm.innerHTML = ``
    }

    let character = findCharacter(characters)
    if (character === undefined) return

    generateCharacterKeys(character, statBoxForm)
    statBoxForm.addEventListener("submit", function (e) {
        e.preventDefault()
    });

    renderDamageButton(statBoxForm)

    statBox.appendChild(statBoxForm)
}

//Render Button Box
function buttonBoxRender(characters) {
    buttonBox.innerHTML = ''
    characters.sort((a, b) => b.initiative - a.initiative)
    characters.forEach(char => {
        let button = document.createElement('button')
        button.textContent = char.Name
        button.addEventListener('click', () => {
            buttonSelect(button)
        })
        button.classList.add("character")
        button.classList.add(`${char.id}`)
        buttonBox.appendChild(button)
    });

}

//Render rollerBox
function rollerBoxRender(characters) {
    rollerBox.innerHTML = ''
    let selected = findCharacter(characters)

    const diceBox = document.createElement('div')
    diceBox.classList.add("diceBox")

    renderSelectedCharacterP(selected)
    renderStatsDropdown(selected, diceBox)
    renderDiceBox(0, selected, diceBox)
    rollerBox.appendChild(diceBox)
};

function renderSelectedCharacterP(selected) {
    let p = document.createElement('p')

    if (selected == undefined) (p.textContent = `No character selected`)
    else (p.textContent = `Current character is ${selected['Name']}`)

    p.classList.add('currentCharacter')

    rollerBox.appendChild(p)
}

function renderStatsDropdown(selected, diceBox) {
    let select = document.createElement('select')

    select.innerHTML = ``
    select.setAttribute("id", "statSelect")
    renderStatOptions(select, selected)

    select.addEventListener("change", () => {
        let stat = select.value
        renderDiceBox(stat, selected, diceBox)
    })


    rollerBox.appendChild(select)
}

function renderStatOptions(statSelect, selected) {
    if (selected === undefined) return
    let stats = getStats(selected)
    stats.forEach(stat => {
        let option = document.createElement("option")
        let modifer = getModifier(stat)

        if (modifer < 0) (modifer = `-${Math.abs(modifer)}`)
        else (modifer = `+${modifer}`)
        option.value = stat
        option.innerHTML = `${stat} (${modifer})`
        statSelect.appendChild(option)

    })
}

function renderDiceBox(stat, selected, diceBox) {
    let statsList = getStats(selected)

    diceBox.innerHTML = ''

    dice.forEach(die => {
        let button = document.createElement('button')

        button.textContent = die['name']
        button.addEventListener('click', () => {
            let modifer = 0
            if (selected !== undefined) (modifer = getModifier(stat))
            let roll = diceRoll(die["number"])
            if (modifer < 0) {
                modifer = Math.abs(modifer)
                logInOutput(`${roll} - ${modifer} = ${roll - modifer}`)
            } else {
                logInOutput(`${roll} + ${modifer} = ${modifer + roll}`)

            }
        })

        diceBox.appendChild(button)
    });
}

function logInOutput(message) {
    let outputBox = document.querySelector(".outputBox")
    let p = document.createElement("p")
    p.innerHTML = message
    outputBox.appendChild(p)
};

function getModifier(stat) {
    return Math.floor((stat - 10) / 2)
};

function diceRoll(die) {
    return Math.floor(Math.random() * die + 1)
};

function getStats(char) {
    if (char === undefined) return

    let statsList = char['stats']

    if (typeof statsList === "string") {

        statsList = statsList.split(',')
        statsList = statsList.map(stat => { return Number(stat) })

        return statsList
    } else {
        return statsList
    }

}

function buttonSelect(button) {

    let unselected = document.querySelectorAll('.character')
    unselected.forEach(btn => {
        btn.classList.remove('selected')
    })
    button.classList.add('selected')
    statBoxRender(characters)
    rollerBoxRender(characters)

};

function renderTurnButton(statBox) {
    const button = document.createElement('button')
    button.addEventListener('click', () => {
        socket.emit('createTurnOrder')
        sleep(button)
    })
    button.textContent = 'Next turn'
    statBox.appendChild(button)
};

function renderHideCharactersButton(statBox) {
    const button = document.createElement('button')
    button.addEventListener('click', () => {
        socket.emit('hideAllCharacters')
        sleep(button)
    })
    button.textContent = 'Hide Characters'
    statBox.appendChild(button)
}

function renderDamageButton(statBoxForm) {
    const container = document.createElement('div')
    const input = document.createElement('input')
    const button = document.createElement('button')

    let character = findCharacter(characters)


    button.addEventListener('click', () => {
        let dmg = input.value
        socket.emit('damageCharacter', character, dmg)
        sleep(button)
    })
    button.textContent = 'Attacked for:'

    container.appendChild(button)
    container.appendChild(input)
    container.classList.add('damageButtonDiv')

    statBoxForm.appendChild(container)
}

function renderDeleteCharacterButton(statBox) {
    const button = document.createElement('button')
    let character = findCharacter(characters)

    button.addEventListener('click', () => {
        socket.emit('deleteCharacter', character)
        sleep(button)

    })

    button.textContent = 'Delete Character'

    statBox.appendChild(button)
};


