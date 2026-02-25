const characterSection = document.querySelector('.charactersSection')
const initForm = document.querySelector('.initiativeForm')

let characters = [
    {
        id: 1,
        name: 'Snortleblat',
        species: 'Swamp Beast Diplomat',
        health: 100,
        maxHealth: 100,
        image: "snortleblat.webp",
        initiative: 0,
        damageTaken: 0
    },
    {
        id: 2,
        name: 'Bortlesnat',
        species: 'Swamp Beast Diplomat',
        health: 100,
        maxHealth: 100,
        image: "snortleblat.webp",
        initiative : 0,
        damageTaken: 0
    }
];
renderCharacter()
function renderCharacter() {
    characterSection.innerHTML = `` 
    characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
            <img class="image" src="${character.image}" alt="${character.name}">
            <div class="name"><p>${character.name}</p></div>
            <div class="stats"><p>Species: ${character.species}</p>
            <p class="health">Damage Taken: ${character.damageTaken}</p>
            <div class="buttons">
            <input type="number" class="damageInput">
            <button class="atkButton">Attacked</button>
            </div>
`
    function attacked(character,damage) { 
        character.damageTaken += damage
        character.health -= damage
    }

    const atkButton = card.querySelector('.atkButton')
    const healthDisplay = card.querySelector(".health")


    card.classList.add("hidden")
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
        const damage = Number(damageInput.value)

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

    
    characters.sort((a,b) => b.initiative - a.initiative)
card.appendChild(createDropdownEditor(character));
characterSection.appendChild(card);

})};

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
            health: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            maxHealth: formData.get("health") === "" ? characterTemplate.health : Number(formData.get("health")),
            image: formData.get("image") || characterTemplate.image,
            initiative: formData.get("initiative") === "" ? characterTemplate.initiative : Number(formData.get("initiative")),
            damageTaken: formData.get("damageTaken") === "" ? characterTemplate.damageTaken : Number(formData.get("damageTaken"))

        }
        characters.push(newCharacter)
        console.log(newCharacter)

        newCharacterForm.reset()
    });



    Object.keys(characterTemplate).forEach(key =>{
        if (key === "id") return;
        if (key === "damageTaken") return;
        let input = document.createElement("input")
        let label = document.createElement("label")

        label.textContent = key
        input.name = key
        input.type = typeof characterTemplate[key] === "number" ? "number" : "text"

        newCharacterForm.appendChild(label)
        newCharacterForm.appendChild(input)
    });

    let submit = document.createElement("button")
    submit.setAttribute("type","submit")
    submit.textContent = "New Character"


    newCharacterForm.appendChild(submit)
    initForm.appendChild(newCharacterForm)
};


createNewCharacterForm()
renderInitiativeForm()

