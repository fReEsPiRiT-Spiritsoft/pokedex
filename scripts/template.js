/**
 *  Zeigt das ausgewählte Pokemon in der Arena an
 */
function displayPokemonInArena(pokemonData) {
    const selectedPokemon = document.getElementById('selected-pokemon');
    const pokemonSprite = document.getElementById('pokemon-sprite');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');
    if (selectedPokemon && pokemonSprite && pokemonName) {
        pokemonSprite.src = pokemonData.sprites.official || pokemonData.sprites.front;
        pokemonSprite.alt = pokemonData.germanName;
        pokemonName.textContent = pokemonData.germanName;
        if (pokemonTypes) {
            pokemonTypes.innerHTML = pokemonData.types
                .map(type => `<span class="type type-${type}">${getGermanTypeName(type)}</span>`)
                .join('');
        }
        if (pokemonStats) {
            pokemonStats.innerHTML = `
                <div class="stat">
                    <span>KP:</span>
                    <span>${pokemonData.stats.hp}</span>
                </div>
                <div class="stat">
                    <span>Angriff:</span>
                    <span>${pokemonData.stats.attack}</span>
                </div>
                <div class="stat">
                    <span>Verteidigung:</span>
                    <span>${pokemonData.stats.defense}</span>
                </div>
                <div class="stat">
                    <span>Initiative:</span>
                    <span>${pokemonData.stats.speed}</span>
                </div>
            `;
        }
        selectedPokemon.classList.remove('hidden');
        selectedPokemon.style.animation = 'pokemonAppear 1s ease-in-out forwards';
        console.log(`✨ ${pokemonData.germanName} erscheint in der Arena!`);
    }
}

/**
 *  Übersetzt den englischen Typennamen in den deutschen Typennamen
 */
function getGermanTypeName(englishType) {
    const typeTranslations = {
        'fire': 'Feuer',
        'water': 'Wasser',
        'grass': 'Pflanze',
        'electric': 'Elektro',
        'psychic': 'Psycho',
        'ice': 'Eis',
        'dragon': 'Drache',
        'dark': 'Unlicht',
        'fairy': 'Fee',
        'fighting': 'Kampf',
        'poison': 'Gift',
        'ground': 'Boden',
        'flying': 'Flug',
        'bug': 'Käfer',
        'rock': 'Gestein',
        'ghost': 'Geist',
        'steel': 'Stahl',
        'normal': 'Normal'
    };
    return typeTranslations[englishType] || englishType;
}

function loadMorePokemonTemplate() {
    const grid = document.getElementById('pokemon-cards');
    if (!grid) return;
    const moreCard = document.createElement('div');
    moreCard.className = 'pokemon-card load-more-card';
    moreCard.innerHTML = `
        <img src="./img/more.png" alt="Mehr laden" style="width:100px;height:100px;">
        <h3>Mehr laden</h3>
        <div><span>Weitere Pokémon anzeigen</span></div>
    `;
    moreCard.onclick = () => loadMorePokemonFromAPI();
    grid.appendChild(moreCard);
}

/**
 *  Spielt den Pokeball-Wurf-Sound ab
 */
function playPokeballSound() {
    const audio = new Audio('./sounds/pokeball.mp3');
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    audio.volume = volume;
    audio.play();
}

/**
 *  Spielt den Soundeffekt für den Kartenwechsel ab
 */
function playCardSwitchSound() {
    const audio = new Audio('./sounds/switchcard.mp3');
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    audio.volume = volume;
    audio.play();
}

/**
 *  Spielt die Hintergrundmusik ab
 */
function playBackgroundSound() {
    if (!backgroundAudio) {
        backgroundAudio = new Audio('./sounds/backgroundmusik.mp3');
        backgroundAudio.loop = true;
    }
    const volumeSlider = document.getElementById('volumeMusik');
    let volume = 0.4;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    backgroundAudio.volume = volume;
    backgroundAudio.play();
}

/**
 *  Lautstärke bei Änderung des Sliders anpassen
 */
document.getElementById('volume').addEventListener('input', function () {
});

document.getElementById('volumeMusik').addEventListener('input', function () {
    if (backgroundAudio) {
        let volume = Math.max(0, Math.min(1, this.value / 11));
        backgroundAudio.volume = volume;
    }
});