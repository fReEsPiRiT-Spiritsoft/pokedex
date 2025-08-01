/**
 * Displays the loading animation overlay.
 */
function showLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Hides the loading animation and shows the main app container.
 * Also starts the arena video.
 */
function hideLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    if (loadingScreen && mainApp) {
        loadingScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        // Start arena video
        initializeArena();
    }
}

/**
 * Initializes the arena video and sets up fallback to PNG if video fails or ends.
 */
function initializeArena() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');
    if (arenaVideo) {
        arenaVideo.play().catch(error => {
            handleArenaVideoEnd();
        });
        arenaVideo.addEventListener('ended', handleArenaVideoEnd);
        setTimeout(() => {
            if (arenaVideo.currentTime === 0) {
                handleArenaVideoEnd();
            }
        }, 3000);
    }
}

/**
 * Handles the fade-out transition of the arena video and triggers the background display.
 */
function handleArenaVideoEnd() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');
    if (arenaVideo && arenaBackground) {
        arenaVideo.style.opacity = '0';
        arenaVideo.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            showArenaBackground(arenaVideo, arenaBackground);
        }, 100);
    }
}

/**
 * Displays the arena background image and fades it in after the video is hidden.
 * @param {HTMLElement} arenaVideo - The video element to hide.
 * @param {HTMLElement} arenaBackground - The background element to show.
 */
function showArenaBackground(arenaVideo, arenaBackground) {
    arenaVideo.style.display = 'none';
    arenaBackground.classList.remove('hidden');
    arenaBackground.style.opacity = '0';
    arenaBackground.style.transition = 'opacity 1.5s ease-out';
    requestAnimationFrame(() => {
        arenaBackground.style.opacity = '1';
    });
}

function goHome() {
    const selection = document.querySelector('.pokemon-selection');
        selection.classList.remove('active');
        selection.style.display = 'none';
}

/**
 * Selects a Pokémon and transitions from selection view to arena view.
 * Animates Pokéball and displays the selected Pokémon in the arena.
 * @param {Object} pokemonData - The selected Pokémon object.
 */
function selectPokemon(pokemonData) {
    currentPokemon = pokemonData;
    const selection = document.querySelector('.pokemon-selection');
    if (selection) {
        selection.classList.remove('active');
        selection.style.display = 'none';
    }
    document.getElementById('open-selection-btn').style.display = 'none';
    animatePokeballToArena(() => {
        displayPokemonInArena(pokemonData);
    });
}

/**
 * Animates the Pokéball flying to the arena and calls the callback when finished.
 * @param {Function} callback - Function to call after animation ends.
 */
function animatePokeballToArena(callback) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
        playPokeballSound();
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToArena 2s ease-in-out forwards';
        setTimeout(() => {
            pokeballAnimation.classList.add('hidden');
            if (callback) callback();
        }, 2000);
    } else if (callback) {
        callback();
    }
}

/**
 * Initializes the Pokédex application: loads Pokémon, sets up UI and event listeners.
 * @returns {Promise<void>}
 */
async function initializePokedex() {
    showLoadingAnimation();
    try {
        allPokemon = await PokemonAPI.loadPokemonList(150);
        hideLoadingAnimation();
        displayPokemonCards();
        setupEventListeners();
    } catch (error) {
        hideLoadingAnimation();
    }
}

/**
 * Sets up all main event listeners for search and filter functionality.
 */
function setupEventListeners() {
    setupSearchListeners();
    setupFilterListeners();
}

/**
 * Sets up event listeners for the Pokémon search input and button.
 */
function setupSearchListeners() {
    const searchInput = document.getElementById('pokemon-search');
    const searchBtn = document.getElementById('search-btn');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

/**
 * Sets up event listeners for all filter buttons in the UI.
 */
function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterType = btn.dataset.type;
            filterPokemonByType(filterType);
        });
    });
}

/**
 * Hides the 'Load More' button in the Pokémon card grid.
 */
function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-card');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

/**
 * Shows the 'Load More' button in the Pokémon card grid.
 */
function showLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-card');
    if (loadMoreBtn) loadMoreBtn.style.display = 'flex';
}

/**
 * Handles Pokémon search input and updates the card grid accordingly.
 */
function handleSearch() {
    const searchInput = document.getElementById('pokemon-search');
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
        const searchResults = PokemonAPI.searchPokemon(query);
        displayPokemonCards(searchResults);
        hideLoadMoreButton();
    } else {
        displayPokemonCards();
        showLoadMoreButton();
    }
}

/**
 * Filters the loaded Pokémon by type and updates the card grid.
 * @param {string} type - Pokémon type to filter by (or 'all').
 */
function filterPokemonByType(type) {
    if (type === 'all') {
        displayPokemonCards();
    } else {
        const filteredPokemon = allPokemon.filter(pokemon =>
            pokemon.types.includes(type)
        );
        displayPokemonCards(filteredPokemon);
    }
}

/**
 * Displays Pokémon cards in the selection grid.
 * @param {Array} [pokemonList=allPokemon] - Array of Pokémon to display.
 */
function displayPokemonCards(pokemonList = allPokemon) {
    const selectionSection = document.querySelector('.pokemon-selection');
    if (!selectionSection) return;
    let grid = document.getElementById('pokemon-cards-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.id = 'pokemon-cards-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
        grid.style.gap = '20px';
        selectionSection.appendChild(grid);
    }
    addPokeCard(pokemonList = allPokemon);
}

/**
 * Closes the Pokémon card overlay modal.
 */
function closeCardOverlay() {
    document.getElementById('card-overlay').classList.add('hidden');
}

/**
 * Hides the currently displayed Pokémon in the arena.
 */
function hidePokemon() {
    const selectedPokemon = document.getElementById('selected-pokemon');
    if (selectedPokemon) {
        selectedPokemon.classList.add('hidden');
    }
}

/**
 * Shows the Pokémon selection view.
 */
function showPokemonSelection() {
    document.querySelector('.pokemon-selection').style.display = 'block';
}

/**
 * Animates the Pokéball flying back to the selection view and triggers UI updates after animation.
 * @param {boolean} [showSelection=true] - Whether to show the selection after animation.
 */
function animatePokeballBack(showSelection = true) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
        playPokeballSound();
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToSelection 2s ease-in-out forwards';
        setTimeout(() => {
            handlePokeballBackEnd(showSelection);
        }, 2000);
    }
}

/**
 * Handles the UI updates after the Pokéball back animation ends.
 * @param {boolean} showSelection - Whether to show the selection after animation.
 */
function handlePokeballBackEnd(showSelection) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) pokeballAnimation.classList.add('hidden');
    const openBtn = document.getElementById('open-selection-btn');
    if (openBtn) openBtn.style.display = 'block';
    if (showSelection) showPokemonSelection();
}

/**
 * Hides the current Pokémon and animates the Pokéball back to selection.
 */
function backToBall() {
    hidePokemon();
    animatePokeballBack(true);
    
}

/**
 * Toggles the visibility of the filter button group in the UI.
 */
function showFilterBTN() {
    const filterBtn = document.getElementById('show-filter-btn');
    const filterContainer = document.querySelector('div.filter-btn-group');
    filterContainer.classList.toggle('hidden');
}

/**
 * Loads more Pokémon from the API and appends them to the current list.
 * Updates the card grid and hides the loading animation.
 * @returns {Promise<void>}
 */
async function loadMorePokemonFromAPI() {
    showLoadingAnimation();
    try {
        const newPokemon = await PokemonAPI.loadPokemonList(50, currentOffset);
        allPokemon = [...allPokemon, ...newPokemon.filter(p => p)];
        currentOffset += 50;
        displayPokemonCards(allPokemon);
    } catch (error) {
    } finally {
        hideLoadingAnimation();
    }
}

/**
 * Sets up hover event listeners to show/hide the close hint in the Pokémon info box.
 */
function showCloseInformation() {
    const infoBox = document.getElementById('pokemon-info');
    const closeHint = document.getElementById('close-hint');
    if (infoBox && closeHint) {
        infoBox.addEventListener('mouseenter', () => {
            closeHint.style.display = 'block';
        });
        infoBox.addEventListener('mouseleave', () => {
            closeHint.style.display = 'none';
        });
    }
}

/**
 * Updates the arena UI elements to display the selected Pokémon.
 * Sets sprite, name, types, and stats, and triggers animation.
 * @param {Object} pokemonData - The Pokémon object containing all display data.
 */
function updateArenaUI(pokemonData) {
    const selectedPokemon = document.getElementById('selected-pokemon');
    const pokemonSprite = document.getElementById('pokemon-sprite');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');

    if (selectedPokemon && pokemonSprite && pokemonName) {
        setPokemonElements(pokemonData, pokemonSprite, pokemonName, pokemonTypes, pokemonStats);
        showPokemon(selectedPokemon);
    }
}

/**
 * Sets the content of the arena UI elements for the selected Pokémon.
 * @param {Object} data - The Pokémon data object.
 * @param {HTMLElement} spriteEl - The image element for the Pokémon sprite.
 * @param {HTMLElement} nameEl - The element for the Pokémon name.
 * @param {HTMLElement} typesEl - The element for the Pokémon types.
 * @param {HTMLElement} statsEl - The element for the Pokémon stats.
 */
function setPokemonElements(data, spriteEl, nameEl, typesEl, statsEl) {
    const arenaHTML = getPokemonArenaHTML(data);
    spriteEl.src = arenaHTML.spriteSrc;
    spriteEl.alt = arenaHTML.spriteAlt;
    nameEl.textContent = arenaHTML.name;
    if (typesEl) typesEl.innerHTML = arenaHTML.typesHTML;
    if (statsEl) statsEl.innerHTML = arenaHTML.statsHTML;
}

/**
 * Shows the Pokémon container in the arena and triggers the appear animation.
 * @param {HTMLElement} container - The container element to show.
 */
function showPokemon(container) {
    container.classList.remove('hidden');
    container.style.animation = 'pokemonAppear 1s ease-in-out forwards';
}
/**
 * Displays the selected Pokémon in the arena, shows info hint and plays the Pokémon cry.
 * @param {Object} pokemonData - The Pokémon object to display.
 */
function displayPokemonInArena(pokemonData) {
    updateArenaUI(pokemonData);
    showCloseInformation();
    playPokemonCry(pokemonData.id.toString().padStart(3, '0'), pokemonData.name);
}

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
