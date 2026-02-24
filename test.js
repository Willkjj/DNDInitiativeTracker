const characterSection = document.querySelector('.charactersSection')

let characters = [
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
    },
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
    }
];
characters.forEach(character => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <img class="image" src="${character.image}" alt="${character.name}">
        <div class="name"><p>${character.name}</p></div>
        <div class="stats">
            <p>Class: ${character.class}</p>
            <p class="health">Health: ${character.health}</p>
            <p class="level">Level: ${character.level}</p>
        </div>
        <div class="buttons">
            <button class="atkButton">Attacked</button>
            <button class="lvlUpButton">Level Up</button>
        </div>
    `;

    const atkButton = card.querySelector('.atkButton');
    const lvlUpButton = card.querySelector('.lvlUpButton');
    const healthDisplay = card.querySelector('.health');
    const levelDisplay = card.querySelector('.level');

    atkButton.addEventListener("click", () => {
        character.attacked();
        healthDisplay.textContent = `Health: ${character.health}`;
    });

    lvlUpButton.addEventListener("click", () => {
        character.levelUp();
        levelDisplay.textContent = `Level: ${character.level}`;
    });

    characterSection.appendChild(card);
});