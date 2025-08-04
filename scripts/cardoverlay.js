let viewMode = 'arena';
let currentCardIndex = 0;

/**
 *  switch between arena and card view
 * @param {string} mode - 'arena' or 'card'
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
 *  Open the card overlay for a specific Pokémon Card
 * @param {Object} pokemon - Pokémon data object
 * @param {number} idx - Index of the Pokémon in the list
 */
function openCardOverlay(pokemonList, idx) {
    playCardSwitchSound();
    const overlay = document.getElementById('card-overlay');
    overlay.classList.remove('hidden');
    currentCardIndex = idx;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    setupCardOverlayNavigation(pokemonList);
}


/**
 * Setup navigation for the card overlay.
 * @param {Array} pokemonList - List of all Pokémon.
 */
function setupCardOverlayNavigation(pokemonList) {
    document.getElementById('prev-pokemon').onclick = () => prevPokemon(pokemonList);
    document.getElementById('next-pokemon').onclick = () => nextPokemon(pokemonList);
    document.getElementById('close-card-overlay').onclick = closeCardOverlay;
}

/**
 * Goes to the previous Pokémon in the list.
 *  @param {Array} pokemonList - List of all Pokémon.
 */
function prevPokemon(pokemonList) {
    currentCardIndex = (currentCardIndex - 1 + pokemonList.length) % pokemonList.length;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    playCardSwitchSound();
}

/**
 *  Goes to the next Pokémon in the list.
 * @param {Array} pokemonList - List of all Pokémon.
 */
function nextPokemon(pokemonList) {
    currentCardIndex = (currentCardIndex + 1) % pokemonList.length;
    renderCardOverlayContent(pokemonList[currentCardIndex]);
    playCardSwitchSound();
}

/**
 *  Closes the card overlay.
 */
function closeCardOverlay() {
    document.getElementById('card-overlay').classList.add('hidden');
}

/** *  Generates the HTML for the Pokémon card overlay.
 * @param {Object} pokemon - Pokémon data object
 * @return {string} HTML string for the Pokémon card overlay
 */
function renderCardOverlayContent(pokemon) {
    const content = document.getElementById('card-overlay-content');
    content.className = 'card-overlay-content';
    if (pokemon.types && pokemon.types.length > 0) {
        content.classList.add('type-' + pokemon.types[0]);
    }
    content.innerHTML = getCardOverlayHTML(pokemon);
}