let viewMode = 'arena'; // 'arena' oder 'card'
let currentCardIndex = 0;

// Umschalter
document.getElementById('arena-view-btn').onclick = () => {
    viewMode = 'arena';
    document.getElementById('arena-view-btn').classList.add('active');
    document.getElementById('card-view-btn').classList.remove('active');
};
document.getElementById('card-view-btn').onclick = () => {
    viewMode = 'card';
    document.getElementById('arena-view-btn').classList.remove('active');
    document.getElementById('card-view-btn').classList.add('active');
};

function displayPokemonCards(pokemonList = allPokemon) {
    const grid = document.getElementById('pokemon-cards');
    if (!grid) return;

    grid.innerHTML = '';

    pokemonList.forEach((pokemon, idx) => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${pokemon.germanName}" style="width:100px;height:100px;">
            <h3>${pokemon.germanName}</h3>
            <div>${pokemon.types.map(t => `<span>${getGermanTypeName(t)}</span>`).join(' ')}</div>
        `;
        card.onclick = () => {
            if (viewMode === 'arena') {
                selectPokemon(pokemon);
            } else {
                currentCardIndex = idx;
                openCardOverlay(pokemonList, idx);
            }
        };
        grid.appendChild(card);
    });
}

// Overlay öffnen
function openCardOverlay(pokemonList, idx) {
    const overlay = document.getElementById('card-overlay');
    const content = document.getElementById('card-overlay-content');
    overlay.classList.remove('hidden');
    renderCardOverlayContent(pokemonList[idx]);
    // Navigation
    document.getElementById('prev-pokemon').onclick = () => {
        currentCardIndex = (currentCardIndex - 1 + pokemonList.length) % pokemonList.length;
        renderCardOverlayContent(pokemonList[currentCardIndex]);
    };
    document.getElementById('next-pokemon').onclick = () => {
        currentCardIndex = (currentCardIndex + 1) % pokemonList.length;
        renderCardOverlayContent(pokemonList[currentCardIndex]);
    };
    document.getElementById('close-card-overlay').onclick = () => {
        overlay.classList.add('hidden');
    };
}

// Overlay-Inhalt rendern (angepasst an dein Kartendesign)
function renderCardOverlayContent(pokemon) {
    const content = document.getElementById('card-overlay-content');
    // Typ-Klasse setzen (erster Typ)
    content.className = '';
    if (pokemon.types && pokemon.types.length > 0) {
        content.classList.add('type-' + pokemon.types[0]);
    }
    content.innerHTML = `
        <div class="pokemon-card large">
            <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${pokemon.germanName}" style="width:180px;height:180px;">
            <h2>${pokemon.germanName}</h2>
            <div>${pokemon.types.map(t => `<span class="type type-${t}">${getGermanTypeName(t)}</span>`).join(' ')}</div>
            <div class="pokemon-stats">
                <div class="stat"><span>KP:</span><span>${pokemon.stats.hp}</span></div>
                <div class="stat"><span>Angriff:</span><span>${pokemon.stats.attack}</span></div>
                <div class="stat"><span>Verteidigung:</span><span>${pokemon.stats.defense}</span></div>
                <div class="stat"><span>Initiative:</span><span>${pokemon.stats.speed}</span></div>
            </div>
            <div>Größe: ${pokemon.height / 10} m &nbsp; Gewicht: ${pokemon.weight / 10} kg</div>
            <div>Fähigkeiten: ${pokemon.abilities.join(', ')}</div>
        </div>
    `;
}