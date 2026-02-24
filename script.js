const characterSection = document.querySelector('.charactersSection')

let characters = [
    {
        name: 'Snortleblat',
        class: 'Swamp Beast Diplomat',
        level: 8,
        health: 100,
        image: "snortleblat.webp",
        attacked : function() {
            return this.health = this.health - 20
        },
        levelUp : function() {
            return this.level ++
        }
    },
    {
        name: 'Bortleblat',
        class: 'Swamp Beast Diplomat',
        level: 8,
        health: 100,
        image: "snortleblat.webp",
        attacked : function() {
            return this.health = this.health - 20
        },
        levelUp : function() {
            return this.level ++
        }
    }
];
characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
            <img class="image" src="${character.image}" alt="${character.name}">
            <div class="name"><p>${character.name}</p></div>
            <div class="stats"><p>Class: ${character.class}</p>
            <p class="health">Health: ${character.health}</p>
            <p class="lvl">Level: ${character.level}</p></div>
            <div class="buttons">
            <button class="atkButton">Attacked</button>
            <button class="lvlUpButton">Level Up</button>
            </div>
`

    const atkButton = card.querySelector('.atkButton')
    const lvlUpButton = card.querySelector('.lvlUpButton')
    const healthDisplay = card.querySelector(".health")
    const lvlDisplay = card.querySelector(".lvl")

    atkButton.addEventListener("click", () =>{
        character.attacked()
        if (character.health > 0) {
            healthDisplay.textContent = `Health: ${character.health}`
        } else {
            healthDisplay.textContent = `Health: DEAD`
            card.classList.add("blurr")
        }
        
    });
    lvlUpButton.addEventListener("click", () => {
        character.levelUp()
        lvlDisplay.textContent = `Level: ${character.level}`

    });

    characterSection.appendChild(card);

});

