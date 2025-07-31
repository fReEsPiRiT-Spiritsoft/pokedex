/**
 *  Zeigt das ausgewählte Pokemon in der Arena an
 */
function getPokemonArenaHTML(pokemonData) {
    const typesHTML = pokemonData.types
        .map(type => `<span class="type type-${type}">${getGermanTypeName(type)}</span>`)
        .join('');
    const statsHTML = `
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
    return {
        spriteSrc: pokemonData.sprites.official || pokemonData.sprites.front,
        spriteAlt: pokemonData.germanName,
        name: pokemonData.germanName,
        typesHTML,
        statsHTML
    };
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

function getCardOverlayHTML(pokemon) {
    const name = pokemon.germanName || pokemon.name || 'Unbekannt';
    const abilities = Array.isArray(pokemon.abilities) && pokemon.abilities.length > 0
        ? pokemon.abilities.join(', ')
        : 'Keine Fähigkeiten gefunden';
    const id = pokemon.id.toString().padStart(3, '0');
    return `
        <div onclick="playPokemonCry('${id}', '${pokemon.name}')" class="pokemon-card large">
            <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${name}" style="width:180px;height:180px;">
            <h2>${name}</h2>
            <div>${pokemon.types.map(t => `<span class="type type-${t}">${getGermanTypeName(t)}</span>`).join(' ')}</div>
            <div class="pokemon-stats">
                <div class="stat"><span>KP:</span><span>${pokemon.stats?.hp ?? '-'}</span></div>
                <div class="stat"><span>Angriff:</span><span>${pokemon.stats?.attack ?? '-'}</span></div>
                <div class="stat"><span>Verteidigung:</span><span>${pokemon.stats?.defense ?? '-'}</span></div>
                <div class="stat"><span>Initiative:</span><span>${pokemon.stats?.speed ?? '-'}</span></div>
            </div>
            <div>Größe: ${pokemon.height ? pokemon.height / 10 + ' m' : '-' } &nbsp; Gewicht: ${pokemon.weight ? pokemon.weight / 10 + ' kg' : '-'}</div>
            <div>Fähigkeiten: ${abilities}</div>
        </div>
    `;
}

function getPokemonCardHTML(pokemon) {
    return `
        <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${pokemon.germanName}" style="width:100px;height:100px;">
        <h3>${pokemon.germanName}</h3>
        <div>${pokemon.types.map(t => `<span>${getGermanTypeName(t)}</span>`).join(' ')}</div>
    `;
}