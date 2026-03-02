const characterSection = document.querySelector('.charactersSection')
const initForm = document.querySelector('.initiativeForm')

let characters = [
    {
        id: 1,
        name: 'Voss',
        species: 'Genie',
        class: 'Ranger',
        health: 70,
        maxHealth: 70 ,
        image: "areT.png",
        initiative: 0,
        damageTaken: 0
    },
    {
        id: 2,
        name: 'Hinterhaltiger',
        species: 'Impid',
        class: 'Rogue',
        health: 100,
        maxHealth: 100,
        image: "shadowedFigure.webp",
        initiative : 0,
        damageTaken: 0
    },
    {
        id: 3,
        name: 'Arsenic',
        species: 'Waster',
        class: 'Barbarian',
        health: 66,
        maxHealth: 66,
        image: "shadowedFigure.webp",
        initiative : 0,
        damageTaken: 0
    },
    {
        id: 4,
        name: 'Xander',
        species: 'Hussar',
        class: 'Fighter',
        health: 100,
        maxHealth: 100,
        image: "shadowedFigure.webp",
        initiative : 0,
        damageTaken: 0
    },


];

function hideCards() {
    let cardArray = document.querySelectorAll(".card")
    cardArray.forEach(card =>{
    card.classList.add("hidden")
    });
    
}

function deleteCard(card,character) {
    card.remove()
    characters = characters.filter(c => c.id !== character.id)
    characters.forEach(c => {
        c.id = characters.length + 1
    });
}


renderCharacter()
hideCards()


function attacked(character,damage) { 
    character.damageTaken += damage
    character.health -= damage
}

function renderCharacter() {
    characterSection.innerHTML = `` 
    characters.sort((a,b) => b.initiative - a.initiative)
    characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
            <img class="image" src="${character.image}" alt="${character.name}">
            <img class="cardDelete" src="plus.svg" alt="delete card button"></img>
            <div class="name"><p>${character.name}</p></div>
            <div class="stats"><p>Species: ${character.species}</p>
            <p>Class: ${character.class}</p>
            <p class="health">Damage Taken: ${character.damageTaken}</p>
            <div class="buttons">
            <input type="number" class="damageInput">
            <button class="atkButton">Attacked</button>
            </div>
`


    const atkButton = card.querySelector('.atkButton')
    const healthDisplay = card.querySelector(".health")
    const cardDelete = card.querySelector(".cardDelete")

    cardDelete.addEventListener("click", () =>{
        deleteCard(card, character)
    });

    card.addEventListener("click", () =>{
        if (card.classList.contains("hidden")) {
            card.classList.remove("hidden")
            card.classList.add("unhidden")
        } else if (card.classList.contains("unhidden")) {
            card.classList.remove("unhidden")
        }
    });

    atkButton.addEventListener("click", () =>{
        damageInput = card.querySelector('.damageInput')
        damage = Number(damageInput.value)
        damageInput.value = null

        if (isNaN(damage)) return;

        attacked(character, damage)
        if (character.health <= 0) {
            healthDisplay.textContent = `DEAD`
            card.classList.add("blurr")
        } else if (character.health <= character.maxHealth / 2) {
            healthDisplay.textContent = `Damage Taken: ${character.damageTaken} - BLOODIED`
        } else {
            healthDisplay.textContent = `Damage Taken: ${character.damageTaken}`
        }
        
    });

    
card.appendChild(createDropdownEditor(character));
characterSection.appendChild(card);

})
};

function createDropdownEditor(character) {
    const form = document.createElement('form')
    form.classList.add("dropdownEditor")
    form.setAttribute("action", "")
    form.addEventListener("submit", function (e) {
        e.preventDefault()
    });

    const select = document.createElement('select')
    const input = document.createElement('input')

    Object.keys(character).forEach(key => {
        if (key === "id") return;
        const option = document.createElement("option")
        option.value = key
        option.textContent = key
        select.appendChild(option);
    });

    let currentKey = select.value
    input.value = character[currentKey]
    input.type = typeof character[currentKey] === "number" ? "number" : "text";

    select.addEventListener('change', ()=>{
        currentKey = select.value
        input.value = character[currentKey]
        input.type = typeof character[currentKey] === "number" ? "number" : "text";

    });

    input.addEventListener('input', (e) =>{
        if (input.type === "number") {
            character[currentKey] = Number(e.target.value)
        } else {
            character[currentKey] = e.target.value
        }
        
    });

    form.appendChild(select);
    form.appendChild(input);

    return form;

}

const InitButton = document.querySelector('.InitiativeFormButton')
const initButtonImage = document.querySelector('.buttonImage')
const rerenderButton = document.querySelector(".rerender")
const setInitiativeButton = document.querySelector(".setInitiative")
initButtonImage.src = "plus.svg"

InitButton.addEventListener("click", ()=>{
    initForm.classList.toggle("hide");
    if (initButtonImage.src.includes("plus.svg")) {
        initButtonImage.src = "minus.svg"
    } else {
        initButtonImage.src = "plus.svg"
    }
});


rerenderButton.addEventListener("click", () =>{
    renderCharacter()
    hideCards()
    renderInitiativeForm()
});

function renderInitiativeForm () {
    const initiativeForm = document.querySelector(".subForm")
    const form = document.createElement('form')
    form.classList.add("setInitiative")
    initiativeForm.innerHTML = ''

    form.addEventListener("submit", function (e) {
        e.preventDefault()
    });

    const select = document.createElement('select')
    const input = document.createElement('input')

    characters.forEach(character => {
        const option = document.createElement("option");
        option.value = character.name;
        option.textContent = character.name;
        select.appendChild(option);
    });

    let selectedCharacter = characters.find(
        char => char.name === select.value
    );

    input.value = selectedCharacter.initiative

    select.addEventListener('change', () => {
        selectedCharacter = characters.find(
            char => char.name === select.value
        );

        input.value = selectedCharacter.initiative;
    });

    // When input changes → update initiative
    input.addEventListener("input", (e) => {
        selectedCharacter.initiative = Number(e.target.value);
    });

    form.appendChild(select);
    form.appendChild(input);
    initiativeForm.appendChild(form);

}

function createNewCharacter() {

}

function createNewCharacterForm() {
    const newCharacterForm = document.createElement('form')
    newCharacterForm.classList.add('newCharacterForm')

    const characterTemplate = {
        id: 0,
        name: '',
        species: '',
        class: '',
        health: 100,
        maxHealth: 100,
        image: "shadowedFigure.webp",
        initiative: 0,
        damageTaken: 0
    }

    newCharacterForm.addEventListener('submit', (e) =>{
        e.preventDefault()
        
        const formData = new FormData(newCharacterForm)

        const newCharacter = {
            id: characters.length + 1,
            name: formData.get("name") || characterTemplate.name,
            species: formData.get("species") || characterTemplate.species,
            class: formData.get("class") || characterTemplate.class,
            health: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            maxHealth: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            image: formData.get("image") || characterTemplate.image,
            initiative: formData.get("initiative") === "" ? characterTemplate.initiative : Number(formData.get("initiative")),
            damageTaken: formData.get("damageTaken") === "" ? characterTemplate.damageTaken : Number(formData.get("damageTaken"))

        }
        characters.push(newCharacter)
    });



    Object.keys(characterTemplate).forEach(key =>{
        if (key === "id") return;
        if (key === "damageTaken") return;
        let input = document.createElement("input")
        let label = document.createElement("label")
        let optionDiv = document.createElement("div")
        optionDiv.classList.add("optionDiv")

        label.textContent = key
        input.name = key
        input.type = typeof characterTemplate[key] === "number" ? "number" : "text"

        optionDiv.appendChild(label)
        optionDiv.appendChild(input)
        newCharacterForm.appendChild(optionDiv)
    });

    let submit = document.createElement("button")
    submit.setAttribute("type","submit")
    submit.textContent = "New Character"


    newCharacterForm.appendChild(submit)
    initForm.appendChild(newCharacterForm)
};


createNewCharacterForm()
renderInitiativeForm()

