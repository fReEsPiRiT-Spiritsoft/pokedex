let viewMode = 'arena'; // 'arena' oder 'card'
let currentCardIndex = 0;

/**
 *  umschaltet zwischen Arena- und Kartenansicht
 * @param {string} mode - 'arena' oder 'card'
 */
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

/**
 *  creates a Pokemon card element
 * @param {Object} pokemon - Pokemon data object
 * @param {number} idx - Index of the Pokemon in the list
 * @param {Array} pokemonList - List of all Pokemon
 */
function createPokemonCard(pokemon, idx, pokemonList) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = getPokemonCardHTML(pokemon);
    card.onclick = () => {
        if (viewMode === 'arena') {
            selectPokemon(pokemon);
        } else {
            currentCardIndex = idx;
            openCardOverlay(pokemonList, idx);
        }
    };
    return card;
}

/**shows the Pokemon cards in the grid
 * @param {Array} pokemonList - List of Pokemon to display
 * If not provided, uses the global `allPokemon` array
 * If `allPokemon` is empty, it will fetch the Pokemon from the API
 * and display them
 */
function displayPokemonCards(pokemonList = allPokemon) {
    const grid = document.getElementById('pokemon-cards');
    if (!grid) return;
    grid.innerHTML = '';
    pokemonList.forEach((pokemon, idx) => {
        const card = createPokemonCard(pokemon, idx, pokemonList);
        grid.appendChild(card);
    });
    loadMorePokemonTemplate();
}

/**
 *  Öffnet das Overlay für die Pokemon-Karte
 */
function openCardOverlay(pokemonList, idx) {
    playCardSwitchSound();
    const overlay = document.getElementById('card-overlay');
    overlay.classList.remove('hidden');
    currentCardIndex = idx;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    setupCardOverlayNavigation(pokemonList);
}

function setupCardOverlayNavigation(pokemonList) {
    document.getElementById('prev-pokemon').onclick = () => prevPokemon(pokemonList);
    document.getElementById('next-pokemon').onclick = () => nextPokemon(pokemonList);
    document.getElementById('close-card-overlay').onclick = closeCardOverlay;
}

function prevPokemon(pokemonList) {
    currentCardIndex = (currentCardIndex - 1 + pokemonList.length) % pokemonList.length;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    playCardSwitchSound();
}

function nextPokemon(pokemonList) {
    currentCardIndex = (currentCardIndex + 1) % pokemonList.length;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    playCardSwitchSound();
}

function closeCardOverlay() {
    document.getElementById('card-overlay').classList.add('hidden');
}

function renderCardOverlayContent(pokemon) {
    const content = document.getElementById('card-overlay-content');
    content.className = 'card-overlay-content';
    if (pokemon.types && pokemon.types.length > 0) {
        content.classList.add('type-' + pokemon.types[0]);
    }
    content.innerHTML = getCardOverlayHTML(pokemon);
}