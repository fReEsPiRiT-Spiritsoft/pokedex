function pokemonStatsArenaTemplate(stats) {
    return `
        <div class="stat">
            <span>KP:</span>
            <span>${stats.hp}</span>
        </div>
        <div class="stat">
            <span>Angriff:</span>
            <span>${stats.attack}</span>
        </div>
        <div class="stat">
            <span>Verteidigung:</span>
            <span>${stats.defense}</span>
        </div>
        <div class="stat">
            <span>Initiative:</span>
            <span>${stats.speed}</span>
        </div>
    `;
}

function pokemonTypesArenaTemplate(types) {
    return types
        .map(type => `<span class="type type-${type}">${getGermanTypeName(type)}</span>`)
        .join('');
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

function loadMorePokemonHTML() {
    return `
        <img src="./img/more.png" alt="Mehr laden" style="width:100px;height:100px;">
        <h3>Mehr laden</h3>
        <div><span>Weitere Pokémon anzeigen</span></div>
    `;
}

function cardOverlayTemplate(data) {
    return `
        <div onclick="playPokemonCry('${data.id}', '${data.englishName}')" class="pokemon-card large">
            <img src="${data.sprite}" alt="${data.name}" style="width:180px;height:180px;">
            <h2>${data.name}</h2>
            <div>${data.typesHTML}</div>
            <div class="pokemon-stats">
                ${data.statsHTML}
            </div>
            <div>Größe: ${data.size.height} &nbsp; Gewicht: ${data.size.weight}</div>
            <div>Fähigkeiten: ${data.abilities}</div>
        </div>
    `;
}

function pokemonStatsTemplate(stats) {
    return `
        <div class="stat"><span>KP:</span><span>${stats.hp ?? '-'}</span></div>
        <div class="stat"><span>Angriff:</span><span>${stats.attack ?? '-'}</span></div>
        <div class="stat"><span>Verteidigung:</span><span>${stats.defense ?? '-'}</span></div>
        <div class="stat"><span>Initiative:</span><span>${stats.speed ?? '-'}</span></div>
    `;
}

function pokemonTypesTemplate(types) {
    return types.map(
        t => `<span class="type type-${t}">${getGermanTypeName(t)}</span>`
    ).join(' ');
}

function getPokemonCardHTML(pokemon) {
    return `
        <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${pokemon.germanName}" style="width:100px;height:100px;">
        <h3>${pokemon.germanName}</h3>
        <div>${pokemon.types.map(t => `<span>${getGermanTypeName(t)}</span>`).join(' ')}</div>
    `;
}