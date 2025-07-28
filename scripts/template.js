function displayPokemonInArena(pokemonData) {
    const selectedPokemon = document.getElementById('selected-pokemon');
    const pokemonSprite = document.getElementById('pokemon-sprite');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');   
    if (selectedPokemon && pokemonSprite && pokemonName) {
        // Pokemon Bild setzen
        pokemonSprite.src = pokemonData.sprites.official || pokemonData.sprites.front;
        pokemonSprite.alt = pokemonData.germanName;  
        // Pokemon Name
        pokemonName.textContent = pokemonData.germanName;
        // Pokemon Typen
        if (pokemonTypes) {
            pokemonTypes.innerHTML = pokemonData.types
                .map(type => `<span class="type type-${type}">${getGermanTypeName(type)}</span>`)
                .join('');
        }       
        // Pokemon Stats
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
      // Pokemon in Arena einblenden
        selectedPokemon.classList.remove('hidden');
        selectedPokemon.style.animation = 'pokemonAppear 1s ease-in-out forwards';
        
        console.log(`✨ ${pokemonData.germanName} erscheint in der Arena!`);
    }
}


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