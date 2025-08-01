/**
 * Prepares the data object for the Pokémon overlay card template.
 * @param {Object} pokemon - The Pokémon object.
 * @returns {Object} Prepared data for the template.
 */
function prepareCardOverlayData(pokemon) {
    return {
        id: pokemon.id.toString().padStart(3, '0'),
        englishName: pokemon.name,
        name: pokemon.germanName || pokemon.name || 'Unbekannt',
        sprite: pokemon.sprites.official || pokemon.sprites.front,
        typesHTML: pokemonTypesTemplate(pokemon.types),
        statsHTML: pokemonStatsTemplate(pokemon.stats || {}),
        size: getPokemonSize(pokemon),
        abilities: getPokemonAbilities(pokemon)
    };
}

/**
 * Returns the HTML string for the Pokémon overlay card.
 * @param {Object} pokemon - The Pokémon object.
 * @returns {string} HTML string for the overlay card.
 */
function getCardOverlayHTML(pokemon) {
    const data = prepareCardOverlayData(pokemon);
    return cardOverlayTemplate(data);
}

/**
 * Returns the formatted size object for the Pokémon.
 * @param {Object} pokemon - The Pokémon object.
 * @returns {Object} Object with height and weight as strings.
 */
function getPokemonSize(pokemon) {
    return {
        height: pokemon.height ? pokemon.height / 10 + ' m' : '-',
        weight: pokemon.weight ? pokemon.weight / 10 + ' kg' : '-'
    };
}

/**
 * Returns the formatted abilities string for the Pokémon.
 * @param {Object} pokemon - The Pokémon object.
 * @returns {string} Abilities as a comma-separated string or fallback.
 */
function getPokemonAbilities(pokemon) {
    return Array.isArray(pokemon.abilities) && pokemon.abilities.length > 0
        ? pokemon.abilities.join(', ')
        : 'Keine Fähigkeiten gefunden';
}

/**
 * Creates and appends the "Load More Pokémon" card to the grid.
 */
function loadMorePokemonTemplate() {
    const grid = document.getElementById('pokemon-cards');
    if (!grid) return;
    const moreCard = document.createElement('div');
    moreCard.className = 'pokemon-card load-more-card';
    moreCard.innerHTML = loadMorePokemonHTML();
    moreCard.onclick = () => loadMorePokemonFromAPI();
    grid.appendChild(moreCard);
}

/**
 * Prepares the arena data for a Pokémon and returns an object with HTML strings.
 * This function does NOT contain any direct HTML.
 * @param {Object} pokemonData - The Pokémon object.
 * @returns {Object} Object with spriteSrc, spriteAlt, name, typesHTML, and statsHTML.
 */
function getPokemonArenaHTML(pokemonData) {
    return {
        spriteSrc: pokemonData.sprites.official || pokemonData.sprites.front,
        spriteAlt: pokemonData.germanName,
        name: pokemonData.germanName,
        typesHTML: pokemonTypesArenaTemplate(pokemonData.types),
        statsHTML: pokemonStatsArenaTemplate(pokemonData.stats)
    };
}

/**
 * Sets up an event listener to close the card overlay when clicking outside the content area or buttons.
 * The overlay is only closed if the user clicks directly on the overlay background,
 * not on the overlay content or any buttons inside the overlay.
 */
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('card-overlay');
    const overlayContent = document.getElementById('card-overlay-content');
    const closeBtn = document.getElementById('close-card-overlay');
    overlay.addEventListener('click', function (event) {
        if (
            event.target === overlay &&
            event.target !== overlayContent &&
            !overlayContent.contains(event.target)
        ) {
            closeBtn.click();
        }
    });
});

/**
 * Sets up an event listener to close the card overlay when clicking outside from the modal.
 */
document.addEventListener('DOMContentLoaded', () => {
    const backgrnd = document.getElementById('arena-background');
    const closeBtn = document.getElementById('close-card-overlay');
    if (backgrnd && closeBtn) {
        backgrnd.addEventListener('click', () => {
            closeBtn.click();
        });
    }
});

/**
 * Sets up event listener for opening the Pokémon selection view when the Pokéball button is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-selection-btn');
    const selection = document.querySelector('.pokemon-selection');
    if (openBtn && selection) {
        openBtn.addEventListener('click', () => {
            selection.classList.add('active');
            selection.style.display = 'block';
            // openBtn.style.display = 'none';
        });
    }
});

/**
 * Opens the settings/info modal when the settings button is clicked.
 */
document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').classList.remove('hidden');
};

/**
 * Closes the settings/info modal when the close button is clicked.
 */
document.getElementById('close-settings-modal').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};

/**
 * Closes the settings/info modal when the overlay is clicked.
 */
document.querySelector('.modal-overlay').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};

/**
 * Shows the selected modal section (Impressum, Copyright, Portfolio, etc.) in the settings modal.
 * @param {string} section - Section name to show (e.g. 'impressum').
 */
function showModalSection(section) {
    document.querySelectorAll('.modal-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('modal-' + section).classList.remove('hidden');
}

/**
 * Initializes the Pokédex app when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', initializePokedex);